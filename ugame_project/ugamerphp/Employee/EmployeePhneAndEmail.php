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
                $id = $path[5];

                // Query to fetch customer phone data
                $getemployeePhoneRow = mysqli_query($conn, "SELECT id,Contact FROM tbl_employeephone WHERE id='$id'");
                $getemployeeemailRow = mysqli_query($conn, "SELECT id,email FROM tbl_employeeemail WHERE id='$id'");

                if ($getemployeePhoneRow && $getemployeeemailRow) {
                    $employeephoneUpdate = array();
                    while ($PhoneRow = mysqli_fetch_array($getemployeePhoneRow)) {
                        $employeephoneUpdate[] = array(
                            'id' => $PhoneRow['id'],
                            'contact' => $PhoneRow['Contact'],
                        );
                    }
                    $json_array['employeephoneUpdate'] = $employeephoneUpdate;

                    $employeeemailUpdate = array();
                    while ($emailRow = mysqli_fetch_array($getemployeeemailRow)) {
                        $employeeemailUpdate[] = array(
                            'id' => $emailRow['id'],
                            'email' => $emailRow['email'],
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
                            'id' => $row['id'],
                            'email' => $row['email'],
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
