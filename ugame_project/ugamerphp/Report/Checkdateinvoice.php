<?php
include "../Connection/connection.php";
include "../GenerateUniqkey/Unip_key_ID.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");


if (mysqli_connect_error()) {
    echo json_encode(["error" => "Database connection error"]);
    exit;
} else {
    $method = $_SERVER['REQUEST_METHOD'];
    switch ($method) {
        case "GET":


            if (isset($_GET['invdate'])) {
                $filterinovice = $_GET['invdate'];

                $query = "SELECT * FROM tbl_invoice WHERE DATE_FORMAT(invdate, '%Y-%m') = '$filterinovice'";

                // Execute the query and fetch the filtered data
                $result = mysqli_query($conn, $query);
                if (mysqli_num_rows($result) > 0) {
                    $filterinoviceData = array();
                    while ($row = mysqli_fetch_assoc($result)) {
                        $filterinoviceData[] = $row;
                    }

                    echo json_encode(['filterinoviceData' => $filterinoviceData]);
                } else {
                    echo json_encode(['No' => ["No Data found"]]);
                }
            } else {
                echo json_encode([]);
            }
            break;
    }
}
