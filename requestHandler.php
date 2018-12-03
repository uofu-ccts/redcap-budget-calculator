<?php

$module = new \UIOWA\ServiceCalculator\ServiceCalculator();

if ($_REQUEST['type'] == 'submit') {
    $module->saveRequestToProject();
}