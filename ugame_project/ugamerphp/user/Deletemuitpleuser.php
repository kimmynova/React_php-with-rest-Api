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
                $empid = $path[5];

                $stmt1 = $conn->prepare('SELECT * FROM user_login WHERE id=?');
                $stmt1->bind_param("s", $empid);
                $stmt1->execute();
                $result1 = $stmt1->get_result();

                if ($result1->num_rows > 0) {
                    $row = $result1->fetch_assoc();

                    $response = [
                        "id" => $row['id'],
                        "Name" => $row['Name'],
                        "Username" => $row['Username'],
                        "Role" =>  $row['Role'],
                        "img" =>  $row['img']
                    ];

                    echo json_encode($response);
                } else {
                    echo json_encode(["result" => "user not found!"]);
                }
            }
            // case "DELETE":
            //     $data = json_decode(file_get_contents("php://input"));
            //     if (isset($data->checkedUserIds) && is_array($data->checkedUserIds)) {
            //         $checkedUserIds = $data->checkedUserIds;
            //         if (in_array('U-20230-0001', $checkedUserIds)) {
            //             echo json_encode(["ok" => "Delete have been skip this ID"]);
            //         } else {
            //             $placeholders = implode(',', array_fill(0, count($checkedUserIds), '?'));
            //             $stmt1 = $conn->prepare("DELETE FROM user_login WHERE id IN ($placeholders)");


            //             // Binding parameters
            //             $types = str_repeat('s', count($checkedUserIds));
            //             $stmt1->bind_param($types, ...$checkedUserIds);



            //             $success1 = $stmt1->execute();



            //             if ($success1) {
            //                 $deletedCount = $stmt1->affected_rows;
            //                 echo json_encode(["ok" => "$deletedCount products(s) have been deleted"]);
            //             } else {
            //                 echo json_encode(["error" => "Failed to delete user(s)"]);
            //             }
            //         }
            //     }
            //     break;
        case "DELETE":
            $data = json_decode(file_get_contents("php://input"));
            if (isset($data->checkedUserIds) && is_array($data->checkedUserIds)) {
                $checkedUserIds = $data->checkedUserIds;

                // Check if "U-2023-0001" is in the list of IDs to be deleted
                if (in_array("U-2023-0001", $checkedUserIds)) {
                    // Skip the delete operation for this specific ID
                    echo json_encode(["ok" => "Delete skipped for 'U-2023-0001'"]);
                } else {
                    $placeholders = implode(',', array_fill(0, count($checkedUserIds), '?'));
                    $stmt1 = $conn->prepare("DELETE FROM user_login WHERE id IN ($placeholders)");

                    // Binding parameters
                    $types = str_repeat('s', count($checkedUserIds));
                    $stmt1->bind_param($types, ...$checkedUserIds);

                    $success1 = $stmt1->execute();

                    if ($success1) {
                        $deletedCount = $stmt1->affected_rows;
                        echo json_encode(["ok" => "$deletedCount User(s) have been deleted"]);
                    } else {
                        echo json_encode(["error" => "Failed to delete user(s)"]);
                    }
                }
            }
            break;

        default:
            echo json_encode(["error" => "Invalid request method"]);
    }
}
