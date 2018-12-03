<?php
namespace UIOWA\ServiceCalculator;

use ExternalModules\AbstractExternalModule;
use ExternalModules\ExternalModules;

require_once 'vendor/autoload.php';

class ServiceCalculator extends AbstractExternalModule
{
    private static $smarty;

    public static $apiUrl = APP_PATH_WEBROOT_FULL . 'api/';

    public function __construct()
    {
        parent::__construct();
        define("MODULE_DOCROOT", $this->getModulePath());
    }

    public function initializeSmarty()
    {
        self::$smarty = new \Smarty();
        self::$smarty->setTemplateDir(MODULE_DOCROOT . 'templates');
        self::$smarty->setCompileDir(MODULE_DOCROOT . 'templates_c');
        self::$smarty->setConfigDir(MODULE_DOCROOT . 'configs');
        self::$smarty->setCacheDir(MODULE_DOCROOT . 'cache');
    }

    public function setTemplateVariable($key, $value)
    {
        self::$smarty->assign($key, $value);
    }

    public function displayTemplate($template)
    {
        self::$smarty->display($template);
    }

    public function getServiceInfo()
    {
        $servicesData = \REDCap::getData($this->getSystemSetting("reference-pid"), 'array');

        $sql = "
                SELECT element_enum
                FROM redcap_metadata
                WHERE project_id = " . $this->getSystemSetting("reference-pid") . " AND field_name = 'per_service'
            ";

        $result = $this->query($sql);

        $servicesQuantityLabels = db_fetch_assoc($result);

        ?>

        <script>
            var servicesData = <?= json_encode($servicesData) ?>;
            var servicesQuantityLabels = <?= json_encode($servicesQuantityLabels) ?>;

            var requestUrl = '<?= $this->getUrl('requestHandler.php') ?>';
            var apiUrl = '<?= APP_PATH_WEBROOT_FULL ?>api';

            var currentUser = '<?= USERID ?>';
        </script>

        <?php
    }

    public function setSmartyVariables()
    {
        $headerInfo = array(
            'clinical' => array(
                array(
                    'title' => '',
                    'style' => 'border-right-style:hidden; width: 3%;'
                ),
                array(
                    'title' => 'Clinical Service',
                    'style' => 'width: 25%;'
                ),
                array(
                    'title' => 'Industry Rate',
                ),
                array(
                    'title' => 'Federal Rate',
                ),
                array(
                    'title' => 'Subjects',
                ),
                array(
                    'title' => 'Quantity Type',
                ),
                array(
                    'title' => 'Visits',
                    'colspan' => 6
                ),
                array(
                    'title' => 'Cost Per Subject',
                ),
                array(
                    'title' => 'Total Cost',
                    'style' => 'width: 10%;'
                )
            ),
            'nonClinical' => array(
                array(
                    'title' => '',
                    'style' => 'border-right-style:hidden; width: 3%;'
                ),
                array(
                    'title' => 'Non-Clinical Service',
                    'style' => 'width: 25%;'
                ),
                array(
                    'title' => 'Industry Rate',
                ),
                array(
                    'title' => 'Federal Rate',
                ),
                array(
                    'title' => 'Quantity',
                ),
                array(
                    'title' => 'Quantity Type',
                ),
                array(
                    'title' => '',
                    'colspan' => 7
                ),
                array(
                    'title' => 'Total Cost',
                )
            )
        );

        $headerCounts = array(
            'clinical' => 0,
            'nonClinical' => 0
        );

        foreach ($headerInfo as $index => $tableHeaders) {
            foreach ($tableHeaders as $header) {
                if ($header['colspan']) {
                    $headerCounts[$index] += $header['colspan'];
                }
                else {
                    $headerCounts[$index] += 1;
                }
            }
        }

        $logoSrc = $this->getUrl('/resources/logo.png');

        self::$smarty->assign('headerInfo', $headerInfo);
        self::$smarty->assign('headerCounts', $headerCounts);
        self::$smarty->assign('logo', $logoSrc);
        self::$smarty->assign('submitEnabled', $this->getSystemSetting('submission-target'));
        self::$smarty->assign('exportEnabled', $this->getSystemSetting('export-enabled'));
        self::$smarty->assign('submissionDialogBody', $this->getSystemSetting('submission-dialog'));

        // Prepare additional fields if project submission is enabled
        if ($this->getSystemSetting("target-pid") != null && $this->getSystemSetting('submission-target') == 1) {
            $targetPID = $this->getSystemSetting("target-pid");
            $submissionFields = array_merge($this->getSystemSetting('submission-field'), ['username', 'first_name', 'last_name', 'email']);
            $submissionFieldLookup = [];
            $userInfo = null;

            $sql = "SELECT * FROM redcap_metadata WHERE project_id = $targetPID AND form_name = 'requester_info' ORDER BY field_order";
            $result = $this->query($sql);

            if (USERID) {
                $userInfo = $this->query("
                  SELECT
                      username AS 'username',
                      user_firstname AS 'first_name',
                      user_lastname AS 'last_name',
                      user_email AS 'email'
                  FROM redcap_user_information
                  WHERE username = '" . USERID . "'
                ");

                $userInfo = db_fetch_assoc($userInfo);
            }

            while ($row = db_fetch_assoc($result)) {
                if (array_search($row['field_name'], $submissionFields) !== false) {
                    $fieldInfo = array(
                        'name' => $row['field_name'],
                        'label' => $row['element_label'],
                        'type' => $row['element_type'],
                        'choices' => $row['element_enum']
                    );

                    if ($userInfo) {
                        $fieldInfo['value'] = $userInfo[$row['field_name']];
                    }

                    array_push($submissionFieldLookup, $fieldInfo);
                }
            }

            self::$smarty->assign('submissionFields', $submissionFieldLookup);
        }
    }

    public function saveRequestToProject() {
        $data = json_decode(file_get_contents('php://input'), true);
        $pid = $this->getSystemSetting('submission-pid');

        $nextRecordId = $this->query(
            "
              SELECT
                MAX(CAST(record AS SIGNED)) AS 'lastRecordId'
              FROM redcap_data
              WHERE project_id = $pid
        ");

        $nextRecordId = intval(db_fetch_assoc($nextRecordId)['lastRecordId']) + 1;

        foreach ($data as $index => $lineItem) {
            $data[$index]['record_id'] = $nextRecordId;
        }

//        $userInfo = $this->query(
//            "
//              SELECT
//                  username AS 'username',
//                  user_firstname AS 'first_name',
//                  user_lastname AS 'last_name',
//                  user_email AS 'email'
//              FROM redcap_user_information
//              WHERE username = '" . USERID . "'
//        ");
//
//        $userInfo = db_fetch_assoc($userInfo);
//        $userInfo['record_id'] = $nextRecordId;
//
//        array_push($data, $userInfo);

        return json_encode(\REDCap::saveData($pid, 'json', json_encode($data)));
//        \REDCap::saveData($pid, 'json', json_encode($data));
    }

    public function redcapApiCall($data) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, self::$apiUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_VERBOSE, 0);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_AUTOREFERER, true);
        curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch, CURLOPT_FRESH_CONNECT, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data, '', '&'));
        $output = curl_exec($ch);
        curl_close($ch);

        return $output;
    }
}
?>




