<?php

$module = new \UIOWA\BudgetCalculator\BudgetCalculator();

if ($_REQUEST['type'] == 'save') {
    $module->saveBudgetToProject();
}
else if ($_REQUEST['type'] == 'createTemplate') {
    $content = htmlentities(file_get_contents($module->getUrl('ServiceListTemplate.xml')));

    $data = array(
        'token' => $_REQUEST['token'],
        'content' => 'project',
        'format' => 'json',
        'data' => '[{
            "project_title": "Service List",
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