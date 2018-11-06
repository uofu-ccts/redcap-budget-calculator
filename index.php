<?php
/** @var \UIOWA\ServiceCalculator\ServiceCalculator $module */

$page = new HtmlPage();
$page->PrintHeaderExt();

$module->initializeSmarty();

?>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto|Varela+Round|Open+Sans">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <script src="<?= $module->getUrl("resources/underscore-min.js") ?>"></script>
    <script src="<?= $module->getUrl("resources/FileSaver.min.js") ?>"></script>
    <script src="<?= $module->getUrl("resources/tableexport.js") ?>"></script>

    <link rel="stylesheet" href="<?= $module->getUrl("resources/styles.css") ?>">
    <link rel="stylesheet" href="<?= $module->getUrl("resources/tableexport.min.css") ?>">

    <script src="<?= $module->getUrl("ServiceCalculator.js") ?>"></script>
<?php

$module->getServiceInfo();
$module->setSmartyVariables();

$module->displayTemplate('index.tpl');