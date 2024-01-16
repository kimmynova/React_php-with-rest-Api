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
            // Initialize the JSON array
            $json_array = array();
            // Fetch data from tbl_invoice
            $allinvoice = mysqli_query($conn, "SELECT * FROM tbl_invoice");
            if (mysqli_num_rows($allinvoice) > 0) {
                while ($row = mysqli_fetch_array($allinvoice)) {
                    $json_array['invociedata'][] = array(
                        "invno" => $row['invno'],
                        "invdate" => $row["invdate"],
                        "empName" => $row["empName"],
                        "custName" => $row["custName"],
                        "grandtotal" => $row["grandtotal"]
                    );
                }
            } else {
                $json_array['invociedata'] = ["Resault" => "please check the data"];
            }
            // Fetch data from tbl_invoicedetail
            $allinvoicedetail = mysqli_query($conn, "SELECT * FROM tbl_invoicedetail");
            if (mysqli_num_rows($allinvoicedetail) > 0) {
                while ($row = mysqli_fetch_array($allinvoicedetail)) {
                    $json_array['invoicedetaildata'][] = array(
                        "No" => $row['No'],
                        "Invno" => $row["invno"],
                        "itemid" => $row["itemid"],
                        "Unitprice" => $row["Unitprice"],
                        "qty" => $row["qty"],
                        "total" => $row["total"]
                    );
                }
            } else {
                $json_array['invoicedetaildata'] = ["Resault" => "please check the data"];
            }

            // Encode and display the combined JSON response
            echo json_encode($json_array);

            break;
            //         case "POST":
            //             $InvoiceData = json_decode(file_get_contents("php://input"), true);
            //             $results = array();

            //             if (isset($InvoiceData['InvoiceData']['items']) && is_array($InvoiceData['InvoiceData']['items'])) {
            //                 // Generate a single invno for the entire invoice
            //                 $invno = generateInvoiceID();
            //                 $invdate = $InvoiceData['InvoiceData']['invdate'];
            //                 $empName = $InvoiceData['InvoiceData']['empName'];
            //                 $custName = $InvoiceData['InvoiceData']['custName'];
            //                 $grandTotal = $InvoiceData['InvoiceData']['grandtotal'];
            //                 $Remark = $InvoiceData['InvoiceData']['Remark'];
            //                 if (!empty($invdate) && !empty($empName) && !empty($custName) && !empty($grandTotal)) {
            //                     // Insert main invoice
            //                     $checkMainInvoice = "INSERT INTO tbl_invoice (invno, invdate, empName, custName, grandtotal,Remark) VALUES ('$invno', '$invdate', '$empName', '$custName', '$grandTotal','$Remark');";
            //                     $resins = mysqli_query($conn, $checkMainInvoice);

            //                     if ($resins) {
            //                         foreach ($InvoiceData['InvoiceData']['items'] as $item) {
            //                             $No = $item['No'];
            //                             $itemid = $item['itemid'];
            //                             $unitprice = $item['unitprice'];
            //                             $Qty = $item['quantity'];
            //                             $total = $item['total'];

            //                             // Check if the product exists in the database
            //                             $checkProduct = mysqli_query($conn, "SELECT prodname, qty FROM products WHERE prodName = '$itemid';");
            //                             if (mysqli_num_rows($checkProduct) > 0) {
            //                                 $productData = mysqli_fetch_assoc($checkProduct);
            //                                 $itemname = $productData['prodname'];
            //                                 $productQty = $productData['qty'];

            //                                 if ($productQty >= $Qty) {
            //                                     // Update product quantity
            //                                     $checkProduct = mysqli_query($conn, "UPDATE products SET Qty = Qty - '$Qty' WHERE prodName = '$itemid';");

            //                                     $updatecustomer = mysqli_query($conn, "UPDATE tbl_customer SET Status=1 WHERE custname='$custName';");

            //                                     if (!$updatecustomer) {
            //                                         $results[] = "Error updating product quantity for '$custid' - " . mysqli_error($conn);
            //                                     }
            //                                     // Insert sub invoice
            //                                     $checkSubInvoice = mysqli_query($conn, "INSERT INTO tbl_invoiceDetail (No,invno, itemid,Unitprice, qty, total) VALUES ('$No','$invno', '$itemid','$unitprice','$Qty', '$total');");
            //                                     if ($checkSubInvoice) {
            //                                         $results[] = "Sub invoice successful for item: $itemid";
            //                                     } else {
            //                                         $results[] = "Error inserting sub invoice for item: $itemid - " . mysqli_error($conn);
            //                                     }
            //                                 } else {
            //                                     $results[] = "Insufficient $itemname. Please check the stock for item: $itemid";
            //                                 }
            //                             } else {
            //                                 $results[] = "canot find product '$itemid' in the database for item: $itemid";
            //                             }
            //                         }
            //                     } else {
            //                         $results[] = "Error inserting data for main invoice - " . mysqli_error($conn);
            //                     }
            //                 } else {
            //                     $results[] = "Some of the required fields (invdate, empName, custName, grandTotal) are empty or null.";
            //                 }
            //             } else {
            //                 $results[] = "No 'items' array found in the JSON data.";
            //             }

            //             $response = array("success" => true, "result" => $results);
            //             echo json_encode($response);
            //             break;
            //     }
            // }





        case "POST":
            $InvoiceData = json_decode(file_get_contents("php://input"), true);
            $results = array();
            $mainInvoiceInserted = false; // Flag to track if the main invoice was inserted

            if (isset($InvoiceData['InvoiceData']['items']) && is_array($InvoiceData['InvoiceData']['items'])) {
                // Generate a single invno for the entire invoice
                $invno = generateInvoiceID();
                $invdate = $InvoiceData['InvoiceData']['invdate'];
                $empName = $InvoiceData['InvoiceData']['empName'];
                $custName = $InvoiceData['InvoiceData']['custName'];
                $grandTotal = $InvoiceData['InvoiceData']['grandtotal'];
                $Remark = $InvoiceData['InvoiceData']['Remark'];

                if (!empty($invdate) && !empty($empName) && !empty($custName) && !empty($grandTotal)) {
                    // Check if all products are available
                    $allProductsAvailable = true;

                    foreach ($InvoiceData['InvoiceData']['items'] as $item) {
                        $itemid = $item['itemid'];
                        $Qty = $item['quantity'];

                        // Check if the product exists in the database and if it has sufficient quantity
                        $checkProduct = mysqli_query($conn, "SELECT prodname, qty FROM products WHERE prodName = '$itemid';");
                        if (mysqli_num_rows($checkProduct) > 0) {
                            $productData = mysqli_fetch_assoc($checkProduct);
                            $productQty = $productData['qty'];

                            if ($productQty < $Qty) {
                                $allProductsAvailable = false;
                                // $results[] = "Insufficient " . $productData['prodname']  . ". Please check the stock for item: $itemid [You have only $productQty in stock]";
                                $results[] = "Insufficient:  " . "(" . $productData['prodname'] . ")," . " You have only ( $productQty ) in stocks" . ", Please press (Edit) button";

                                // break; // No need to check other items, exit the loop
                            }
                        } else {
                            $allProductsAvailable = false;
                            $results[] = "Cannot find product '$itemid' in the database for item: $itemid";
                            break; // No need to check other items, exit the loop
                        }
                    }

                    if ($allProductsAvailable) {
                        // All products are available, insert main invoice
                        $checkMainInvoice = "INSERT INTO tbl_invoice (invno, invdate, empName, custName, grandtotal, Remark) VALUES ('$invno', '$invdate', '$empName', '$custName', '$grandTotal', '$Remark');";
                        $resins = mysqli_query($conn, $checkMainInvoice);

                        if ($resins) {
                            // Mark that the main invoice was inserted successfully
                            $mainInvoiceInserted = true;

                            foreach ($InvoiceData['InvoiceData']['items'] as $item) {
                                $No = $item['No'];
                                $itemid = $item['itemid'];
                                $unitprice = $item['unitprice'];
                                $Qty = $item['quantity'];
                                $total = $item['total'];

                                // Update product quantity
                                $checkProduct = mysqli_query($conn, "UPDATE products SET Qty = Qty - '$Qty' WHERE prodName = '$itemid';");

                                // Insert sub invoice
                                $checkSubInvoice = mysqli_query($conn, "INSERT INTO tbl_invoiceDetail (No, invno, itemid, Unitprice, qty, total) VALUES ('$No', '$invno', '$itemid', '$unitprice', '$Qty', '$total');");
                                if ($checkSubInvoice) {
                                    $results[] = "Sub invoice successful for item: $itemid";
                                } else {
                                    $results[] = "Error inserting sub invoice for item: $itemid - " . mysqli_error($conn);
                                }
                            }

                            // Update customer status
                            $updatecustomer = mysqli_query($conn, "UPDATE tbl_customer SET Status=1 WHERE custname='$custName';");
                            if (!$updatecustomer) {
                                $results[] = "Error updating customer status - " . mysqli_error($conn);
                            }
                        } else {
                            $results[] = "Error inserting data for main invoice - " . mysqli_error($conn);
                        }
                    }
                } else {
                    $results[] = "Some of the required fields (invdate, empName, custName, grandTotal) are empty or null.";
                }
            } else {
                $results[] = "No 'items' array found in the JSON data.";
            }

            $response = array("success" => true, "result" => $results);

            // Check if the main invoice was inserted successfully
            if (!$mainInvoiceInserted) {
                $response["success"] = false;
            }

            echo json_encode($response);
            break;
    }
}


//         case "POST":
            //             $InvoiceData = json_decode(file_get_contents("php://input"), true);
            //             $results = array();
            //             foreach ($InvoiceData as $data) {
            //                 $invno =  generateInvoiceID();
            //                 $invdate = $data['invdate'];
            //                 $empName = $data['empName'];
            //                 $custName = $data['custName'];
            //                 $grandTotal = $data['grandtotal'];
            //                 $itemid = $data['itemid'];
            //                 $Qty = $data['qty'];
            //                 $total = $data['total'];


            //                 $checkProduct = mysqli_query($conn, "SELECT prodname, qty FROM products WHERE prodName = '$itemid';");
            //                 $productData = mysqli_fetch_assoc($checkProduct);
            //                 $itemname = $productData['prodname'];
            //                 $productQty = $productData['qty'];


            //                 if ($productQty >= $Qty) {

            //                     // Insert main invoice
            //                     $checkMainInvoice = "INSERT INTO tbl_invoice (invno, invdate, empName, custName, grandtotal) VALUES ('$invno', '$invdate', '$empName', '$custName', '$grandTotal');";
            //                     $resins = mysqli_query($conn, $checkMainInvoice);

            //                     if ($resins) {
            //                         $results[] = "Data saved successfully for: $invno";
            //                     } else {
            //                         $results[] = "Error inserting data for: $invno - " . mysqli_error($conn);
            //                     }
            //                     // Update product quantity
            //                     $checkProduct = mysqli_query($conn, "UPDATE products SET Qty = Qty - '$Qty' WHERE prodName = '$itemid';");

            //                     // Insert sub invoice
            //                     $checkSubInvoice = mysqli_query($conn, "INSERT INTO tbl_invoiceDetail ( invno, itemid, qty,total) VALUES ( '$invno', '$itemid', '$Qty','$total');");
            //                     if ($checkSubInvoice) {
            //                         $results[] = "Sub invoice successful";
            //                     } else {
            //                         $results[] = "Error inserting sub invoice for: $invno - " . mysqli_error($conn);
            //                     }
            //                 } else {

            //                     $results[] = "Your $itemid is empty";



            //                     $conn->close();
            //                 }
            //             }
            //             $response = array("success" => true, "result" => $results);
            //             echo json_encode($response);
            // ...