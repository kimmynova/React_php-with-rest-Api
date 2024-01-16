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

        case "GET":
            $path = explode('/', $_SERVER['REQUEST_URI']);

            if (isset($path[5])) {
                $json_array = array();
                $id = $path[5];
                $destination = $_SERVER['DOCUMENT_ROOT'] . '.\ugame_project\ugamerphp\UploadUserPictureFolder' . '/';
                $getuserrow = mysqli_query($conn, "SELECT * FROM user_login WHERE id='$id';");
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
                    echo json_encode(["Result" => "please check the data"]);
                }
                break;
            }
        case "POST":
            if (isset($_FILES['img']) && !empty($_FILES['img']['name'])) {
                $id = $_POST['id'];
                $Name = $_POST['Name'];
                $Username = $_POST['Username'];
                $role = $_POST['Role'];
                $pass = $_POST['Password'];
                $img = $_FILES['img']['name'];
                $pfile_temp = $_FILES['img']['tmp_name'];
                $ext = pathinfo($img, PATHINFO_EXTENSION);
                $renameimg = create_unqueid() . '.' . $ext;
                $destination = $_SERVER['DOCUMENT_ROOT'] . '.\ugame_project\ugamerphp\UploadUserPictureFolder' . "/" . $renameimg;
                move_uploaded_file($pfile_temp, $destination);

                $result = mysqli_query($conn, "UPDATE user_login SET Name='$Name', Username='$Username', Role='$role', Password='$pass', img='$renameimg' WHERE id='$id'");

                if ($result) {
                    $updateduserData = array(
                        'id' => $id,
                        "Name" => $Name,
                        "Username" => $Username,
                        "role" => $role,
                        "Password" => $pass,
                        "img" => $renameimg
                    );
                    echo json_encode(["success" => "User Updated Successfully", "UserData" => $updateduserData]);
                } else {
                    echo json_encode(["error" => "User Not Updated!"]);
                }
            } else {
                $id = $_POST['id'];
                $Name = $_POST['Name'];
                $Username = $_POST['Username'];
                $role = $_POST['Role'];
                $Password = $_POST['Password'];

                $result = mysqli_query($conn, "UPDATE user_login SET Name='$Name', Username='$Username', Role='$role', Password='$Password' WHERE id='$id'");
                if ($result) {
                    $updateduserData = array(
                        "Name" => $Name,
                        "Username" => $Username,
                        "role" => $role,
                        "Password" => $Password,
                    );
                    echo json_encode(["success" => "User Updated Successfully", "updateduserData" => $updateduserData]);
                } else {
                    echo json_encode(["error" => "User Not Updated!"]);
                }
            }
            break;

        default:
    }
}
