<?php
include "../Connection/connection.php";
include "../GenerateUniqkey/Unip_key_ID.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type"); // Fixed typo here
header("Access-Control-Allow-Methods: GET,PUT,DELETE");

if (mysqli_connect_error()) {
    echo mysqli_connect_error();
    exit;
} else {
    $method = $_SERVER['REQUEST_METHOD'];
    switch ($method) {
        case "GET":
            $path = explode('/', $_SERVER['REQUEST_URI']);
            if (isset($path[5])) {
                // if (isset($path[5])) {
                $json_array = array();
                $id = $path[5];
                // echo "get user id............" . $id;
                // die;
                $getcaterow = mysqli_query($conn, "SELECT* FROM category WHERE id= '$id'");
                while ($caterow = mysqli_fetch_array($getcaterow)) {
                    $json_array['rowCateData'] = array("id" => $caterow['id'], "Cname" => $caterow['Cname']); // "Address" this from react => $caterow['address'] this from database table culom
                }
                echo json_encode($json_array['rowCateData']);
                return;
            }


            $allCategoryData = mysqli_query($conn, "SELECT * FROM category");
            if (mysqli_num_rows($allCategoryData) > 0) {
                $json_array = array();
                while ($row = mysqli_fetch_array($allCategoryData)) {
                    $cname[] = $row['Cname'];
                    $json_array[] = array(
                        'id' => $row['id'],
                        'Type' => $row['Cname'],
                    );
                }
                echo json_encode($json_array);
            } else {
                echo json_encode(["result" => "Please check data!"]);
            }
            break;


        case "POST":
            $categoryData = json_decode(file_get_contents("php://input"), true);
            $results = array();

            if (isset($categoryData['categorydata']) && is_array($categoryData['categorydata'])) {
                $id = generateCategoryId();
                $Type = $categoryData['categorydata']['Cname'];

                $sql = "INSERT INTO category (id,Cname) VALUES ('$id','$Type')";
                $res = mysqli_query($conn, $sql);
                if ($res) {
                    $results[] = "Category added successfully for: $id Name: $Type";
                } else {
                    $results[] = "Error inserting Category  data: " . mysqli_error($conn);
                }
            } else {
                $results[] = "Invalid Category customer data format.";
            }

            $conn->close();
            $response = array("success" => true, "result" => $results);
            echo json_encode($response);
            break;



        case "PUT":
            $cateUpdate = json_decode(file_get_contents("php://input"));
            $id = $cateUpdate->cateUpdate->id;
            $Type = $cateUpdate->cateUpdate->Cname;

            $updatecateData = mysqli_query($conn, "UPDATE category SET Cname='$Type' WHERE id='$id'");
            if ($updatecateData) {
                echo json_encode(["success" => "Category has been updated!"]);
            } else {
                echo json_encode(["error" => "Please check the data"]);
            }
            $conn->close();

            break;

        case "DELETE":
            $path = explode('/', $_SERVER["REQUEST_URI"]);
            $idPart = end($path);

            $numericPart = $idPart;

            $stmt = $conn->prepare("DELETE FROM category WHERE id = ?");
            $stmt->bind_param("s", $numericPart);

            $CategoryDelete = $stmt->execute();

            if ($CategoryDelete) {
                if ($stmt->affected_rows > 0) {
                    echo json_encode(["success" => "category has been deleted!"]);
                } else {
                    echo json_encode(["error" => "category not found!"]);
                }
            } else {
                echo json_encode(["error" => "Please check the user data"]);
            }
            $stmt->close();

            break;

        default:
    }
}
