<?php
include "../Connection/connection.php";
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
            if (isset($_GET['prodname'])) {
                $prodname = $_GET['prodname']; // Get the product name from the query parameter

                // Query the database to check the stock status of the product
                $result = mysqli_query($conn, "SELECT Qty FROM products WHERE prodname = '$prodname'");

                if ($result) {
                    if (mysqli_num_rows($result) > 0) {
                        $row = mysqli_fetch_assoc($result);
                        $outOfStock = $row['Qty'] == 0;

                        // Return the stock status as JSON
                        echo json_encode(["outOfStock" => $outOfStock]);
                    } else {
                        echo json_encode(["error" => "Product not found"]);
                    }
                } else {
                    echo json_encode(["error" => "Failed to check stock status"]);
                }
            } else {
                $allproduct = mysqli_query($conn, "SELECT * FROM products ");
                if (mysqli_num_rows($allproduct) > 0) {
                    while ($row = mysqli_fetch_array($allproduct)) {
                        $json_array['productdata'][] = array(
                            "id" => $row['prodid'],
                            "prodname" => $row['prodname'],
                            "prodType" => $row['prodType'],
                            "qty" => $row['Qty'],
                            "img" =>  $row['img']
                        );
                    }
                    echo json_encode($json_array["productdata"]);
                } else {
                    echo json_encode(["Result" => "please check the data"]);
                }
            }
            break;
    }
}
