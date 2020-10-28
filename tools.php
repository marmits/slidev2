<?php
set_include_path(get_include_path().PATH_SEPARATOR.'/files');
$test = get_include_path();
$data = $test;
header('Content-type:application/json;charset=utf-8');
echo json_encode($data);





Class Data
{


}