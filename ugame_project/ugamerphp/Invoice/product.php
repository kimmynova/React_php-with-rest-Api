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
            $query = "SELECT p.prodid, p.prodname, MAX(pp.prodprice) AS lastProdPrice
                      FROM products p
                      LEFT JOIN productprice pp ON p.prodid = pp.prodid
                      GROUP BY p.prodid, p.prodname";
            $result = mysqli_query($conn, $query);

            if ($result) {
                $productData = array();

                while ($row = mysqli_fetch_assoc($result)) {
                    $productData[] = array(
                        "prodid" => $row['prodid'],
                        "prodname" => $row['prodname'],
                        "prodprice" => $row['lastProdPrice'],
                    );
                }

                echo json_encode($productData);
            } else {
                echo json_encode(["Result" => "Please check the data"]);
            }
            break;
    }
}
