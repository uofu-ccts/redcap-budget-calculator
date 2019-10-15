<?php
/** @var \UIOWA\BudgetCalculator\BudgetCalculator $module */

// Uncomment following lines to add validation
// if (! $module->verifyApiCaller())
// {
//   echo('{"error":"authentication failure"}');
//   return;
// }

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

//setting up array of records for converting to JSON
$response_arr = $module->getRateFields();


//Response code 200 ... OK
http_response_code(200);

//JSON response
echo json_encode($response_arr);