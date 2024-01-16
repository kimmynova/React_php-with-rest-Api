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
            // Fetch data from tbl_purchaseorder
            $allinvoice = mysqli_query($conn, "SELECT * FROM tbl_purchaseorder");
            if (mysqli_num_rows($allinvoice) > 0) {
                while ($row = mysqli_fetch_array($allinvoice)) {
                    $json_array['Purchasedata'][] = array(
                        "pono" => $row['pono'],
                        "purdate" => $row["purdate"],
                        "empName" => $row["empName"],
                        "supid" => $row["supid"],
                        "grandtotal" => $row["grandtotal"],
                        "Remark" => $row["Remark"]
                    );
                }
            } else {
                $json_array['Purchasedata'] = ["Resault" => "please check the data"];
            }
            // Fetch data from tbl_invoicedetail
            $allinvoicedetail = mysqli_query($conn, "SELECT * FROM tbl_purchaseorderdetail");
            if (mysqli_num_rows($allinvoicedetail) > 0) {
                while ($row = mysqli_fetch_array($allinvoicedetail)) {
                    $json_array['Purchasedetaildata'][] = array(
                        "No" => $row['No'],
                        "pono" => $row["pono"],
                        "itemid" => $row["itemid"],
                        "Unitprice" => $row["Unitprice"],
                        "qty" => $row["qty"],
                        "total" => $row["total"]
                    );
                }
            } else {
                $json_array['Purchasedetaildata'] = ["Resault" => "please check the data"];
            }

            // Encode and display the combined JSON response
            echo json_encode($json_array);

            break;
        case "POST":
            $PurchaseData = json_decode(file_get_contents("php://input"), true);
            $results = array();

            if (isset($PurchaseData['PurchaseData']['items']) && is_array($PurchaseData['PurchaseData']['items'])) {
                // Generate a single pono for the entire invoice
                $pono = generatepuID();
                $purdate = $PurchaseData['PurchaseData']['purdate'];
                $empName = $PurchaseData['PurchaseData']['empName'];
                $supid = $PurchaseData['PurchaseData']['supid'];
                $grandTotal = $PurchaseData['PurchaseData']['grandtotal'];
                $Remark = $PurchaseData['PurchaseData']['Remark'];

                if (!empty($purdate) && !empty($empName) && !empty($supid) && !empty($grandTotal)) {
                    // Use prepared statements to prevent SQL injection
                    $checkMainInvoice = "INSERT INTO tbl_purchaseorder (pono, purdate, empName, supid, grandtotal, Remark) VALUES (?, ?, ?, ?, ?, ?)";
                    $insertMainInvoice = mysqli_prepare($conn, $checkMainInvoice);

                    if ($insertMainInvoice) {
                        mysqli_stmt_bind_param($insertMainInvoice, "ssssss", $pono, $purdate, $empName, $supid, $grandTotal, $Remark);

                        if (mysqli_stmt_execute($insertMainInvoice)) {
                            foreach ($PurchaseData['PurchaseData']['items'] as $item) {
                                $No = $item['No'];
                                $itemid = $item['itemid'];
                                $unitprice = $item['unitprice'];
                                $Qty = $item['quantity'];
                                $total = $item['total'];

                                // Check if the product exists in the database
                                $checkProduct = mysqli_query($conn, "SELECT prodName, qty FROM products WHERE prodName = '$itemid';");

                                if (mysqli_num_rows($checkProduct) > 0) {
                                    $productData = mysqli_fetch_assoc($checkProduct);
                                    $itemname = $productData['prodName'];
                                    $productQty = $productData['qty'];

                                    // Consolidate the quantity update queries
                                    $updateProduct = mysqli_query($conn, "UPDATE products SET qty = qty + '$Qty' WHERE prodName = '$itemid'");
                                    $updateSupplierCheckmark = mysqli_query($conn, "UPDATE tbl_supplier SET Checkmark='Checked' WHERE supid='$supid'");

                                    if (!$updateProduct) {
                                        $results[] = "Error updating product quantity for '$itemid' - " . mysqli_error($conn);
                                    }
                                } else {
                                    // Product doesn't exist, insert a new record into tblproduct
                                    $prodid = generateProductID(); // Generate a unique prodid
                                    $insertProduct = mysqli_prepare($conn, "INSERT INTO products (prodid, prodName, prodType, Qty, img) VALUES (?, ?, 'default', ?, 'null')");
                                    $insertProductPrice = mysqli_prepare($conn, "INSERT INTO productprice (prodid, prodDate, Cost, prodprice) VALUES (?, Now(), ?, ?)");

                                    if ($insertProduct) {
                                        mysqli_stmt_bind_param($insertProduct, "sss", $prodid, $itemid, $Qty);
                                        mysqli_stmt_bind_param($insertProductPrice, "sdd", $prodid, $unitprice, $unitprice);

                                        if (mysqli_stmt_execute($insertProduct) && mysqli_stmt_execute($insertProductPrice)) {
                                            $itemname = $itemid; // Use the provided itemid as the product name
                                            $productQty = $Qty; // Use the provided quantity
                                        } else {
                                            $results[] = "Error inserting new product '$itemid' into the database - " . mysqli_error($conn);
                                            continue; // Skip this item and move to the next one
                                        }

                                        mysqli_stmt_close($insertProduct);
                                        mysqli_stmt_close($insertProductPrice);
                                    } else {
                                        $results[] = "Error preparing the statement for inserting a new product - " . mysqli_error($conn);
                                        continue; // Skip this item and move to the next one
                                    }
                                }

                                // Insert sub invoice
                                $checkSubInvoice = mysqli_query($conn, "INSERT INTO tbl_purchaseorderDetail (No, pono, itemid, Unitprice, qty, total) VALUES ('$No', '$pono', '$itemid', '$unitprice', '$Qty', '$total')");

                                if ($checkSubInvoice) {
                                    $results[] = "Sub invoice successful for item: $itemname";
                                } else {
                                    $results[] = "Error inserting sub invoice for item: $itemname - " . mysqli_error($conn);
                                }
                            }
                        } else {
                            $results[] = "Error inserting data for main invoice - " . mysqli_error($conn);
                        }
                    } else {
                        $results[] = "Error preparing the statement for the main invoice - " . mysqli_error($conn);
                    }
                } else {
                    $results[] = "Some of the required fields (purdate, empName, supid, grandTotal) are empty or null.";
                }
            } else {
                $results[] = "No 'items' array found in the JSON data.";
            }

            $response = array("success" => true, "result" => $results);
            echo json_encode($response);
            break;
    }
}            











//         case "POST":
//             $PurchaseData = json_decode(file_get_contents("php://input"), true);
//             $results = array();

//             if (isset($PurchaseData['PurchaseData']['items']) && is_array($PurchaseData['PurchaseData']['items'])) {
//                 // Generate a single pono for the entire invoice
//                 $pono = generatepuID();
//                 $purdate = $PurchaseData['PurchaseData']['purdate'];
//                 $empName = $PurchaseData['PurchaseData']['empName'];
//                 $supid = $PurchaseData['PurchaseData']['supid'];
//                 $grandTotal = $PurchaseData['PurchaseData']['grandtotal'];
//                 $Remark = $PurchaseData['PurchaseData']['Remark'];

//                 if (!empty($purdate) && !empty($empName) && !empty($supid) && !empty($grandTotal)) {
//                     // Insert main invoice
//                     $checkMainInvoice = "INSERT INTO tbl_purchaseorder (pono, purdate, empName, supid, grandtotal,Remark) VALUES ('$pono', '$purdate', '$empName', '$supid', '$grandTotal','$Remark');";
//                     $resins = mysqli_query($conn, $checkMainInvoice);

//                     if ($resins) {
//                         foreach ($PurchaseData['PurchaseData']['items'] as $item) {
//                             $No = $item['No'];
//                             $itemid = $item['itemid'];
//                             $unitprice = $item['unitprice'];
//                             $Qty = $item['quantity'];
//                             $total = $item['total'];
//                             $checkProduct = mysqli_query($conn, "UPDATE products SET Qty = Qty + '$Qty' WHERE prodName = '$itemid';");
//                             // Update product quantity
//                             $updateProduct = mysqli_query($conn, "UPDATE tbl_supplier SET Checkmark='Checked' WHERE supid='$supid';");

//                             if (!$updateProduct) {
//                                 $results[] = "Error updating product quantity for '$itemid' - " . mysqli_error($conn);
//                             }

//                             // Insert sub invoice
//                             $checkSubInvoice = mysqli_query($conn, "INSERT INTO tbl_purchaseorderDetail (No, pono, itemid, Unitprice, qty, total) VALUES ('$No', '$pono', '$itemid', '$unitprice', '$Qty', '$total');");

//                             if ($checkSubInvoice) {
//                                 $results[] = "Sub invoice successful for item: $itemid";
//                             } else {
//                                 $results[] = "Error inserting sub invoice for item: $itemid - " . mysqli_error($conn);
//                             }
//                         }
//                     } else {
//                         $results[] = "Error inserting data for main invoice - " . mysqli_error($conn);
//                     }
//                 } else {
//                     $results[] = "Some of the required fields (purdate, empName, supid, grandTotal) are empty or null.";
//                 }
//             } else {
//                 $results[] = "No 'items' array found in the JSON data.";
//             }

//             $response = array("success" => true, "result" => $results);
//             echo json_encode($response);
//             break;
//     }
// }











            //     case "POST":
            //         $PurchaseData = json_decode(file_get_contents("php://input"), true);
            //         $results = array();

            //         if (isset($PurchaseData['PurchaseData']['items']) && is_array($PurchaseData['PurchaseData']['items'])) {
            //             // Generate a single pono for the entire invoice
            //             $pono = generatepuID();
            //             $purdate = $PurchaseData['PurchaseData']['purdate'];
            //             $empName = $PurchaseData['PurchaseData']['empName'];
            //             $supid = $PurchaseData['PurchaseData']['supid'];
            //             $grandTotal = $PurchaseData['PurchaseData']['grandtotal'];
            //             if (!empty($purdate) && !empty($empName) && !empty($supid) && !empty($grandTotal)) {
            //                 // Insert main invoice
            //                 $checkMainInvoice = "INSERT INTO tbl_purchaseorder (pono, purdate, empName, supid, grandtotal) VALUES ('$pono', '$purdate', '$empName', '$supid', '$grandTotal');";
            //                 $resins = mysqli_query($conn, $checkMainInvoice);

            //                 if ($resins) {
            //                     foreach ($PurchaseData['PurchaseData']['items'] as $item) {
            //                         $No = $item['No'];
            //                         $itemid = $item['itemid'];
            //                         $unitprice = $item['unitprice'];
            //                         $Qty = $item['quantity'];
            //                         $total = $item['total'];

            //                         // Check if the product exists in the database
            //                         $checkProduct = mysqli_query($conn, "SELECT prodname, qty FROM products WHERE prodName = '$itemid';");
            //                         if (mysqli_num_rows($checkProduct) > 0) {
            //                             $productData = mysqli_fetch_assoc($checkProduct);
            //                             $itemname = $productData['prodname'];
            //                             $productQty = $productData['qty'];


            //                             // Update product quantity
            //                             $checkProduct = mysqli_query($conn, "UPDATE products SET Qty = Qty + '$Qty' WHERE prodName = '$itemid';");

            //                             // Insert sub invoice
            //                             $checkSubInvoice = mysqli_query($conn, "INSERT INTO tbl_purchaseorderDetail (No,pono, itemid,Unitprice, qty, total) VALUES ('$No','$pono', '$itemid','$unitprice','$Qty', '$total');");
            //                             if ($checkSubInvoice) {
            //                                 $results[] = "Sub invoice successful for item: $itemid";
            //                             } else {
            //                                 $results[] = "Error inserting sub invoice for item: $itemid - " . mysqli_error($conn);
            //                             }
            //                         } else {
            //                             $results[] = "canot find product '$itemid' in the database for item: $itemid";
            //                         }
            //                     }
            //                 } else {
            //                     $results[] = "Error inserting data for main invoice - " . mysqli_error($conn);
            //                 }
            //             } else {
            //                 $results[] = "Some of the required fields (purdate, empName, supid, grandTotal) are empty or null.";
            //             }
            //         } else {
            //             $results[] = "No 'items' array found in the JSON data.";
            //         }

            //         $response = array("success" => true, "result" => $results);
            //         echo json_encode($response);
            //         break;
            // }
//         case "POST":
//             $PurchaseData = json_decode(file_get_contents("php://input"), true);
//             $results = array();

//             if (isset($PurchaseData['PurchaseData']['items']) && is_array($PurchaseData['PurchaseData']['items'])) {
//                 // Generate a single pono for the entire invoice
//                 $pono = generatepuID();
//                 $purdate = $PurchaseData['PurchaseData']['purdate'];
//                 $empName = $PurchaseData['PurchaseData']['empName'];
//                 $supid = $PurchaseData['PurchaseData']['supid'];
//                 $grandTotal = $PurchaseData['PurchaseData']['grandtotal'];

//                 if (!empty($purdate) && !empty($empName) && !empty($supid) && !empty($grandTotal)) {
//                     // Insert main invoice
//                     $checkMainInvoice = "INSERT INTO tbl_purchaseorder (pono, purdate, empName, supid, grandtotal) VALUES ('$pono', '$purdate', '$empName', '$supid', '$grandTotal');";
//                     $resins = mysqli_query($conn, $checkMainInvoice);

//                     if ($resins) {
//                         foreach ($PurchaseData['PurchaseData']['items'] as $item) {
//                             $No = $item['No'];
//                             $itemid = $item['itemid'];
//                             $unitprice = $item['unitprice'];
//                             $Qty = $item['quantity'];
//                             $total = $item['total'];

//                             // Check if the product exists in the database
//                             $checkProduct = mysqli_query($conn, "SELECT prodName, qty FROM products WHERE prodName = '$itemid';");

//                             if (mysqli_num_rows($checkProduct) > 0) {
//                                 $productData = mysqli_fetch_assoc($checkProduct);
//                                 $itemname = $productData['prodName'];
//                                 $productQty = $productData['qty'];

//                                 // Update product quantity
//                                 $updateProduct = mysqli_query($conn, "UPDATE products SET qty = qty + '$Qty' WHERE prodName = '$itemid';");
//                                 $updatesupliercheckmark = mysqli_query($conn, "UPDATE products SET qty = qty + '$Qty' WHERE prodName = '$itemid';");

//                                 if (!$updateProduct) {
//                                     $results[] = "Error updating product quantity for '$itemid' - " . mysqli_error($conn);
//                                 }
//                             } else {
//                                 // Product doesn't exist, insert a new record into tblproduct
//                                 $prodid = generateProductID(); // Generate a unique prodid
//                                 $insertProduct = mysqli_prepare($conn, "INSERT INTO products (prodid, prodName, prodType, Cost, prodprice, Qty, img) VALUES (?, ?, 'default', ?, ?, ?, 'null')");

//                                 if ($insertProduct) {
//                                     // Bind parameters to the prepared statement
//                                     mysqli_stmt_bind_param($insertProduct, "ssdis", $prodid, $itemid, $unitprice, $unitprice, $Qty);

//                                     // Execute the prepared statement
//                                     if (mysqli_stmt_execute($insertProduct)) {
//                                         $itemname = $itemid; // Use the provided itemid as the product name
//                                         $productQty = $Qty; // Use the provided quantity
//                                     } else {
//                                         $results[] = "Error inserting new product '$itemid' into the database - " . mysqli_error($conn);
//                                         continue; // Skip this item and move to the next one
//                                     }

//                                     mysqli_stmt_close($insertProduct);
//                                 } else {
//                                     $results[] = "Error preparing the statement for inserting a new product - " . mysqli_error($conn);
//                                     continue; // Skip this item and move to the next one
//                                 }
//                             }

//                             // Insert sub invoice
//                             $checkSubInvoice = mysqli_query($conn, "INSERT INTO tbl_purchaseorderDetail (No, pono, itemid, Unitprice, qty, total) VALUES ('$No', '$pono', '$itemid', '$unitprice', '$Qty', '$total');");

//                             if ($checkSubInvoice) {
//                                 $results[] = "Sub invoice successful for item: $itemname";
//                             } else {
//                                 $results[] = "Error inserting sub invoice for item: $itemname - " . mysqli_error($conn);
//                             }
//                         }
//                     } else {
//                         $results[] = "Error inserting data for main invoice - " . mysqli_error($conn);
//                     }
//                 } else {
//                     $results[] = "Some of the required fields (purdate, empName, supid, grandTotal) are empty or null.";
//                 }
//             } else {
//                 $results[] = "No 'items' array found in the JSON data.";
//             }

//             $response = array("success" => true, "result" => $results);
//             echo json_encode($response);
//             break;
//     }
// }