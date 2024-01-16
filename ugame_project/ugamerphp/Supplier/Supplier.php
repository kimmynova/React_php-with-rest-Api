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
            // This (path call means you are calling the API)
            $path = explode('/', $_SERVER['REQUEST_URI']);
            if (isset($path[5])) {
                $json_array = array();
                $supid = $path[5];
                $getsuprow = mysqli_query($conn, "SELECT * FROM tbl_supplier WHERE supid= '$supid'");
                while ($suprow = mysqli_fetch_array($getsuprow)) {
                    $json_array['rowSupData'] = array("supid" => $suprow['supid'], "supName" => $suprow['supName'], "address" => $suprow['address']);
                }
                echo json_encode($json_array['rowSupData']);
                // Modify this line to use the correct property name

                return;
            }

            // Query to fetch supplier data from tbl_supplier
            $allsupData = mysqli_query($conn, "SELECT * FROM tbl_supplier");
            if (mysqli_num_rows($allsupData) > 0) {
                $json_array = array();
                while ($row = mysqli_fetch_array($allsupData)) {
                    $supid = $row['supid'];
                    $phoneQuery = mysqli_query($conn, "SELECT supPhone FROM tbl_supplierphone WHERE supid = '$supid'");
                    $phoneData = array();
                    while ($phoneRow = mysqli_fetch_array($phoneQuery)) {
                        $phoneData[] = $phoneRow['supPhone'];
                    }
                    $emailQuery = mysqli_query($conn, "SELECT supemail FROM tbl_supplieremail WHERE supid = '$supid'");
                    $emailData = array();
                    while ($EmailRow = mysqli_fetch_array($emailQuery)) {
                        $emailData[] = $EmailRow['supemail'];
                    }

                    $json_array[] = array(
                        "supid" => $row['supid'],
                        "supName" => $row['supName'],
                        "address" => $row['address'],
                        'supPhone' => $phoneData,
                        'supemail' => $emailData,
                    );
                }
                echo json_encode($json_array);
            } else {
                echo json_encode(["result" => "Please check data!"]);
            }
            break;

            // case "POST":
            //     $supplierData = json_decode(file_get_contents("php://input"), true);
            //     $results = array();

            //     if (isset($supplierData['supplierData']['supName']) && isset($supplierData['supplierData']['address'])) {
            //         $supid = generateSupplierId(); // Corrected function name
            //         $supName = $supplierData['supplierData']['supName'];
            //         $address = $supplierData['supplierData']['address'];

            //         // Check if the supid already exists in tbl_customer
            //         $checksupplierQuery = mysqli_query($conn, "SELECT supid FROM tbl_supplier WHERE supid = '$supid'");
            //         if (mysqli_num_rows($checksupplierQuery) === 0) {
            //             // Insert into tbl_customer
            //             $sql = "INSERT INTO tbl_supplier (supid, supName, address) VALUES ('$supid', '$supName', '$address')";
            //             $res = mysqli_query($conn, $sql);
            //             if (mysqli_num_rows($checksupplierQuery) === 0) {
            //                 if ($res) {
            //                     $results[] = "Data saved successfully for: $supName";
            //                 } else {
            //                     $results[] = "Error inserting data for: $supName - " . mysqli_error($conn);
            //                 }
            //                 foreach ($supplierData['supplierData']['supplierphone'] as $supPhone) {

            //                     if (is_array($supPhone)) {

            //                         $contacts = preg_split("/,|\n/", $supPhone['supPhone']);
            //                     } else {
            //                         $contacts = preg_split("/,|\n/", $supPhone);
            //                     }
            //                     foreach ($contacts as $supPhone) {
            //                         $supPhone = mysqli_real_escape_string($conn, trim($supPhone)); // Trim to remove extra whitespace
            //                         // Insert into tbl_customerphone
            //                         $sqlD = "INSERT INTO tbl_supplieremail (supid, supemail) VALUES ('$supid', '$supemail')";
            //                         $resp = mysqli_query($conn, $sqlD);
            //                         if ($resp) {
            //                             $results[] = "Phone number added successfully for: $supid";
            //                         } else {
            //                             $results[] = "Error inserting supPhone number for: $supid - " . mysqli_error($conn);
            //                         }
            //                     }
            //                 }
            //                 foreach ($employedData['employeedata']['employeeemail'] as $supemail) {

            //                     if (is_array($supemail)) {

            //                         $emails = preg_split("/,|\n/", $supemail['supemail']);
            //                     } else {
            //                         $emails = preg_split("/,|\n/", $supemail);

            //                         foreach ($emails as $supemail) {
            //                             $supemail = mysqli_real_escape_string($conn, trim($supemail)); // Trim to remove extra whitespace
            //                             // Insert into tbl_employeeemail
            //                             $sqlD = "INSERT INTO tbl_supplieremail (supid, supemail) VALUES ('$supid', '$supEmail')";
            //                             $resp = mysqli_query($conn, $sqlD);
            //                             if ($resp) {
            //                                 $results[] = "Email added successfully for: $id";
            //                             } else {
            //                                 $results[] = "Error inserting Email for: $id - " . mysqli_error($conn);
            //                             }
            //                         }
            //                     }


            //                     foreach ($emails as $supemail) {
            //                         $supemail = mysqli_real_escape_string($conn, trim($supemail)); // Trim to remove extra whitespace
            //                         // Insert into tbl_employeeemail
            //                         $sqlD = "INSERT INTO tbl_employeeemail (id, supemail) VALUES ('$id', '$supemail')";
            //                         $resp = mysqli_query($conn, $sqlD);
            //                         if ($resp) {
            //                             $results[] = "Email added successfully for: $id";
            //                         } else {
            //                             $results[] = "Error inserting Email for: $id - " . mysqli_error($conn);
            //                         }
            //                     }
            //                 }
            //             } else {
            //                 $results[] = "Employee with ID $id already exists.";
            //             }
            //         } else {
            //             $results[] = "Invalid employee data format.";
            //         }
            //     }

            //     $conn->close();
            //     $response = array("success" => true, "result" => $results);
            //     echo json_encode($response);
            //     break;
        case "POST":
            $supplierData = json_decode(file_get_contents("php://input"), true);
            $results = array();

            if (isset($supplierData['supplierData']['supName']) && isset($supplierData['supplierData']['address'])) {
                $supid = generateSupplierId(); // Corrected function name
                $supName = $supplierData['supplierData']['supName'];
                $address = $supplierData['supplierData']['address'];

                // Check if the supid already exists in tbl_supplier
                $checksupplierQuery = mysqli_query($conn, "SELECT supid FROM tbl_supplier WHERE supid = '$supid'");

                if (mysqli_num_rows($checksupplierQuery) === 0) {
                    // Insert into tbl_supplier
                    $sql = "INSERT INTO tbl_supplier (supid, supName, address,Checkmark) VALUES ('$supid', '$supName', '$address','Unchecked')";
                    $res = mysqli_query($conn, $sql);

                    if ($res) {
                        $results[] = "Data saved successfully for: $supName";
                    } else {
                        $results[] = "Error inserting data for: $supName - " . mysqli_error($conn);
                    }

                    foreach ($supplierData['supplierData']['supplierphone'] as $supPhone) {
                        if (is_array($supPhone)) {
                            $contacts = preg_split("/,|\n/", $supPhone['supPhone']);
                            // $contacts = preg_split("/,|\n/", implode(",", $supPhone['supPhone']));
                        } else {
                            $contacts = preg_split("/,|\n/", $supPhone);
                        }

                        foreach ($contacts as $supPhone) {
                            $supPhone = mysqli_real_escape_string($conn, trim($supPhone));
                            // Insert into tbl_supplierphone
                            $sqlD = "INSERT INTO tbl_supplierphone (supid, supphone) VALUES ('$supid', '$supPhone')";
                            $resp = mysqli_query($conn, $sqlD);
                            if ($resp) {
                                $results[] = "Phone number added successfully for: $supid";
                            } else {
                                $results[] = "Error inserting phone number for: $supid - " . mysqli_error($conn);
                            }
                        }
                    }

                    foreach ($supplierData['supplierData']['supplieremail'] as $supemail) {
                        if (is_array($supemail)) {
                            $emails = preg_split("/,|\n/", $supemail['supemail']);
                            // $emails = preg_split("/,|\n/", implode(",", $supemail['supemail']));
                        } else {
                            $emails = preg_split("/,|\n/", $supemail);
                        }

                        foreach ($emails as $supemail) {
                            $supemail = mysqli_real_escape_string($conn, trim($supemail));
                            // Insert into tbl_supplieremail
                            $sqlD = "INSERT INTO tbl_supplieremail (supid, supemail) VALUES ('$supid', '$supemail')";
                            $resp = mysqli_query($conn, $sqlD);
                            if ($resp) {
                                $results[] = "Email added successfully for: $supid";
                            } else {
                                $results[] = "Error inserting Email for: $supid - " . mysqli_error($conn);
                            }
                        }
                    }
                } else {
                    $results[] = "Supplier with ID $supid already exists.";
                }
            } else {
                $results[] = "Invalid supplier data format.";
            }

            $conn->close();
            $response = array("success" => true, "result" => $results);
            echo json_encode($response);
            break;


        case "PUT":
            $SupUpdate = json_decode(file_get_contents("php://input"));
            $supid = $SupUpdate->SupUpdate->supid;
            $supName = $SupUpdate->SupUpdate->supName;
            $address = $SupUpdate->SupUpdate->address;
            $selectsupplier = mysqli_query($conn, "SELECT * FROM tbl_supplier WHERE supid='$supid'");
            $updatesupData = mysqli_query($conn, "UPDATE tbl_supplier SET supName='$supName', address='$address' WHERE supid='$supid'");
            if ($updatesupData) {
                echo json_encode(["success" => "supplier has been updated!"]);
            } else {
                echo json_encode(["error" => "Please check the data"]);
            }
            $conn->close();

            break;

        case "DELETE":
            $path = explode('/', $_SERVER["REQUEST_URI"]);
            $idPart = end($path);
            $numericPart = $idPart;
            $stmt = $conn->prepare("DELETE FROM tbl_supplier WHERE supid = ?");
            $stmt->bind_param("s", $numericPart);
            $stmt2 = $conn->prepare("DELETE FROM tbl_supplierphone WHERE supid= ?");
            $stmt2->bind_param("s", $numericPart);
            $stmt3 = $conn->prepare("DELETE FROM tbl_supplieremail WHERE supid= ?");
            $stmt3->bind_param("s", $numericPart);
            $supplierDelete = $stmt->execute();
            $supplierphoneDelete = $stmt2->execute();
            $supplieremailDelete = $stmt3->execute();
            if ($supplierDelete && $supplierphoneDelete && $supplieremailDelete) {
                if ($stmt->affected_rows > 0 && $stmt2->affected_rows > 0 && $stmt3->affected_rows > 0) {
                    echo json_encode(["success" => "Supplier has been deleted!"]);
                } else {
                    echo json_encode(["error" => "Supplier not found!"]);
                }
            } else {
                echo json_encode(["error" => "Please check the supplier data"]);
            }
            $stmt->close();
            $stmt2->close();
            $stmt3->close();
            break;

        default:
    }
}
