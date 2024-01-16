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

    $email = $bData['email'];
    $result = "";


    if ($email !== "") {
        $sql = "SELECT * FROM user_login WHERE Email ='$email';";
        $res = mysqli_query($conn, $sql);

        if (mysqli_num_rows($res) != 0) {
            $result = "Email is already register!";
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
