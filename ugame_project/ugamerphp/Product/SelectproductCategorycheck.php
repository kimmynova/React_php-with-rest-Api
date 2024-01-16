<?php
include "../Connection/connection.php";
include "../GenerateUniqkey/Unip_key_ID.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json");

$json_array = array();

if (mysqli_connect_error()) {
    echo mysqli_connect_error();
    exit;
} else {
    if (isset($_GET['allproductCategory'])) {
        // Fetch product data
        $allproduct = mysqli_query($conn, "SELECT * FROM products");
        if (mysqli_num_rows($allproduct) > 0) {
            $json_array = array(); // Create a new JSON array to hold all data
            while ($row = mysqli_fetch_array($allproduct)) {
                $prodid = $row['prodid'];

                $getprice = mysqli_query($conn, "SELECT p.prodid, p.prodname, MAX(pp.prodprice) AS lastProdPrice, MAX(pp.Cost) AS LastCost
                        FROM products p
                        LEFT JOIN productprice pp ON p.prodid = pp.prodid
                        WHERE p.prodid='$prodid'
                        GROUP BY p.prodid, p.prodname;");

                $priceRow = mysqli_fetch_array($getprice);

                // Combine data from 'products' and 'productprice' tables
                $combinedData = array(
                    "id" => $row['prodid'],
                    "prodname" => $row['prodname'],
                    "prodType" => $row['prodType'],
                    "qty" => $row['Qty'],
                    "img" => $row['img'],
                    "Cost" => $priceRow['LastCost'],
                    "prodprice" => $priceRow['lastProdPrice']
                );

                $json_array['productdata'][] = $combinedData;
            }
            echo json_encode($json_array["productdata"]);
            return;
        } else {
            echo json_encode(["Result" => "No product data found"]);
        }
    }

    // Fetch category data
    $allCategoryData = mysqli_query($conn, "SELECT * FROM category");
    if (mysqli_num_rows($allCategoryData) > 0) {
        $json_array = array();
        while ($row = mysqli_fetch_array($allCategoryData)) {
            $cname[] = $row['Cname'];
            $json_array[] = array(
                'id' => $row['id'],
                'Type' => $row['Cname'],
            );
        }
        echo json_encode($json_array);
    } else {
        echo json_encode(["result" => "No category data found"]);
    }
}
