<?php
/** @var \UIOWA\BudgetCalculator\BudgetCalculator $module */

/**
 * This API is for QA testing and integration testing purposes.
 * 
 * To hit this endpoint from a trusted third-party service, add
 * NOAUTH to the URI and update the config.json's no-auth-pages
 * array. For testing purposes, this endpoint does not prevent
 * JSON returns for public calls that fail authentication. Instead
 * it returns false for the value of validcaller.
 */ 

// Comment out following line to prevent caller validation
$validCaller = $module->verifyApiCaller();

$content = array ('validcaller'=>$validCaller,'first_param'=>$_REQUEST['someparam'],'second_param'=>$_REQUEST['anotherparam']);
header('Content-type: application/json');
echo json_encode($content);
