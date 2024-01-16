<?php
include "../Connection/connection.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, DELETE");
header("Content-Type: application/json");

if (mysqli_connect_error()) {
    echo json_encode(["error" => "Database connection error"]);
    exit;
} else {
    $method = $_SERVER['REQUEST_METHOD'];
    switch ($method) {
        case "GET":
            $path = explode('/', $_SERVER['REQUEST_URI']);
            if (isset($path[5])) {
                $supid = $path[5];

                $stmt1 = $conn->prepare('SELECT * FROM tbl_supplier WHERE supid=?');
                $stmt1->bind_param("s", $supid);
                $stmt1->execute();
                $result1 = $stmt1->get_result();

                if ($result1->num_rows > 0) {
                    $row = $result1->fetch_assoc();

                    // Fetch phone and email details
                    $stmt2 = $conn->prepare('SELECT * FROM tbl_supplierphone WHERE supid=?');
                    $stmt2->bind_param("s", $supid);
                    $stmt2->execute();
                    $result2 = $stmt2->get_result();

                    $stmt3 = $conn->prepare('SELECT * FROM tbl_supplieremail WHERE supid=?');
                    $stmt3->bind_param("s", $supid);
                    $stmt3->execute();
                    $result3 = $stmt3->get_result();

                    // Collect phone and email data into arrays
                    $supPhone = [];
                    while ($phoneRow = $result2->fetch_assoc()) {
                        $supPhone[] = $phoneRow['supPhone'];
                    }

                    $emails = [];
                    while ($emailRow = $result3->fetch_assoc()) {
                        $emails[] = $emailRow['supemail'];
                    }

                    // Create the response JSON
                    $response = [
                        'supid' => $row['supid'], // Changed from 'supid' to 'id'
                        'supName' => $row['supName'],
                        'address' => $row['address'],
                        'supPhone' => $supPhone,
                        'emails' => $emails
                    ];

                    echo json_encode($response);
                } else {
                    echo json_encode(["result" => "supplier not found!"]);
                }
            }
        case "DELETE":
            $data = json_decode(file_get_contents("php://input"));
            if (isset($data->checkedsupIds) && is_array($data->checkedsupIds)) {
                $checkedsupIds = $data->checkedsupIds;

                $placeholders = implode(',', array_fill(0, count($checkedsupIds), '?'));
                $stmt1 = $conn->prepare("DELETE FROM tbl_supplier WHERE supid IN ($placeholders)");
                $stmt2 = $conn->prepare("DELETE FROM tbl_supplierphone WHERE supid IN ($placeholders)");
                $stmt3 = $conn->prepare("DELETE FROM tbl_supplieremail WHERE supid IN ($placeholders)");

                // Binding parameters
                $types = str_repeat('s', count($checkedsupIds));
                $stmt1->bind_param($types, ...$checkedsupIds);
                $stmt2->bind_param($types, ...$checkedsupIds);
                $stmt3->bind_param($types, ...$checkedsupIds);

                $success1 = $stmt1->execute();
                $success2 = $stmt2->execute();
                $success3 = $stmt3->execute();

                if ($success1 && $success2 && $success3) {
                    $deletedCount = $stmt1->affected_rows;
                    echo json_encode(["ok" => "$deletedCount user(s) have been deleted"]);
                } else {
                    echo json_encode(["error" => "Failed to delete user(s)"]);
                }
            }
            break;
        default:
            echo json_encode(["error" => "Invalid request method"]);
    }
}
