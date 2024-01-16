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
            //this (path call mean u call api)
            $path = explode('/', $_SERVER['REQUEST_URI']);
            if (isset($path[5])) {
                // if (isset($path[5])) {
                $json_array = array();
                $id = $path[5];
                // echo "get user id............" . $id;
                // die;
                $getemprow = mysqli_query($conn, "SELECT* FROM tbl_employee WHERE id= '$id'");
                while ($emprow = mysqli_fetch_array($getemprow)) {
                    $json_array['rowEmpData'] = array("id" => $emprow['id'], "empName" => $emprow['empname'], "Gender" => $emprow['gender'], "dob" => $emprow['dob'], "role" => $emprow['role'], "address" => $emprow['address']); // "Address" this from react => $emprow['address'] this from database table culom
                }
                echo json_encode($json_array['rowEmpData']);
                return;
            }
            // Query to fetch employee data from tbl_employee
            $allEmpData = mysqli_query($conn, "SELECT * FROM tbl_employee");
            if (mysqli_num_rows($allEmpData) > 0) {
                $json_array = array();
                while ($row = mysqli_fetch_array($allEmpData)) {
                    $empid = $row['id'];

                    $phoneQuery = mysqli_query($conn, "SELECT Contact FROM tbl_employeephone WHERE id = '$empid'");
                    $phoneData = array();
                    while ($phoneRow = mysqli_fetch_array($phoneQuery)) {
                        $phoneData[] = $phoneRow['Contact'];
                    }
                    $emailQuery = mysqli_query($conn, "SELECT email FROM tbl_employeeemail WHERE id = '$empid'");
                    $emailData = array();
                    while ($EmailRow = mysqli_fetch_array($emailQuery)) {
                        $emailData[] = $EmailRow['email'];
                    }

                    $json_array[] = array(
                        'id' => $row['id'],
                        'empname' => $row['empname'],
                        'gender' => $row['gender'],
                        'dob' => $row['dob'],
                        'role' => $row['role'],
                        'address' => $row['address'],
                        'Contact' => $phoneData,
                        'email' => $emailData,


                    );
                }
                echo json_encode($json_array);
            } else {
                echo json_encode(["result" => "Please check data!"]);
            }
            break;



        case "POST":
            $employedData = json_decode(file_get_contents("php://input"), true);

            $results = array();
            if (isset($employedData['employeedata']['empName']) && isset($employedData['employeedata']['gender']) && isset($employedData['employeedata']['dob']) && isset($employedData['employeedata']['role']) && isset($employedData['employeedata']['address'])) {
                // Generate and retrieve the employee ID
                $id = generateEmployeeId();
                $empName = $employedData['employeedata']['empName'];
                $Gender = $employedData['employeedata']['gender'];
                $dob = $employedData['employeedata']['dob'];
                $role = $employedData['employeedata']['role'];
                $address = $employedData['employeedata']['address'];

                // Insert data into tbl_employee with the generated ID
                $checkemployeeQuery = mysqli_query($conn, "SELECT id FROM tbl_employee WHERE id = '$id'");
                $sql = "INSERT INTO tbl_employee (id, empname, gender, dob, role, address) VALUES ('$id', '$empName', '$Gender', '$dob', '$role', '$address')";
                $res = mysqli_query($conn, $sql);
                if (mysqli_num_rows($checkemployeeQuery) === 0) {
                    if ($res) {
                        $results[] = "Data saved successfully for: $empName";
                    } else {
                        $results[] = "Error inserting data for: $empName - " . mysqli_error($conn);
                    }
                    foreach ($employedData['employeedata']['employeephone'] as $phone) {
                        // if (is_array($phone)) {
                        //     // If $phone is an array, access the 'contact' key and split it
                        //     $contacts = explode("\n,", $phone['Contact']);
                        // } else {
                        //     // If $phone is a string, split it directly
                        //     $contacts = explode("\n,", $phone);
                        // }
                        if (is_array($phone)) {
                            // If $phone is an array, access the 'Contact' key and split it using commas and newlines as delimiters
                            $contacts = preg_split("/,|\n/", $phone['Contact']);
                        } else {
                            // If $phone is a string, split it directly using commas and newlines as delimiters
                            $contacts = preg_split("/,|\n/", $phone);
                        }


                        foreach ($contacts as $contact) {
                            $contact = mysqli_real_escape_string($conn, trim($contact)); // Trim to remove extra whitespace
                            // Insert into tbl_employeephone
                            $sqlD = "INSERT INTO tbl_employeephone (id, Contact) VALUES ('$id', '$contact')";
                            $resp = mysqli_query($conn, $sqlD);
                            if ($resp) {
                                $results[] = "Phone number added successfully for: $id";
                            } else {
                                $results[] = "Error inserting phone number for: $id - " . mysqli_error($conn);
                            }
                        }
                    }
                    foreach ($employedData['employeedata']['employeeemail'] as $email) {
                        // if (is_array($email)) {
                        //     // If $email is an array, access the 'email' key and split it
                        //     $emails = explode("\n", $email['email']);
                        // } else {
                        //     // If $email is a string, split it directly
                        //     $emails = explode("\n", $email);
                        // }

                        if (is_array($email)) {

                            $emails = preg_split("/,|\n/", $email['email']);
                        } else {
                            $emails = preg_split("/,|\n/", $email);

                            foreach ($emails as $email) {
                                $email = mysqli_real_escape_string($conn, trim($email)); // Trim to remove extra whitespace
                                // Insert into tbl_employeeemail
                                $sqlD = "INSERT INTO tbl_employeeemail (id, email) VALUES ('$id', '$email')";
                                $resp = mysqli_query($conn, $sqlD);
                                if ($resp) {
                                    $results[] = "Email added successfully for: $id";
                                } else {
                                    $results[] = "Error inserting Email for: $id - " . mysqli_error($conn);
                                }
                            }
                        }


                        foreach ($emails as $email) {
                            $email = mysqli_real_escape_string($conn, trim($email)); // Trim to remove extra whitespace
                            // Insert into tbl_employeeemail
                            $sqlD = "INSERT INTO tbl_employeeemail (id, email) VALUES ('$id', '$email')";
                            $resp = mysqli_query($conn, $sqlD);
                            if ($resp) {
                                $results[] = "Email added successfully for: $id";
                            } else {
                                $results[] = "Error inserting Email for: $id - " . mysqli_error($conn);
                            }
                        }
                    }
                } else {
                    $results[] = "Employee with ID $id already exists.";
                }
            } else {
                $results[] = "Invalid employee data format.";
            }

            $conn->close();
            $response = array("success" => true, "result" => $results);
            echo json_encode($response);

            break;

        case "PUT":
            $empUpdate = json_decode(file_get_contents("php://input"));
            $id = $empUpdate->empUpdate->id;
            $empName = $empUpdate->empUpdate->empName;
            $Gender = $empUpdate->empUpdate->Gender;
            $dob = $empUpdate->empUpdate->dob;
            $role = $empUpdate->empUpdate->role;
            $address = $empUpdate->empUpdate->address;


            $updateEmpData = mysqli_query($conn, "UPDATE tbl_employee SET empname='$empName', gender='$Gender', dob='$dob', role='$role', address='$address' WHERE id='$id'");
            if ($updateEmpData) {
                echo json_encode(["success" => "Employee has been updated!"]);
            } else {
                echo json_encode(["error" => "Please check the data"]);
            }
            $conn->close();

            break;



        case "DELETE":
            $path = explode('/', $_SERVER["REQUEST_URI"]); // Split the URL into an array
            $idPart = end($path); // Get the last part of the URL, which should be the ID
            // You mentioned that the ID does not have the "Emp-" prefix, so no need to remove it
            $numericPart = $idPart;
            // Use proper prepared statements to prevent SQL injection
            $stmt = $conn->prepare("DELETE FROM tbl_employee WHERE id = ?");
            $stmt->bind_param("s", $numericPart); // Assuming 'id' is a string in your database

            $stmt2 = $conn->prepare("DELETE FROM tbl_employeephone WHERE id= ?");
            $stmt2->bind_param("s", $numericPart);

            $stmt3 = $conn->prepare("DELETE FROM tbl_employeeemail WHERE id= ?");
            $stmt3->bind_param("s", $numericPart);

            $employeeDelete = $stmt->execute();
            $employeephoneDelete = $stmt2->execute();
            $employeeemailDelete = $stmt3->execute();

            if ($employeeDelete && $employeephoneDelete && $employeeemailDelete) {
                if ($stmt->affected_rows > 0 && $stmt2->affected_rows > 0 && $stmt3->affected_rows > 0) {
                    echo json_encode(["success" => "User has been deleted!"]);
                } else {
                    echo json_encode(["error" => "User not found!"]);
                }
            } else {
                echo json_encode(["error" => "Please check the user data"]);
            }
            $stmt->close();
            $stmt2->close();
            $stmt3->close();

            break;

        default:
    }
}
// Create a function to generate the employee ID