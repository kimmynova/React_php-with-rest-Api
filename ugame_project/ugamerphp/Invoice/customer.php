<?php
include "../Connection/connection.php";
include "../GenerateUniqkey/Unip_key_ID.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

if (mysqli_connect_error()) {
    // Proper error handling for database connection errors
    echo "Database connection error: " . mysqli_connect_error();
    exit;
} else {
    $method = $_SERVER['REQUEST_METHOD'];
    switch (strtoupper($method)) { // Make the method case-insensitive

        case "GET":
            $allcustomer = mysqli_query($conn, "SELECT custid, custname, Status FROM tbl_customer");

            if (!$allcustomer) {
                // Handle the SQL query error
                echo "SQL Error: " . mysqli_error($conn);
                exit;
            }

            $json_array['customerdata'] = array();

            while ($row = mysqli_fetch_array($allcustomer)) {
                // Exclude records where 'Status' is equal to 1
                if ($row['Status'] == 0) {
                    $json_array['customerdata'][] = array(
                        "id" => $row['custid'],
                        "custname" => $row['custname'],
                        "Status" => $row['Status']
                    );
                }
            }

            if (!empty($json_array['customerdata'])) {
                echo json_encode($json_array['customerdata']);
            } else {
                echo json_encode(["Result" => "No customers with Status 0 found."]);
            }
            break;

        default:
            // Handle unsupported HTTP methods
            echo json_encode(["Result" => "Unsupported HTTP method"]);
            break;
    }
}
