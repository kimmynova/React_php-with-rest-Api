<?php
include "../Connection/connection.php";
// include "../GenerateUniqkey/Unip_key_ID.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");


if (mysqli_connect_error()) {
    echo mysqli_connect_error();
    exit;
} else {
    $method = $_SERVER['REQUEST_METHOD'];
    switch ($method) {
        case "GET":
            $allproduct = mysqli_query($conn, "SELECT prodType FROM products");
            if (mysqli_num_rows($allproduct) > 0) {
                while ($row = mysqli_fetch_array($allproduct)) {
                    $json_array['productdata'][] = array("Type" => $row['prodType']);
                }
                echo json_encode($json_array["productdata"]);
                return;
            } else {
                echo json_encode(["Resault" => "please check the data"]);
            }
            break;
    }
}