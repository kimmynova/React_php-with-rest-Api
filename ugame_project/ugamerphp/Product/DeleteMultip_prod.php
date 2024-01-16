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

                $stmt1 = $conn->prepare('SELECT * FROM products WHERE prodid=?');
                $stmt1->bind_param("s", $empid);
                $stmt1->execute();
                $result1 = $stmt1->get_result();

                if ($result1->num_rows > 0) {
                    $row = $result1->fetch_assoc();
                    // Fetch phone and email details
                    // $stmt2 = $conn->prepare('SELECT * FROM productphone WHERE prodid=?');
                    // $stmt2->bind_param("s", $empid);
                    // $stmt2->execute();
                    // $result2 = $stmt2->get_result();

                    // $stmt3 = $conn->prepare('SELECT * FROM productemail WHERE prodid=?');
                    // $stmt3->bind_param("s", $empid);
                    // $stmt3->execute();
                    // $result3 = $stmt3->get_result();

                    // Collect phone and email data into arrays
                    // $contact = [];
                    // while ($phoneRow = $result2->fetch_assoc()) {
                    //     $contact[] = $phoneRow['Contact'];
                    // }

                    // $emails = [];
                    // while ($emailRow = $result3->fetch_assoc()) {
                    //     $emails[] = $emailRow['email'];
                    // }

                    // Create the response JSON
                    $response = [
                        "prodid" => $row['prodid'],
                        "prodname" => $row['prodname'],
                        "prodType" => $row['prodType'],
                        "Cost" =>  $row['Cost'],
                        "prodprice" =>  $row['prodprice'],
                        "qty" => $row['Qty'],
                        "img" =>  $row['img']
                    ];

                    echo json_encode($response);
                } else {
                    echo json_encode(["result" => "products not found!"]);
                }
            }
        case "DELETE":
            $data = json_decode(file_get_contents("php://input"));
            if (isset($data->checkedprodIds) && is_array($data->checkedprodIds)) {
                $checkedprodIds = $data->checkedprodIds;

                $placeholders = implode(',', array_fill(0, count($checkedprodIds), '?'));
                $stmt1 = $conn->prepare("DELETE FROM products WHERE prodid IN ($placeholders)");
                $stmt2 = $conn->prepare("DELETE FROM productprice WHERE prodid IN ($placeholders)");
                // $stmt3 = $conn->prepare("DELETE FROM productemail WHERE prodid IN ($placeholders)");

                // Binding parameters
                $types = str_repeat('s', count($checkedprodIds));
                $stmt1->bind_param($types, ...$checkedprodIds);
                $stmt2->bind_param($types, ...$checkedprodIds);
                // $stmt3->bind_param($types, ...$checkedprodIds);

                $success1 = $stmt1->execute();
                $success2 = $stmt2->execute();
                // $success3 = $stmt3->execute();

                if ($success1 && $success2) {
                    $deletedCount = $stmt1->affected_rows;
                    echo json_encode(["ok" => "$deletedCount products(s) have been deleted"]);
                } else {
                    echo json_encode(["error" => "Failed to delete user(s)"]);
                }
            }
            break;
        default:
            echo json_encode(["error" => "Invalid request method"]);
    }
}
