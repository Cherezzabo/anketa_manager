<?php

//oproshouse_trm
//X2f5P8r0
echo '<pre>';
var_dump($_POST);

$link = mysqli_connect("zolotarev-studio.ru", "oproshouse_trm", "X2f5P8r0", "oproshouse_trm");

if (!$link) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$name = $_POST['building'];
$house = $_POST['user_names'];
$q1 = $_POST['extra1'];
$q2 = $_POST['extra2'];
$q3 = $_POST['extra3'];
$q4 = $_POST['extra4'];
$q5 = $_POST['extra5'];
$other = $_POST['other'];

$link->set_charset("utf8");
$link->query("INSERT INTO `oproshouse_trm`.`answer` (user,house,q1,q2,q3,q4,q5,other) VALUES ('{$name}','{$house}','{$q1}','{$q2}','{$q3}','{$q4}','{$q5}','{$other}')");

mysqli_close($link);


header('Location: http://anketa.terem-pro.ru/');
