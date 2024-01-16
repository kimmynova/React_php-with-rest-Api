<?php
header("Access-Control-Allow-Origin: *"); // Replace with the actual origin of your React app
header("Content-Type: application/json");

// Include the database connection class or file
include "../Connection/connection.php";


function generatepurchase_order()
{
    global $conn;
    $currentYear = date('Y');

    // Query to get the last invoice number for the current year
    $queryID = mysqli_query($conn, "SELECT MAX(SUBSTRING_INDEX(pono, '-', -1)) AS max_pono FROM tbl_purchaseorder WHERE pono LIKE 'Po-$currentYear%'");
    $row = mysqli_fetch_assoc($queryID);

    if (empty($row['max_pono'])) {
        $nextId = "Po-$currentYear-0001";
    } else {
        $nextNumericPart = intval($row['max_pono']) + 1;
        $nextId = "Po-$currentYear-" . str_pad($nextNumericPart, 4, '0', STR_PAD_LEFT);
    }

    return $nextId;
}

$Pono = generatepurchase_order();

// Return the invoice number as JSON
$response = ['PurchaseNumber' => $Pono];
echo json_encode($response);
