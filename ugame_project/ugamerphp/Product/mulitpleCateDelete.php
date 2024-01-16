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
                $id = $path[5];

                $stmt1 = $conn->prepare('SELECT * FROM category WHERE id=?');
                $stmt1->bind_param("s", $id);
                $stmt1->execute();
                $result1 = $stmt1->get_result();

                $row = $result1->fetch_assoc();

                if ($row) {
                    echo json_encode($row);
                } else {
                    echo json_encode(["error" => "Category not found"]);
                }
            }
            break;

        case "DELETE":
            $data = json_decode(file_get_contents("php://input"));
            if (isset($data->checkedcateIds) && is_array($data->checkedcateIds)) {
                $checkedcateIds = $data->checkedcateIds;

                $placeholders = implode(',', array_fill(0, count($checkedcateIds), '?'));
                $stmt1 = $conn->prepare("DELETE FROM category WHERE id IN ($placeholders)");

                // Binding parameters
                $types = str_repeat('s', count($checkedcateIds));
                $stmt1->bind_param($types, ...$checkedcateIds);

                $success1 = $stmt1->execute();


                if ($success1) {
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
