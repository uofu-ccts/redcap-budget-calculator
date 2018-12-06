<?php
namespace UIOWA\BudgetCalculator;

use ExternalModules\AbstractExternalModule;
use ExternalModules\ExternalModules;

require_once 'vendor/autoload.php';

class BudgetCalculator extends AbstractExternalModule
{
    private static $smarty;

    private static $apiUrl = APP_PATH_WEBROOT_FULL . 'api/';

    private static $headerInfo = array(
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

    public function displayTemplate($template)
    {
        self::$smarty->display($template);
    }

    public function initializeCalculator()
    {
        $submissionFieldLookup = [];
        $servicesData = \REDCap::getData($this->getSystemSetting("reference-pid"), 'array');

        $result = $this->query("
                SELECT element_enum
                FROM redcap_metadata
                WHERE project_id = " . $this->getSystemSetting("reference-pid") . " AND field_name = 'per_service'
            ");

        $servicesQuantityLabels = db_fetch_assoc($result);

        $headerCounts = array(
            'clinical' => 0,
            'nonClinical' => 0
        );

        foreach (self::$headerInfo as $index => $tableHeaders) {
            foreach ($tableHeaders as $header) {
                if ($header['colspan']) {
                    $headerCounts[$index] += $header['colspan'];
                }
                else {
                    $headerCounts[$index] += 1;
                }
            }
        }

        // Prepare additional fields if project submission is enabled
        if ($this->getSystemSetting("submission-pid") !== null && $this->getSystemSetting('submission-target') == 1) {
            $targetPID = $this->getSystemSetting("submission-pid");

            $result = $this->query("
                SELECT
                  field_name,
                  element_type,
                  element_label,
                  element_enum,
                  element_note,
                  element_validation_type,
                  field_req,
                  regex_js
                FROM redcap_metadata AS m
                LEFT JOIN redcap_validation_types AS v
                  ON m.element_validation_type = v.validation_name
                WHERE m.project_id = $targetPID
                  AND m.form_name = 'requester_info'
                  AND m.misc = '@USER-DEFINED'
                ORDER BY field_order
            ");

            while ($row = db_fetch_assoc($result)) {
                if ($row['element_type'] == 'yesno') {
                    $row['element_type'] = 'radio';
                    $row['element_enum'] = '1,Yes\n0,No';
                }
                else if ($row['element_type'] == 'truefalse') {
                    $row['element_type'] = 'radio';
                    $row['element_enum'] = '1,True\n0,False';
                }

                $formattedChoices = [];
                $choices = explode('\n', $row['element_enum']);

                foreach ($choices as $choiceStr) {
                    $splitChoice = explode(',', $choiceStr);

                    $newChoice = array(
                        'value' => $splitChoice[0],
                        'label' => $splitChoice[1]
                    );

                    array_push($formattedChoices, $newChoice);
                }

                $row['choices'] = $formattedChoices;

                array_push($submissionFieldLookup, $row);
            }

            // If logged in user, get info
            if (USERID) {
                $result = $this->query("
                  SELECT
                      username AS 'username',
                      user_firstname AS 'first_name',
                      user_lastname AS 'last_name',
                      user_email AS 'email'
                  FROM redcap_user_information
                  WHERE username = '" . USERID . "'
                ");
                $userInfo = db_fetch_assoc($result);

                foreach ($submissionFieldLookup as $index => $value) {
                    $fieldName = $value['field_name'];

                    if ($userInfo[$fieldName]) {
                        $submissionFieldLookup[$index]['value'] = $userInfo[$fieldName];
                    }
                }
            }

            self::$smarty->assign('submissionFields', $submissionFieldLookup);
        }

        $logoSrc = $this->getUrl('/resources/logo.png');

        self::$smarty->assign('headerInfo', self::$headerInfo);
        self::$smarty->assign('headerCounts', $headerCounts);
        self::$smarty->assign('logo', $logoSrc);
        self::$smarty->assign('submitEnabled', $this->getSystemSetting('submission-target'));
        self::$smarty->assign('exportEnabled', $this->getSystemSetting('export-enabled'));
        self::$smarty->assign('submissionDialogBody', $this->getSystemSetting('submission-dialog'));

        ?>

        <script>
            var requestUrl = '<?= $this->getUrl('requestHandler.php') ?>';
            var apiUrl = '<?= self::$apiUrl ?>';
            var currentUser = '<?= USERID ?>';
            var submissionFieldLookup = <?= json_encode($submissionFieldLookup) ?>;
            console.log(<?= json_encode($userInfo) ?>);

            var servicesData = <?= json_encode($servicesData) ?>;
            var servicesQuantityLabels = <?= json_encode($servicesQuantityLabels) ?>;
        </script>

        <?php
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

        return json_encode(\REDCap::saveData($pid, 'json', json_encode($data)));
//        error_log(json_encode(\REDCap::saveData($pid, 'json', json_encode($data))));
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




