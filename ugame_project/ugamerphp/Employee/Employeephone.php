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
            $allEmpData = mysqli_query($conn, "SELECT * FROM tbl_employeephone");
            if (mysqli_num_rows($allEmpData) > 0) {
                $json_array = array();
                while ($row = mysqli_fetch_array($allEmpData)) {
                    $EmpName = $row['empname'];
                    $json_array[] = array(
                        'id' => $row['id'],
                        'EmpName' => $row['empname'],
                        'Contact' => $row['Contact'],

                    );
                }
                echo json_encode($json_array);
            } else {
                echo json_encode(["result" => "Please check data!"]);
            }
            break;
        case "POST":
            $postData = json_decode(file_get_contents("php://input"), true);
            $results = array();

            foreach ($postData as $data) {

                $empName = $data['empName'];
                $contact = $data['Contact'];

                // Insert data into tbl_employeephone
                $sqlPhone = "INSERT INTO tbl_employeephone (empname, Contact) VALUES ('$empName', '$contact')";
                $resPhone = mysqli_query($conn, $sqlPhone);

                if ($resPhone) {
                    $results[] = "Phone number added successfully for: $empName";
                } else {
                    $results[] = "Error inserting phone number for: $empName - " . mysqli_error($conn);
                }
            }

            $conn->close();
            $response = array("success" => true, "result" => $results);
            echo json_encode($response);
            break;
        default:;
    }
}
