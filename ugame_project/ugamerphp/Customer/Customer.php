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
        case 'GET':
            $path = explode('/', $_SERVER['REQUEST_URI']);
            if (isset($path[5])) {
                $json_array = array();
                $custid = $path[5];
                // echo "get user id............" . $custid;
                // die;
                $getcustrrow = mysqli_query($conn, "SELECT * FROM tbl_customer WHERE custid='$custid';");
                while ($Custrow = mysqli_fetch_array($getcustrrow)) {
                    $json_array['custUpdate'] = array(
                        'custid' => $Custrow['custid'],
                        'custName' => $Custrow['custname'],
                        'gender' => $Custrow['gender'],
                        'address' => $Custrow['address'],

                    );
                }
                echo json_encode($json_array['custUpdate']);

                return;
            } else {
                // Query to fetch employee data from tbl_employee
                $allcustData = mysqli_query($conn, "SELECT * FROM tbl_customer");
                if (mysqli_num_rows($allcustData) > 0) {
                    $json_array = array();
                    while ($row = mysqli_fetch_array($allcustData)) {
                        $custid = $row['custid'];

                        // Query to fetch Contact data from tbl_employeephone for the current employee
                        $phoneQuery = mysqli_query($conn, "SELECT Contact FROM tbl_customerphone WHERE custid = '$custid'");
                        $phoneData = array();
                        while ($phoneRow = mysqli_fetch_assoc($phoneQuery)) {
                            $phoneData[] = $phoneRow['Contact'];
                        }

                        $json_array[] = array(
                            'custid' => $row['custid'],
                            'custName' => $row['custname'],
                            'gender' => $row['gender'],
                            'address' => $row['address'],
                            'contact' => $phoneData
                        );
                    }
                    echo json_encode($json_array);
                } else {
                    echo json_encode(["result" => "Please check data!"]);
                }
            }
            break;


            // ...

        case "POST":
            $customerData = json_decode(file_get_contents("php://input"), true);
            $results = array();

            if (isset($customerData['customerdata']['customerphone']) && is_array($customerData['customerdata']['customerphone'])) {
                $custid = generateCustomerId();
                $CustName = $customerData['customerdata']['CustName'];
                $Gender = $customerData['customerdata']['gender'];
                $address = $customerData['customerdata']['Addresss'];

                // Check if the custid already exists in tbl_customer
                $checkCustomerQuery = mysqli_query($conn, "SELECT custid FROM tbl_customer WHERE custid = '$custid'");
                if (mysqli_num_rows($checkCustomerQuery) === 0) {
                    // Insert into tbl_customer
                    $sql = "INSERT INTO tbl_customer (custid, custname, gender, address,Status) VALUES ('$custid', '$CustName', '$Gender', '$address',0)";
                    $res = mysqli_query($conn, $sql);
                    if ($res) {

                        foreach ($customerData['customerdata']['customerphone'] as $phone) {
                            // Split each phone number by newline
                            // if (is_array($phone)) {
                            //     // If $phone is an array, access the 'contact' key and split it
                            //     $contacts = explode("\n", $phone['contact']);
                            // } else {
                            //     // If $phone is a string, split it directly
                            //     $contacts = explode("\n", $phone);
                            // }
                            if (is_array($phone)) {

                                $contacts = preg_split("/,|\n/", $phone['contact']);
                            } else {
                                $contacts = preg_split("/,|\n/", $phone);
                            }
                            foreach ($contacts as $contact) {
                                $contact = mysqli_real_escape_string($conn, trim($contact)); // Trim to remove extra whitespace
                                // Insert into tbl_customerphone
                                $sqlD = "INSERT INTO tbl_customerphone (custid, Contact) VALUES ('$custid', '$contact')";
                                $resp = mysqli_query($conn, $sqlD);
                                if ($resp) {
                                    $results[] = "Phone number added successfully for: $custid";
                                } else {
                                    $results[] = "Error inserting phone number for: $custid - " . mysqli_error($conn);
                                }
                            }
                        }
                    } else {
                        $results[] = "Error inserting customer data: " . mysqli_error($conn);
                    }
                } else {
                    $results[] = "Customer with ID $custid already exists.";
                }
            } else {
                $results[] = "Invalid customer data format.";
            }

            $conn->close();
            $response = array("success" => true, "result" => $results);
            echo json_encode($response);
            break;
            // ...
        case "PUT":
            $custUpdate = json_decode(file_get_contents("php://input"));

            $custid = $custUpdate->custUpdate->custid;
            $custName = $custUpdate->custUpdate->custName;
            $gender = $custUpdate->custUpdate->gender;
            $address = $custUpdate->custUpdate->address;

            $selectCustomer = mysqli_query($conn, "SELECT * FROM tbl_customer WHERE custid='$custid'");

            $updatecustData = mysqli_query($conn, "UPDATE tbl_customer SET custname='$custName', gender='$gender', address='$address' WHERE custid='$custid'");
            if ($updatecustData) {
                echo json_encode(["success" => "customer has been updated!"]);
            } else {
                echo json_encode(["error" => "Please check the data"]);
            }

            $conn->close();

            break;
        case "DELETE":
            $path = explode('/', $_SERVER["REQUEST_URI"]);
            $idPart = end($path);

            $numericPart = $idPart;
            $custid = $idPart;
            if (isset($custid) && !empty($custid)) {
                // Use proper prepared statements to prevent SQL injection
                $stmt1 = $conn->prepare("DELETE FROM tbl_customer WHERE custid = ?");
                $stmt1->bind_param("s", $numericPart);
                $stmt2 = $conn->prepare("DELETE FROM tbl_customerphone WHERE custid = ?");
                $stmt2->bind_param("s", $numericPart);

                $success1 = $stmt1->execute();
                $success2 = $stmt2->execute();

                if ($success1 && $success2) {
                    if ($stmt1->affected_rows > 0 && $stmt2->affected_rows > 0) {
                        echo json_encode(["success" => "User has been deleted!"]);
                    } else {
                        echo json_encode(["error" => "User not found!"]);
                    }
                } else {
                    echo json_encode(["error" => "Please check the user data"]);
                }
            }

            $stmt1->close();
            $stmt2->close();
            break;
    }
}
