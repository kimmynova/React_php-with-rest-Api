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
            if (isset($_GET['filter'])) {
                $filter = $_GET['filter'];

                $query = "SELECT * FROM tbl_purchaseorder WHERE DATE_FORMAT(purdate, '%Y-%m') = '$filter'";

                // Execute the query and fetch the filtered data
                $result = mysqli_query($conn, $query);
                if (mysqli_num_rows($result) > 0) {
                    $filteredData = array();
                    while ($row = mysqli_fetch_assoc($result)) {
                        $filteredData[] = $row;
                    }

                    echo json_encode(['filteredData' => $filteredData]);
                } else {
                    echo json_encode(['No' => ["No Data found"]]);
                }
            } else {
                echo json_encode([]);
            }


            break;
    }
}
