<?php
include "../Connection/connection.php";
include "../GenerateUniqkey/Unip_key_ID.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT,DELETE");

if (mysqli_connect_error()) {
    echo mysqli_connect_error();
    exit;
} else {
    $method = $_SERVER['REQUEST_METHOD'];
    switch ($method) {
        case "GET":
            //this (path call mean u call api)
            $path = explode('/', $_SERVER['REQUEST_URI']);

            if (isset($path[5])) {
                $json_array = array();
                $userid = $path[5];
                $destination = $_SERVER['DOCUMENT_ROOT'] . '.\ugame_project\ugamerphp\UploadUserPictureFolder' . '/';
                // echo "get user id............" . $userid;
                // die;
                $getuserrow = mysqli_query($conn, "SELECT * FROM user_login WHERE id='$userid';");
                while ($userrow = mysqli_fetch_array($getuserrow)) {
                    $json_array['Userdata'] = array("id" => $userrow['id'], "Name" => $userrow['Name'], "Username" => $userrow['Username'], "Role" => $userrow['Role'], "Password" => $userrow['Password'], "img" => $userrow['img']);
                }
                echo json_encode($json_array['Userdata']);
                return;
            } else {

                $alluser = mysqli_query($conn, "SELECT * FROM user_login");
                if (mysqli_num_rows($alluser) > 0) {
                    while ($row = mysqli_fetch_array($alluser)) {
                        $json_array['userdata'][] = array("id" => $row['id'], "Name" => $row["Name"], "Username" => $row["Username"], "Role" => $row["Role"], "Password" => $row["Password"], "img" => $row['img']);
                    }
                    echo json_encode($json_array["userdata"]);
                    return;
                } else {
                    echo json_encode(["Resault" => "please check the data"]);
                }
                break;
            }

            // $eData = file_get_contents("php://input");
            // $bData = json_decode($eData, true);

            // $Name = $bData['Name'];
            // $username = $bData['Username'];
            // $email = $bData['email'];
            // $role = $bData['role'];
            // $pass = $bData['pass'];
            // $result = "";

            // if ($Name != "" && $username != "" && $email != "" && $role !== "" && $pass != "") {
            //     $sql = "INSERT INTO user_login (Name,Username,Email,Role,Password) VALUES('$Name','$username','$email','$role','$pass');";
            //     $res = mysqli_query($conn, $sql);
            //     if ($res) {
            //         $result = "You have been registet Successfully!";
            //     } else {
            //         $result = "";
            //     }
            // } else {
            //     $result = "";
            // }
            // $conn->close();
            // $response[] = array("result" => $result);
            // echo json_encode($response);
        case "POST":
            if (isset($_FILES['img']) && $_FILES['img']['error'] === 0) {
                $uid = generateUserId();
                $Name = $_POST['Name'];
                $username = $_POST['Username'];
                $role = $_POST['Role'];
                $pass = $_POST['Password'];
                $img = $_FILES['img']['name'];
                $pfile_temp = $_FILES['img']['tmp_name'];
                $ext = pathinfo($img, PATHINFO_EXTENSION);
                $renameimg = create_unqueid() . '.' . $ext;
                $destination = $_SERVER['DOCUMENT_ROOT'] . '.\ugame_project\ugamerphp\UploadUserPictureFolder' . "/" . $renameimg;

                $result = mysqli_query($conn, "INSERT INTO user_login (id,Name,Username,Role,Password,img) VALUES('$uid','$Name','$username','$role','$pass','$renameimg');");
                if ($result) {
                    move_uploaded_file($pfile_temp, $destination);
                    echo json_encode(["success" => "User " . $Name . " Inserted with Profile Successfully"]);
                } else {
                    echo json_encode(["error" => "User Not Inserted!"]);
                }
            } else {
                // Handle the case where no image is uploaded
                $uid = generateUserId(); // Ensure you have a function to generate a user ID
                $Name = $_POST['Name'];
                $Username = $_POST['Username'];
                $role = $_POST['Role'];
                $Password = $_POST['Password'];

                $result = mysqli_query($conn, "INSERT INTO user_login (id, Name, Username, Role, Password) VALUES ('$uid', '$Name', '$Username', '$role', '$Password');");

                if ($result) {
                    echo json_encode(["success" => "User " . $Name . " Inserted without Profile Successfully"]);
                } else {
                    echo json_encode(["error" => "User Not Inserted!"]);
                }
            }
            break;

            ////////////////////////
            // case "PUT":
            //     $userUpdate = json_decode(file_get_contents("php://input"));
            //     $userid = $userUpdate->id;
            //     $Name = $userUpdate->Name;
            //     $Username = $userUpdate->Username;
            //     $Email = $userUpdate->Email;
            //     $Role = $userUpdate->Role;
            //     $Password = $userUpdate->Password; // Corrected property name
            //     $userUpdateData = mysqli_query($conn, "UPDATE user_login SET Name='$Name', Username='$Username', Email='$Email', Role='$Role', Password='$Password' WHERE id='$userid'");
            //     if ($userUpdateData) {
            //         echo json_encode(["success" => "User has been updated"]);
            //     } else {
            //         echo json_encode(["error" => "Please check the user data"]);
            //     }

            //     break;



        case "DELETE":
            $path = explode('/', $_SERVER["REQUEST_URI"]); // Split the URL into an array
            $idPart = end($path); // Get the last part of the URL, which should be the ID
            // You mentioned that the ID does not have the "Emp-" prefix, so no need to remove it
            $numericPart = $idPart;
            // Use proper prepared statements to prevent SQL injection
            $stmt = $conn->prepare("DELETE FROM user_login WHERE id= ?");
            $stmt->bind_param("s", $numericPart); // Assuming 'id' is a string in your database

            $userDelete = $stmt->execute();

            if ($userDelete) {
                if ($stmt->affected_rows > 0) {
                    echo json_encode(["Success" => "User has been deleted!"]);
                } else {
                    echo json_encode(["error" => "User not found!"]);
                }
            } else {
                echo json_encode(["error" => "Please check the user data"]);
            }
            $stmt->close();

            break;

        default:



            // case "DELETE":
            //     $path = explode('/', $_SERVER["REQUEST_URI"]);
            //     // echo "messege userid-----" . $path[4];
            //     // die;
            //     $result = mysqli_query($conn, "DELETE FROM user_login WHERE id='$path[4]'");
            //     if ($result) {
            //         echo json_encode(["Success" => "User have been delete!"]);
            //     } else {
            //         echo json_encode(["error" => "Please check the user data"]);
            //     }
            //     break;

    }
}
