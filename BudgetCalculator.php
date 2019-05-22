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
                'title' => 'Base Cost',
            ),
            array(
                'title' => 'Your Cost',
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
                'title' => 'Base Cost',
            ),
            array(
                'title' => 'Your Cost',
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

    public function redcap_module_link_check_display($project_id, $link)
    {
        if ($this->getSystemSetting('noauth-access') == true) {
            $link['url'] = $link['url'] . '&NOAUTH';
        }

        return $link;
    }

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
        $sourcePID = $this->getSystemSetting("reference-pid");
        $submissionFieldLookup = [];
        $rateFieldLookup = [];
        $servicesData = \REDCap::getData($sourcePID, 'array');
        $savedBudgetData = array();
        $savedBudgetLookup = array();

        $result = $this->query("
                SELECT element_enum
                FROM redcap_metadata
                WHERE project_id = $sourcePID AND field_name = 'per_service'
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

        // Get rate fields
        $result = $this->query("
            SELECT
              field_name,
              element_label,
              element_enum
            FROM redcap_metadata AS m
            WHERE project_id = $sourcePID
            ORDER BY field_order
        ");

        while ($row = db_fetch_assoc($result)) {
            $len = strlen($row['field_name']);

            if (substr($row['field_name'], $len - 5, $len) == '_rate') {
                $field = array(
                    'value' => $row['field_name'],
                    'label' => $row['element_label'],
                    'calc' => $row['element_enum']
                );

                array_push($rateFieldLookup, $field);
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

            self::$smarty->assign('submissionFields', $submissionFieldLookup);
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

            if ($this->getSystemSetting("save-token") !== null && $this->getSystemSetting('save-for-later')) {
                $targetSavePID = $this->getProjectIdFromToken($this->getSystemSetting("save-token"));

                // Get previously submitted budgets
                $result = $this->query("
                      SELECT
                        record,
                        event_id
                      FROM redcap_data
                      WHERE project_id = $targetSavePID
                        AND field_name = 'username'
                        AND value = '" . USERID . "'
                    ");

                $recordIds = array();

                while ($row = db_fetch_assoc($result)) {
                    array_push($recordIds, $row['record']);
                    $eventId = $row['event_id'];
                }

                $getData = \REDCap::getData(
                    array(
                        'project_id' => $targetSavePID,
                        'records' => $recordIds
                    )
                );

//                $savedBudgetData = $getData;

                $index = 0;

                foreach ($getData as $record => $data) {
                    $savedBudgetData[$record] = $data[$eventId];
                    $savedBudgetData[$record]['repeat_instances'] = $data['repeat_instances'][$eventId]['service_info'];

                    $savedBudgetLookup[$index]['label'] = $data[$eventId]['budget_title'];
                    $savedBudgetLookup[$index]['value'] = $record;
                    $index++;
                }

                self::$smarty->assign('savedBudgetLookup', $savedBudgetLookup);
            }
        }

        $logoSrc = $this->getUrl('/resources/logo.png');

        self::$smarty->assign('headerInfo', self::$headerInfo);
        self::$smarty->assign('headerCounts', $headerCounts);
        self::$smarty->assign('logo', $logoSrc);
        self::$smarty->assign('submitEnabled', $this->getSystemSetting('submission-target'));
        self::$smarty->assign('exportEnabled', $this->getSystemSetting('export-enabled'));
        self::$smarty->assign('saveEnabled', $this->getSystemSetting('save-for-later') && !isset($_GET['NOAUTH']));
        self::$smarty->assign('submissionDialogBody', $this->getSystemSetting('submission-dialog'));
        self::$smarty->assign('welcomeDialogBody', $this->getSystemSetting('welcome-dialog'));
        self::$smarty->assign('termsText', $this->getSystemSetting('terms-text'));
        self::$smarty->assign('rateFields', $rateFieldLookup);

        ?>

        <script>
            UIOWA_BudgetCalculator.requestUrl = '<?= $this->getUrl('requestHandler.php') ?>';
            UIOWA_BudgetCalculator.apiUrl = '<?= self::$apiUrl ?>';
            UIOWA_BudgetCalculator.currentUser = '<?= USERID ?>';
            UIOWA_BudgetCalculator.submissionFieldLookup = <?= json_encode($submissionFieldLookup) ?>;
            UIOWA_BudgetCalculator.savedBudgets = <?= json_encode($savedBudgetData) ?>;
//            UIOWA_BudgetCalculator.rateLookup = <?//= json_encode($rateFieldLookup) ?>//;

            var servicesData = <?= json_encode($servicesData) ?>;
            var servicesQuantityLabels = <?= json_encode($servicesQuantityLabels) ?>;
        </script>

        <?php
    }

    public function saveBudgetToProject() {
        $data = json_decode(file_get_contents('php://input'), true);
        $pid = $this->getProjectIdFromToken($this->getSystemSetting("save-token"));

        $recordId = $data['record_id'];
        $redcapData = json_decode($data['budget'], true);

        if (!isset($recordId)) {
            $recordId = $this->query(
                "
              SELECT
                MAX(CAST(record AS SIGNED)) AS 'lastRecordId'
              FROM redcap_data
              WHERE project_id = $pid
        ");

            $recordId = intval(db_fetch_assoc($recordId)['lastRecordId']) + 1;
        }

        foreach ($redcapData as $index => $lineItem) {
            $redcapData[$index]['record_id'] = $recordId;
        }

        // need to delete existing record because repeatable forms
        $this->redcapApiCall(
            array(
                'token' => $this->getSystemSetting('save-token'),
                'content' => 'record',
                'action' => 'delete',
                'records' => [$recordId]
            )
        );

        $result = json_encode(\REDCap::saveData($pid, 'json', json_encode($redcapData)));

        echo $result;
    }

    public function getProjectIdFromToken($token) {
        $result = db_query('SELECT project_id FROM redcap_user_rights WHERE api_token = "' . $token . '"');
        return db_fetch_assoc($result)['project_id'];
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




