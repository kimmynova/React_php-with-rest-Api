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
            if (isset($_GET['prodDate'])) {
                $filter = $_GET['prodDate'];

                // $query = "SELECT * FROM products  WHERE DATE_FORMAT(proDate, '%Y-%m') = '$filter'";
                $query = "SELECT p.prodid, p.prodName,prodDate, p.prodType, p.Qty, p.img, pp.Cost,pp.prodprice, pp.Remark,pp.prodDate 
                FROM products p
                INNER JOIN productprice pp ON p.prodid = pp.prodid
                WHERE DATE_FORMAT(pp.prodDate, '%Y-%m') = '$filter';
                ";
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
// // if (mysqli_connect_error()) {
// //     echo json_encode(["error" => "Database connection error"]);
// //     exit;
// // } else {
// //     $method = $_SERVER['REQUEST_METHOD'];
// //     switch ($method) {
// //         case "GET":
// //             if (isset($_GET['prodDate'])) {
// //                 $filter = $_GET['prodDate'];

// //                 $query1 = "SELECT prodid, prodDate, Cost, prodprice, Remark FROM productprice WHERE DATE_FORMAT(prodDate, '%Y-%m') = '$filter'";
// //                 $query2 = "SELECT p.prodid, p.prodName, p.prodType, p.Qty, p.img, pp.Cost, pp.prodprice, pp.Remark, pp.prodDate
// //                            FROM products p
// //                            INNER JOIN productprice pp ON p.prodid = pp.prodid
// //                            WHERE DATE_FORMAT(pp.prodDate, '%Y-%m') = '$filter'";

// //                 // Execute the first query
// //                 $result1 = mysqli_query($conn, $query1);

// //                 // Execute the second query
// //                 $result2 = mysqli_query($conn, $query2);

// //                 if (mysqli_num_rows($result2) > 0) {
// //                     $filteredData = array();
// //                     while ($row = mysqli_fetch_assoc($result2)) {
// //                         $filteredData[] = $row;
// //                     }

// //                     echo json_encode(['filteredData' => $filteredData]);
// //                 } elseif (mysqli_num_rows($result1) > 0) {
// //                     $filteredData1 = array();
// //                     while ($row1 = mysqli_fetch_assoc($result1)) {
// //                         $filteredData1[] = $row1;
// //                     }

// //                     echo json_encode(['filteredData' => $filteredData1]);
// //                 } else {
// //                     echo json_encode(['No' => ["No Data found"]]);
// //                 }
// //             } else {
// //                 echo json_encode([]);
// //             }
// //             break;
//     }
// }