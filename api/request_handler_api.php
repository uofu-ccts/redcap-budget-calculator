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

// 'reqtype' determines the verb being dealt with.
// TODO: These four reqtypes still need to be tested and responses turned into proper JSON, probably when the ReactJS is mostly done.

if ($_REQUEST['reqtype'] == 'save') {
    $module->saveBudgetToProject();

    //Response code 200 ... OK
    http_response_code(200);

    //JSON response
    $response_arr = ["SUCCESS"];
    echo json_encode($response_arr);
}
if ($_REQUEST['reqtype'] == 'rename') {
    $data = array(
        'token' => $module->getSystemSetting('save-token'),
        'content' => 'record',
        'format' => 'json',
        'data' => file_get_contents('php://input')
    );

    //Response code 200 ... OK
    http_response_code(200);

    echo $module->redcapApiCall($data);//TODO: JSON format?
}
if ($_REQUEST['reqtype'] == 'delete') {
    $data = array(
        'token' => $module->getSystemSetting('save-token'),
        'content' => 'record',
        'action' => 'delete',
        'records' => json_decode($_REQUEST['records'])
    );

    //Response code 200 ... OK
    http_response_code(200);

    echo $module->redcapApiCall($data);//TODO: JSON format?
}
else if ($_REQUEST['reqtype'] == 'createTemplate') {
    $content = file_get_contents($module->getUrl('ServiceCatalogTemplate.xml'));

    $data = array(
        'token' => $_POST['token'],
        'content' => 'project',
        'format' => 'json',
        'data' => '[{
            "project_title": "' . $_POST['title'] . '",
            "purpose": 4
        }]',
        'odm' => $content
    );

    $token = $module->redcapApiCall($data);

    $pid = db_query('SELECT project_id FROM redcap_user_rights WHERE api_token = "' . $token . '"');
    $pid = db_fetch_assoc($pid)['project_id'];

    $module->setSystemSetting("reference-pid", $pid);

    //Response code 200 ... OK
    http_response_code(200);

    echo $pid;//TODO: JSON format?
}