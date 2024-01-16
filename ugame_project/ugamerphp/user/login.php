<?php
session_start();
include "../Connection/connection.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");
if (mysqli_connect_error()) {
    echo mysqli_connect_error();
    exit();
} else {
    // Read raw JSON data from the request body
    $eData = file_get_contents("php://input");
    $dData = json_decode($eData, true);

    $username = $dData['username'];
    $pass = $dData['password'];
    $result = "";

    if ($username != "" && $pass != "") {
        $sql = "SELECT * FROM user_login WHERE Username ='$username' AND password ='$pass'";
        $res = mysqli_query($conn, $sql);


        if (mysqli_num_rows($res) != 0) {
            // Fetch the user's role and image URL from the database
            $row = mysqli_fetch_assoc($res);
            $role = $row['Role'];
            $name = $row['Name'];
            $img = $row['img'];

            // Prepare the response with role, image URL, and success message
            $result = "login successful! redirecting...";
            $response[] = array("result" => $result, "role" => $role, 'Name' => $name, 'img' => $img);
        } else {
            $result = "Invalid username or password";
            $response[] = array("result" => $result);
        }
    } else {
        $result = "All fields are required";
        $response[] = array("result" => $result);
    }
    $conn->close();
    echo json_encode($response);
    // Define the maximum number of login attempts and the timeout period (in seconds)
    // $maxLoginAttempts = 3;
    // $timeoutDuration = 60; // 1 minute

    // if (mysqli_connect_error()) {
    //     echo mysqli_connect_error();
    //     exit();
    // } else {
    //     // Read raw JSON data from the request body
    //     $eData = file_get_contents("php://input");
    //     $dData = json_decode($eData, true);

    //     $username = $dData['username'];
    //     $pass = $dData['password'];
    //     $result = "";
    //     $response = array();

    //     if ($username != "" && $pass != "") {
    //         // Check if the user is currently in timeout
    //         $timeoutKey = "login_timeout_" . $username;
    //         if (isset($_SESSION[$timeoutKey]) && time() < $_SESSION[$timeoutKey]) {
    //             $result = "Account is temporarily locked. Please try again later.";
    //             $response[] = array("result" => $result);
    //         } else {
    //             $sql = "SELECT * FROM user_login WHERE Username = '$username' AND password = '$pass'";
    //             $res = mysqli_query($conn, $sql);

    //             if (mysqli_num_rows($res) != 0) {
    //                 // Successful login, reset the login attempts
    //                 unset($_SESSION["login_attempts_" . $username]);

    //                 // Fetch the user's role and image URL from the database
    //                 $row = mysqli_fetch_assoc($res);
    //                 $role = $row['Role'];
    //                 $name = $row['Name'];
    //                 $img = $row['img'];

    //                 // Prepare the response with role, image URL, and success message
    //                 $result = "Login successful! Redirecting...";
    //                 $response[] = array("result" => $result, "role" => $role, 'Name' => $name, 'img' => $img);
    //             } else {
    //                 // Incorrect login, increment the login attempts
    //                 $loginAttemptsKey = "login_attempts_" . $username;
    //                 if (!isset($_SESSION[$loginAttemptsKey])) {
    //                     $_SESSION[$loginAttemptsKey] = 1;
    //                 } else {
    //                     $_SESSION[$loginAttemptsKey]++;
    //                 }

    //                 $loginAttempts = $_SESSION[$loginAttemptsKey];

    //                 if ($loginAttempts >= $maxLoginAttempts) {
    //                     // If login attempts exceed the limit, set a timeout
    //                     $timeout = time() + $timeoutDuration;
    //                     $_SESSION[$timeoutKey] = $timeout;

    //                     $result = "Account is temporarily locked. Please try again later.";
    //                 } else {
    //                     $result = "Invalid username or password (Attempt $loginAttempts of $maxLoginAttempts)";
    //                 }

    //                 $response[] = array("result" => $result);
    //             }
    //         }
    //     } else {
    //         $result = "All fields are required";
    //         $response[] = array("result" => $result);
    //     }

    //     $conn->close();
    //     echo json_encode($response);



    // include "../Connection/connection.php";
    // header("Access-Control-Allow-Origin: *");
    // header("Access-Control-Allow-Methods: GET, POST");
    // header("Access-Control-Allow-Headers: Content-Type");

    // if (mysqli_connect_error()) {
    //     echo mysqli_connect_error();
    //     exit();
    // } else {
    //     // Read raw JSON data from the request body
    //     $eData = file_get_contents("php://input");
    //     $dData = json_decode($eData, true);

    //     $username = $dData['username'];
    //     $pass = $dData['password'];
    //     $result = "";

    //     if ($username != "" && $pass != "") {
    //         $sql = "SELECT * FROM user_login WHERE Username ='$username' AND password ='$pass'";
    //         $res = mysqli_query($conn, $sql);


    //         if (mysqli_num_rows($res) != 0) {
    //             // Fetch the user's role and image URL from the database
    //             $row = mysqli_fetch_assoc($res);
    //             $role = $row['Role'];
    //             $name = $row['Name'];
    //             $img = $row['img'];

    //             // Prepare the response with role, image URL, and success message
    //             $result = "login successful! redirecting...";
    //             $response[] = array("result" => $result, "role" => $role, 'Name' => $name, 'img' => $img);
    //         } else {
    //             $result = "Invalid username or password";
    //             $response[] = array("result" => $result);
    //         }
    //     } else {
    //         $result = "All fields are required";
    //         $response[] = array("result" => $result);
    //     }
    //     $conn->close();
    //     echo json_encode($response);
}








 // if (mysqli_num_rows($res) != 0) {
        //     // Fetch the user's role from the database
        //     $row = mysqli_fetch_assoc($res);
        //     $role = $row['Role'];
        //     $name = $row['Name'];
        //     $img = $row['img'];

        //     // Prepare the response with role and success message
        //     $result = "login successful! redirecting...";
        //     $response[] = array("result" => $result, "role" => $role, 'Name' => $name, 'img' => $img);
        // } else {
        //     $result = "Invalid username or password";
        //     $response[] = array("result" => $result);
        // }
// include "../Connection/connection.php";
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: GET, POST");
// header("Access-Control-Allow-Headers: Content-Type");
// include '../vendor/autoload.php';

// use \Firebase\JWT\JWT;




// $maxLoginAttempts = 3;
// $delayTime = 60; // 1 minute

// if ($_SERVER['REQUEST_METHOD'] == 'POST') {
//     session_start();

//     if (!isset($_SESSION['login_attempts'])) {
//         $_SESSION['login_attempts'] = 0;
//         $_SESSION['last_login_attempt'] = time();
//     }

//     $currentTime = time();

//     // Check if there have been too many login attempts within the delay period
//     if ($_SESSION['login_attempts'] >= $maxLoginAttempts && ($currentTime - $_SESSION['last_login_attempt']) < $delayTime) {
//         // Return a message indicating that login is temporarily disabled
//         echo json_encode([
//             'status' => 0,
//             'message' => 'Too many failed login attempts. Please try again later.',
//         ]);
//     } else {
//         $data = json_decode(file_get_contents("php://input"));
//         $password = htmlentities($data->password);
//         $username = $data->username;

//         // Perform the SQL query
//         $sql = "SELECT * FROM user_login WHERE Username = '$username' AND Password = '$password'";

//         $result = mysqli_query($conn, $sql);

//         if ($result && mysqli_num_rows($result) > 0) {
//             $data = mysqli_fetch_assoc($result);

//             // Successful login, reset login attempt count
//             $_SESSION['login_attempts'] = 0;

//             $id = $data['id'];
//             $name = $data['Username'];

//             $payload = [
//                 'iss' => "localhost",
//                 'aud' => 'localhost',
//                 'exp' => time() + 600, // 10 minutes expiration
//                 'data' => [
//                     'id' => $id,
//                     'username' => $name,
//                 ],
//             ];

//             $secret_key = "Hilal ahmad khan";
//             $jwt = JWT::encode($payload, $secret_key, 'HS256');

//             echo json_encode([
//                 'status' => 1,
//                 'jwt' => $jwt,
//                 'message' => 'Login Successfully',
//             ]);
//         } else {
//             // Failed login attempt, increment the count
//             $_SESSION['login_attempts']++;

//             // Update the last login attempt time
//             $_SESSION['last_login_attempt'] = $currentTime;

//             echo json_encode([
//                 'status' => 0,
//                 'message' => 'Invalid Credentials',
//             ]);
//         }
//     }
// } else {
//     echo json_encode([
//         'status' => 0,
//         'message' => 'Access Denied',
//     ]);
// }s