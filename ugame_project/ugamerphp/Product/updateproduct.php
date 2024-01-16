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
                $prodid = $path[5];
                $destination = $_SERVER['DOCUMENT_ROOT'] . './ugame_project/ugamerphp/UploadPictureFolder' . '/';

                // Fetch product data from the 'products' table
                $getuserrow = mysqli_query($conn, "SELECT * FROM products WHERE prodid='$prodid';");
                while ($productrow = mysqli_fetch_array($getuserrow)) {
                    $json_array['rowproductdata'] = array("id" => $productrow['prodid'], "prodname" => $productrow['prodname'], "prodType" => $productrow['prodType'], "Cost" =>  $productrow['Cost'], "prodprice" =>  $productrow['prodprice'], "Qty" => $productrow['Qty'], "img" =>  $productrow['img']);
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
                        $getprice = mysqli_query($conn, "SELECT * FROM productprice WHERE prodid='$prodid';");
                        $priceRow = mysqli_fetch_array($getprice);

                        // Combine data from 'products' and 'productprice' tables
                        $combinedData = array(
                            "id" => $row['prodid'],
                            "prodname" => $row['prodname'],
                            "prodType" => $row['prodType'],
                            "qty" => $row['Qty'],
                            "img" => $row['img'],
                            "Cost" => $priceRow['Cost'],
                            "prodprice" => $priceRow['prodprice'],
                            "Remark" => $priceRow['Remark']
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
            if (isset($_FILES['img']) && !empty($_FILES['img']['name'])) {
                $prodid = $_POST['prodid'];
                $prodName = $_POST['prodName'];
                $prodType = $_POST['prodType'];
                $Cost = $_POST['Cost'];
                $prodprice = $_POST['prodprice'];
                $Qty = $_POST['Qty'];
                $remark = $_POST['Remark'];
                $img = $_FILES['img']['name'];
                $pfile_temp = $_FILES['img']['tmp_name'];
                $ext = pathinfo($img, PATHINFO_EXTENSION);
                $renameimg = create_unqueid() . '.' . $ext;
                $destination = $_SERVER['DOCUMENT_ROOT'] . './ugame_project/ugamerphp/UploadPictureFolder' . "/" . $renameimg;
                move_uploaded_file($pfile_temp, $destination);

                $result = mysqli_query($conn, "UPDATE products SET prodname='$prodName', prodType='$prodType', Qty='$Qty', img='$renameimg' WHERE prodid='$prodid'");
                $result2 = mysqli_query($conn, "INSERT INTO productprice (prodid, prodDate, Cost, prodprice, Remark) VALUES ('$prodid', NOW(), '$Cost', '$prodprice', '$remark')");
                if ($result && $result2) {
                    $updatedData = array(
                        "prodName" => $prodName,
                        "prodType" => $prodType,
                        "Cost" => $Cost,
                        "prodprice" => $prodprice,
                        "Qty" => $Qty,
                        "img" => $renameimg,
                        "Remark" => $remark
                    );
                    echo json_encode(["success" => "Product Updated Successfully", "updatedData" => $updatedData]);
                } else {
                    echo json_encode(["error" => "Product Not Updated!"]);
                }
            } else {
                $prodid = $_POST['prodid'];
                $prodName = $_POST['prodName'];
                $prodType = $_POST['prodType'];
                $Cost = $_POST['Cost'];
                $prodprice = $_POST['prodprice'];
                $Qty = $_POST['Qty'];
                $remark = $_POST['Remark'];

                $result = mysqli_query($conn, "UPDATE products SET prodname='$prodName', prodType='$prodType',  Qty='$Qty' WHERE prodid='$prodid'");
                $result2 = mysqli_query($conn, "INSERT INTO productprice (prodid, prodDate, Cost, prodprice,Remark) VALUES ('$prodid', NOW(), '$Cost', '$prodprice','$remark');");
                if ($result && $result2) {
                    $updatedData = array(
                        "prodName" => $prodName,
                        "prodType" => $prodType,
                        "Cost" => $Cost,
                        "prodprice" => $prodprice,
                        "Qty" => $Qty,
                        "remark" => $remark
                    );
                    echo json_encode(["success" => "Product Updated Successfully", "updatedData" => $updatedData]);
                } else {
                    echo json_encode(["error" => "Product Not Updated!"]);
                }
            }
            break;

        default:
    }
}
  // case "GET":
            //     $path = explode('/', $_SERVER['REQUEST_URI']);
            //     if (isset($path[5])) {
            //         $json_array = array();
            //         $prodid = $path[5];
            //         $destination = $_SERVER['DOCUMENT_ROOT'] . './ugame_project/ugamerphp/UploadPictureFolder' . '/';
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
            //             echo json_encode(["Result" => "No data found"]);
            //         }
            //         break;
            //     }

// if (mysqli_connect_error()) {
//     echo mysqli_connect_error();
//     exit;
// } else {
//     $method = $_SERVER['REQUEST_METHOD'];
//     switch ($method) {

//         case "GET":
//             //this (path call mean u call api)
//             $path = explode('/', $_SERVER['REQUEST_URI']);
//             if (isset($path[5])) {
//                 $json_array = array();
//                 $prodid = $path[5];
//                 // echo "get user id............" . $prodid;
//                 // die;
//                 $destination = $_SERVER['DOCUMENT_ROOT'] . ".\ugame_project\ugamerphp\UploadPictureFolder" . "/";
//                 $getuserrow = mysqli_query($conn, "SELECT * FROM products WHERE prodid='$prodid';");
//                 while ($productrow = mysqli_fetch_array($getuserrow)) {
//                     $json_array['rowproductdata'] = array("id" => $productrow['prodid'], "prodname" => $productrow['prodname'], "prodType" => $productrow['prodType'], "Cost" =>  $productrow['Cost'], "prodprice" =>  $productrow['prodprice'], "Qty" => $productrow['Qty'], "img" =>  $productrow['img']);
//                 }
//                 echo json_encode($json_array['rowproductdata']);
//                 return;
//             } else {

//                 $allproduct = mysqli_query($conn, "SELECT * FROM products");
//                 if (mysqli_num_rows($allproduct) > 0) {
//                     while ($row = mysqli_fetch_array($allproduct)) {
//                         $json_array['productdata'][] = array("id" => $row['prodid'], "prodname" => $row['prodname'], "prodType" => $row['prodType'], "Cost" =>  $row['Cost'], "prodprice" =>  $row['prodprice'], "qty" => $row['Qty'], "img" =>  $row['img']);
//                     }
//                     echo json_encode($json_array["productdata"]);
//                     return;
//                 } else {
//                     echo json_encode(["Resault" => "please check the data"]);
//                 }
//                 break;
//             }
//         case "POST":
//             if (isset($_FILES['img']) && !empty($_FILES['img']['name'])) {
//                 // New image is uploaded
//                 $prodid = $_POST['prodid'];
//                 $prodName = $_POST['prodName'];
//                 $prodType = $_POST['prodType'];
//                 $Cost = $_POST['Cost'];
//                 $prodprice = $_POST['prodprice'];
//                 $Qty = $_POST['Qty'];

//                 // Handle image upload as before (generate a unique name, move to the destination folder, etc.)
//                 $img = $_FILES['img']['name'];
//                 $pfile_temp = $_FILES['img']['tmp_name'];
//                 $ext = pathinfo($img, PATHINFO_EXTENSION);
//                 $renameimg = create_unqueid() . '.' . $ext;
//                 $destination = $_SERVER['DOCUMENT_ROOT'] . '.\ugame_project\ugamerphp\UploadPictureFolder' . "/" . $renameimg;
//                 move_uploaded_file($pfile_temp, $destination);

//                 // Update the 'img' field in the database with the new image name
//                 $result = mysqli_query($conn, "UPDATE products SET prodname='$prodName', prodType='$prodType', Cost='$Cost', prodprice='$prodprice', Qty='$Qty', img='$renameimg' WHERE prodid='$prodid'");
//                 if ($result) {
//                     $updatedData = array(
//                         "prodName" => $prodName,
//                         "prodType" => $prodType,
//                         "Cost" => $Cost,
//                         "prodprice" => $prodprice,
//                         "Qty" => $Qty,
//                         "img" => $renameimg
//                     );
//                     echo json_encode(["success" => "Product Updated Successfully", "updatedData" => $updatedData]);
//                 } else {
//                     echo json_encode(["error" => "Product Not Updated!"]);
//                 }
//             } else {
//                 // No new image uploaded, keep the existing image in the database
//                 $prodid = $_POST['prodid'];
//                 $prodName = $_POST['prodName'];
//                 $prodType = $_POST['prodType'];
//                 $Cost = $_POST['Cost'];
//                 $prodprice = $_POST['prodprice'];
//                 $Qty = $_POST['Qty'];

//                 // Do not update the 'img' field in the database
//                 $result = mysqli_query($conn, "UPDATE products SET prodname='$prodName', prodType='$prodType', Cost='$Cost', prodprice='$prodprice', Qty='$Qty' WHERE prodid='$prodid'");
//                 if ($result) {
//                     $updatedData = array(
//                         "prodName" => $prodName,
//                         "prodType" => $prodType,
//                         "Cost" => $Cost,
//                         "prodprice" => $prodprice,
//                         "Qty" => $Qty
//                     );
//                     echo json_encode(["success" => "Product Updated Successfully", "updatedData" => $updatedData]);
//                 } else {
//                     echo json_encode(["error" => "Product Not Updated!"]);
//                 }
//             }
//             break;

//         default:
//     }
// }