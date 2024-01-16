<?php
include "../Connection/connection.php";
include "../GenerateUniqkey/Unip_key_ID.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

if (mysqli_connect_error()) {
    echo mysqli_connect_error();
    exit;
} else {
    $method = $_SERVER['REQUEST_METHOD'];
    switch ($method) {
        case 'GET':
            $path = explode('/', $_SERVER['REQUEST_URI']);
            if (isset($path[5])) {
                $json_array = array();
                $custid = $path[5];

                // Query to fetch customer phone data
                $getCustPhoneRow = mysqli_query($conn, "SELECT custid, Contact FROM tbl_customerphone WHERE custid='$custid'");
                if ($getCustPhoneRow) {
                    $custphoneUpdate = array();
                    while ($CustPhoneRow = mysqli_fetch_array($getCustPhoneRow)) {
                        $custphoneUpdate[] = array(
                            'custid' => $CustPhoneRow['custid'],
                            'contact' => $CustPhoneRow['Contact'],
                        );
                    }
                    $json_array['custphoneUpdate'] = $custphoneUpdate;
                    echo json_encode($json_array);
                } else {
                    // Handle the query execution error here
                    echo mysqli_error($conn);
                }
            } else {
                // Query to fetch employee data from tbl_customer
                $allcustData = mysqli_query($conn, "SELECT * FROM  tbl_customerphone");
                if ($allcustData) {
                    $json_array = array();
                    while ($row = mysqli_fetch_array($allcustData)) {
                        $json_array[] = array(
                            'custid' => $row['custid'],
                            'contact' => $row['contact'],
                        );
                    }
                    echo json_encode($json_array);
                } else {
                    // Handle the query execution error here
                    echo mysqli_error($conn);
                }
            }
            break;
    }
}
