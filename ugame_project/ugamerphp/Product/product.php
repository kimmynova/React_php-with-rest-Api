<?php
include "../Connection/connection.php";
include "../GenerateUniqkey/Unip_key_ID.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json");

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
                $prodid = $path[5];
                $destination = $_SERVER['DOCUMENT_ROOT'] . './ugame_project/ugamerphp/UploadPictureFolder' . '/';

                // Fetch product data from the 'products' table
                $getuserrow = mysqli_query($conn, "SELECT * FROM products WHERE prodid='$prodid';");
                while ($productrow = mysqli_fetch_array($getuserrow)) {
                    $json_array['rowproductdata'] = array("id" => $productrow['prodid'], "prodname" => $productrow['prodname'], "prodType" => $productrow['prodType'],  "Qty" => $productrow['Qty'], "img" =>  $productrow['img']);
                }

                // Fetch product price data from the 'productprice' table
                $getprice = mysqli_query($conn, "SELECT * FROM productprice WHERE prodid='$prodid';");
                while ($priceRow = mysqli_fetch_array($getprice)) {
                    $json_array['rowproductdata']['Cost'] = $priceRow['Cost'];
                    $json_array['rowproductdata']['prodprice'] = $priceRow['prodprice'];
                }

                echo json_encode($json_array['rowproductdata']);
                return;
            } else {
                $allproduct = mysqli_query($conn, "SELECT * FROM products");
                if (mysqli_num_rows($allproduct) > 0) {
                    $json_array = array(); // Create a new JSON array to hold all data
                    while ($row = mysqli_fetch_array($allproduct)) {
                        $prodid = $row['prodid'];

                        // Fetch product price data from the 'productprice' table
                        // $getprice = mysqli_query($conn, "SELECT p.prodid, p.prodname, MAX(pp.prodprice) AS lastProdPrice, MAX(pp.Cost) AS LastCost
                        // FROM products p
                        // LEFT JOIN productprice pp ON p.prodid = pp.prodid
                        // GROUP BY p.prodid, p.prodname;");
                        $getprice = mysqli_query($conn, "SELECT p.prodid, p.prodname, MAX(pp.prodprice) AS lastProdPrice, MAX(pp.Cost) AS LastCost
                        FROM products p
                        LEFT JOIN productprice pp ON p.prodid = pp.prodid
                        WHERE p.prodid='$prodid'
                        GROUP BY p.prodid, p.prodname;");


                        $priceRow = mysqli_fetch_array($getprice);

                        // Combine data from 'products' and 'productprice' tables
                        $combinedData = array(
                            "id" => $row['prodid'],
                            "prodname" => $row['prodname'],
                            "prodType" => $row['prodType'],
                            "qty" => $row['Qty'],
                            "img" => $row['img'],
                            "Cost" => $priceRow['LastCost'],
                            "prodprice" => $priceRow['lastProdPrice']
                        );

                        $json_array['productdata'][] = $combinedData;
                    }
                    echo json_encode($json_array["productdata"]);
                    return;
                } else {
                    echo json_encode(["Result" => "No data found"]);
                }
                break;
            }
        case "POST":
            if (isset($_FILES['img'])) {
                $prodid = generateProductID();
                $prodname = $_POST['prodName'];
                $prodType = $_POST['prodType'];
                // $prodate = $_POST['prodDate'];
                $prodCost = $_POST['Cost'];
                $prodprice = $_POST['prodprice'];
                $Qty = $_POST['Qty'];
                $img = $_FILES['img']['name'];
                $pfile_temp = $_FILES['img']['tmp_name'];
                $ext = pathinfo($img, PATHINFO_EXTENSION);
                $renameimg = create_unqueid() . '.' . $ext;
                $destination = $_SERVER['DOCUMENT_ROOT'] . '.\ugame_project\ugamerphp\UploadPictureFolder' . "/" . $renameimg;

                $result = mysqli_query($conn, "INSERT INTO products (prodid, prodname, prodType, Qty, img) VALUES ('$prodid', '$prodname', '$prodType', '$Qty', '$renameimg');");

                $result2 = mysqli_query($conn, "INSERT INTO productprice (prodid, prodDate, Cost, prodprice) VALUES ('$prodid',Now(), '$prodCost', '$prodprice');");

                if ($result && $result2) {
                    move_uploaded_file($pfile_temp, $destination);
                    echo json_encode(["success" =>  "Product " . $prodname . " Inserted Successfully"]);
                } else {
                    echo json_encode(["error" => "Product Not Inserted!"]);
                }
            } else {
                echo json_encode(["error" => "Data not in Correct Format"]);
            }
            break;




        case "DELETE":
            $path = explode('/', $_SERVER["REQUEST_URI"]); // Split the URL into an array
            $idPart = end($path); // Get the last part of the URL, which should be the ID
            // You mentioned that the ID does not have the "Emp-" prefix, so no need to remove it
            $numericPart = $idPart;
            // Use proper prepared statements to prevent SQL injection
            $stmt = $conn->prepare("DELETE FROM products WHERE prodid = ?");
            $stmt->bind_param("s", $numericPart); // Assuming 'id' is a string in your database
            $stmt2 = $conn->prepare("DELETE FROM productprice WHERE prodid = ?");
            $stmt2->bind_param("s", $numericPart);
            $suuc1 = $stmt->execute();
            $succ2 = $stmt2->execute();
            if ($suuc1 && $succ2) {
                echo json_encode(["success" => "User has been deleted!"]);
            } else {
                echo json_encode(["error" => "Please check the user data"]);
            }

            $stmt->close();
            break;
        default:;
    }
}
    

            // case "GET":
            //     //this (path call mean u call api)
            //     $path = explode('/', $_SERVER['REQUEST_URI']);
            //     if (isset($path[5])) {
            //         $json_array = array();
            //         $prodid = $path[5];
            //         // echo "get user id............" . $prodid;
            //         // die;
            //         $destination = $_SERVER['DOCUMENT_ROOT'] . ".\ugame_project\ugamerphp\UploadPictureFolder" . "/";
            //         $getuserrow = mysqli_query($conn, "SELECT * FROM products WHERE prodid='$prodid';");
            //         while ($productrow = mysqli_fetch_array($getuserrow)) {
            //             $json_array['rowproductdata'] = array("id" => $productrow['prodid'], "prodname" => $productrow['prodname'], "prodType" => $productrow['prodType'], "Cost" =>  $productrow['Cost'], "prodprice" =>  $productrow['prodprice'], "Qty" => $productrow['Qty'], "img" =>  $productrow['img']);
            //         }
            //         echo json_encode($json_array['rowproductdata']);
            //         return;
            //     } else {

            //         $allproduct = mysqli_query($conn, "SELECT * FROM products");
            //         if (mysqli_num_rows($allproduct) > 0) {
            //             while ($row = mysqli_fetch_array($allproduct)) {
            //                 $json_array['productdata'][] = array("id" => $row['prodid'], "prodname" => $row['prodname'], "prodType" => $row['prodType'], "qty" => $row['Qty'], "img" =>  $row['img']);
            //             }
            //             echo json_encode($json_array["productdata"]);
            //             return;
            //         } else {
            //             echo json_encode(["Resault" => "please check the data"]);
            //         }
            //         break;
            //     }
            // case "POST":
            //     if (isset($_FILES['img'])) {
            //         $prodid = generateProductID();
            //         $prodname = $_POST['prodName'];
            //         $prodType = $_POST['prodType'];
            //         $prodCost = $_POST['Cost'];
            //         $prodprice = $_POST['prodprice'];
            //         $Qty = $_POST['Qty'];
            //         $img = $_FILES['img']['name'];
            //         $pfile_temp = $_FILES['img']['tmp_name'];
            //         $ext = pathinfo($img, PATHINFO_EXTENSION);
            //         $renameimg = create_unqueid() . '.' . $ext;
            //         $destination = $_SERVER['DOCUMENT_ROOT'] . '.\ugame_project\ugamerphp\UploadPictureFolder' . "/" . $renameimg;


            //         $result = mysqli_query($conn, "INSERT INTO products (prodid, prodname, prodType, Cost, prodprice, Qty, img) VALUES ('$prodid', '$prodname', '$prodType', '$prodCost', '$prodprice', '$Qty', '$renameimg');");

            //         if ($result) {
            //             move_uploaded_file($pfile_temp, $destination);
            //             echo json_encode(["success" => "Product Inserted Successfully"]);
            //         } else {
            //             echo json_encode(["success" => "Product Not Inserted!"]);
            //         }
            //     } else {
            //         echo json_encode(["success" => "Data not in Correct Format"]);
            //     }
            //     break;
            //////////////////////////////////////////////////


            // ... (Previous code)

            // case "DELETE":
            //     $path = explode('/', $_SERVER["REQUEST_URI"]); // Split the URL into an array
            //     $idPart = end($path); // Get the last part of the URL, which should be the ID
            //     // You mentioned that the ID does not have the "Emp-" prefix, so no need to remove it
            //     $numericPart = $idPart;
            //     // Use proper prepared statements to prevent SQL injection
            //     $stmt = $conn->prepare("SELECT img FROM products WHERE prodid = ?");
            //     $stmt->bind_param("s", $numericPart); // Assuming 'id' is a string in your database
            //     $stmt->execute();
            //     $stmt->bind_result($img);
            //     $stmt->fetch();
            //     $stmt->close();

            //     $deleteStmt = $conn->prepare("DELETE FROM products WHERE prodid = ?");
            //     $deleteStmt->bind_param("s", $numericPart); // Assuming 'id' is a string in your database

            //     if ($deleteStmt->execute()) {
            //         // Delete the associated photo file from the folder if it exists
            //         $destination = $_SERVER['DOCUMENT_ROOT'] . '.\ugame_project\ugamerphp\UploadPictureFolder' . "/" . $img;
            //         if (file_exists($destination)) {
            //             if (unlink($destination)) {
            //                 echo json_encode(["success" => "Product and associated photo deleted successfully"]);
            //             } else {
            //                 echo json_encode(["error" => "Failed to delete associated photo"]);
            //             }
            //         } else {
            //             echo json_encode(["success" => "Product deleted, but associated photo not found"]);
            //         }
            //     } else {
            //         echo json_encode(["error" => "Please check the product data"]);
            //     }

            //     $deleteStmt->close();
            //     break;