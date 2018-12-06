<?php

$module = new \UIOWA\BudgetCalculator\BudgetCalculator();

if ($_REQUEST['type'] == 'submit') {
    $module->saveRequestToProject();
}