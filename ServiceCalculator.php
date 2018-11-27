<?php
namespace UIOWA\ServiceCalculator;

use ExternalModules\AbstractExternalModule;
use ExternalModules\ExternalModules;

require_once 'vendor/autoload.php';

class ServiceCalculator extends AbstractExternalModule
{
    private static $smarty;

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
        $servicesData = \REDCap::getData($this->getSystemSetting("project-id"), 'array');

        $sql = "
                SELECT element_enum
                FROM redcap_metadata
                WHERE project_id = " . $this->getSystemSetting("project-id") . " AND field_name = 'per_service'
            ";

        $result = db_query($sql);

        $servicesQuantityLabels = db_fetch_assoc($result);

        ?>

        <script>
            var servicesData = <?= json_encode($servicesData) ?>;
            var servicesQuantityLabels = <?= json_encode($servicesQuantityLabels) ?>;
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
    }

}
?>




