<?php
/** @var \UIOWA\ServiceCalculator\ServiceCalculator $module */

$page = new HtmlPage();
$page->PrintHeaderExt();


if (!$module->getSystemSetting("reference-pid")) {
    exit('Please define a source project in the module config');
}

$module->initializeSmarty();

?>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto|Varela+Round|Open+Sans">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <script src="<?= $module->getUrl("resources/underscore-min.js") ?>"></script>
    <script src="<?= $module->getUrl("resources/jspdf.min.js") ?>"></script>
    <script src="<?= $module->getUrl("resources/jspdf.plugin.autotable.min.js") ?>"></script>

    <link rel="stylesheet" href="<?= $module->getUrl("resources/styles.css") ?>">

    <script src="<?= $module->getUrl("ServiceCalculator.js") ?>"></script>
<?php

$module->getServiceInfo();
$module->setSmartyVariables();

$module->displayTemplate('index.tpl');