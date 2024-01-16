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
        case 'GET':
            $path = explode('/', $_SERVER['REQUEST_URI']);
            if (isset($path[5])) {
                $json_array = array();
                $supid = $path[5];

                // Query to fetch customer phone data
                $getemployeePhoneRow = mysqli_query($conn, "SELECT supid,supPhone FROM tbl_supplierphone WHERE supid='$supid'");
                $getemployeeemailRow = mysqli_query($conn, "SELECT supid,supemail FROM tbl_supplieremail WHERE supid='$supid'");

                if ($getemployeePhoneRow && $getemployeeemailRow) {
                    $employeephoneUpdate = array();
                    while ($PhoneRow = mysqli_fetch_array($getemployeePhoneRow)) {
                        $employeephoneUpdate[] = array(
                            'supid' => $PhoneRow['supid'],
                            'phone' => $PhoneRow['supPhone'],
                        );
                    }
                    $json_array['employeephoneUpdate'] = $employeephoneUpdate;

                    $employeeemailUpdate = array();
                    while ($emailRow = mysqli_fetch_array($getemployeeemailRow)) {
                        $employeeemailUpdate[] = array(
                            'supid' => $emailRow['supid'],
                            'supemail' => $emailRow['supemail'],
                        );
                    }
                    $json_array['employeeemailUpdate'] = $employeeemailUpdate;

                    echo json_encode($json_array);
                } else {
                    // Handle the query execution error here
                    echo mysqli_error($conn);
                }
            } else {
                // Query to fetch employee data from tbl_customer
                $allemployeeData = mysqli_query($conn, "SELECT * FROM tbl_employeeemail");
                if ($allemployeeData) {
                    $json_array = array();
                    while ($row = mysqli_fetch_array($allemployeeData)) {
                        $json_array[] = array(
                            'supid' => $row['supid'],
                            'supemail' => $row['supemail'],
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
