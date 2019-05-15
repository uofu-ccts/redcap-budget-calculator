<?php
/** @var \UIOWA\BudgetCalculator\BudgetCalculator $module */

$page = new HtmlPage();
$page->PrintHeaderExt();

if (!$module->getSystemSetting("noauth-access") & isset($_REQUEST['NOAUTH'])) {
    exit('This page is not available without authentication.');
}
else if (!$module->getSystemSetting("reference-pid")) {
    $token = db_query('
        SELECT
          redcap_user_information.api_token
        FROM redcap_user_information
        WHERE username = "' . USERID . '"');
    $token = db_fetch_assoc($token)['api_token'];

    $baseUrl = APP_PATH_WEBROOT_FULL . APP_PATH_WEBROOT;
    $templateUrl = $module->getUrl('ServiceListTemplate.xml');

    ?>
    <p>
        No reference project has been set. The included template must be loaded and populated with services before the Budget Calculator can be used. Instructions for the configuration process can be found below.
    </p>
    <p>
        <strong>OPTION 1:</strong> Automatically create and link template project (Requires Super API Token)
    </p>
    <ul>
        <li style="list-style-type:none;">
            <button id="createTemplate" onclick="createTemplateProject()" disabled>Create</button>
            <span id="statusMessage"></span>
        </li>
        <li style="list-style-type:none;" id="progressText"></li>
    </ul>
    <p>
        <strong>OPTION 2:</strong> Manually import template project
    </p>
    <ol>
        <li><a style="text-decoration: underline;" href="<?= $templateUrl ?>" download>Download "Service List" project XML</a></li>
        <li>Create a new REDCap project using the XML template</li>
        <li>Select the project as the "Reference project" in module system configuration</li>
    </ol>
    <script>
        var token = '<?= $token ?>';
        var baseUrl = '<?= $baseUrl ?>';
        var button = $('#createTemplate');
        var pid = -1;

        if (token != '') {
            button.prop('disabled', false);
        }

        var createTemplateProject = function() {
            button.prop('disabled', true);

            $.ajax({
                method: 'POST',
                url: '<?= $module->getUrl('requestHandler.php?type=createTemplate&token=') ?>' + '&token=' + token,
                success: function(pid) {
                    $('#statusMessage').html('<span style="color:green">Success!</span>');
                    $('#progressText').html(
                        '<a style="text-decoration: underline;" href="' + baseUrl + 'DataEntry/record_home.php?pid=' + pid + '">' +
                            'Click here to start adding services' +
                        '</a>');
                }
            });
        }
    </script>
    <?php
    exit();
}

?>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto|Varela+Round|Open+Sans">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <script src="<?= $module->getUrl("resources/underscore-min.js") ?>"></script>
    <script src="<?= $module->getUrl("resources/jspdf.min.js") ?>"></script>
    <script src="<?= $module->getUrl("resources/jspdf.plugin.autotable.min.js") ?>"></script>
    <script src="<?= $module->getUrl("resources/jquery.validate.min.js") ?>"></script>
    <script src="<?= $module->getUrl("resources/jquery.smartmenus.js") ?>"></script>
    <script src="<?= $module->getUrl("resources/jquery.are-you-sure.js") ?>"></script>

    <link rel="stylesheet" href="<?= $module->getUrl("resources/sm-core-css.css") ?>">
    <link rel="stylesheet" href="<?= $module->getUrl("resources/sm-blue.css") ?>">
    <link rel="stylesheet" href="<?= $module->getUrl("resources/sm-clean.css") ?>">
    <link rel="stylesheet" href="<?= $module->getUrl("resources/styles.css") ?>">

    <script src="<?= $module->getUrl("BudgetCalculator.js") ?>"></script>
<?php

$module->initializeSmarty();
$module->initializeCalculator();
$module->displayTemplate('index.tpl');