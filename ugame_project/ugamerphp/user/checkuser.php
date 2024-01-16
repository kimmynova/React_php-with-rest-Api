<?php
include "../Connection/connection.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

if (mysqli_connect_error()) {
    echo mysqli_connect_error();
    exit;
} else {
    $eData = file_get_contents("php://input");
    $bData = json_decode($eData, true);

    $username = $bData['Username'];
    $result = "";


    if ($username !== "") {
        $sql = "SELECT * FROM user_login WHERE Username ='$username';";
        $res = mysqli_query($conn, $sql);

        if (mysqli_num_rows($res) != 0) {
            $result = "username is already taken!";
        } else {
            $result = "";
        }
    } else {
        $result = "";
    }
    $conn->close();
    $response[] = array("result" => $result);
    echo json_encode($response);
}
