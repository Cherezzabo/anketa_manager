<?php

$House = [];
if ($_POST['HOUSE'] == "Y") {

    $handle = fopen("q1.csv", "r");
    while (($data = fgetcsv($handle, 1000, ";")) !== FALSE) {
        $House[$row]['name'] = $data[0];
        $House[$row]['questions']['1'] = $data[1];
        $House[$row]['questions']['2'] = $data[2];
        $House[$row]['questions']['3'] = $data[3];
        $House[$row]['questions']['4'] = $data[4];
        $House[$row]['questions']['5'] = $data[5];
        $row++;
    }
    echo json_encode($House, JSON_UNESCAPED_UNICODE);

    fclose($handle);
}

if ($_POST['NAME'] == "Y") {
    $handle = fopen("f.csv", "r");
    $c = 0;
    while (($data = fgetcsv($handle, 1000, ";")) !== FALSE) {

        $result[$c] = ['name' => $data[0]];


        $c ++;
    }
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
    fclose($handle);
}
//if ($_POST['NAME'] == "Y") {
//
//
//    $data = array(
//        0 => array('name' => 'Золотарев Кирилл'),
//        1 => array('name' => 'Исмаилов Артем'),
//        2 => array('name' => 'Артемов Кирилл'),
//        3 => array('name' => 'Золотарев Александр Игоревич'),
//    );
//
//    echo json_encode($data, JSON_UNESCAPED_UNICODE);
//}






//fclose($handle);

    