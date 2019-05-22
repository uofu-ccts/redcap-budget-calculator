<?php

$module = new \UIOWA\BudgetCalculator\BudgetCalculator();

if ($_REQUEST['type'] == 'save') {
    $module->saveBudgetToProject();
}
if ($_REQUEST['type'] == 'rename') {
    $data = array(
        'token' => $module->getSystemSetting('save-token'),
        'content' => 'record',
        'format' => 'json',
        'data' => file_get_contents('php://input')
    );

    echo $module->redcapApiCall($data);
}
if ($_REQUEST['type'] == 'delete') {
    $data = array(
        'token' => $module->getSystemSetting('save-token'),
        'content' => 'record',
        'action' => 'delete',
        'records' => json_decode($_REQUEST['records'])
    );

    echo $module->redcapApiCall($data);
}
else if ($_REQUEST['type'] == 'createTemplate') {
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

    echo $pid;
}