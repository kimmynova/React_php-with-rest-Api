<?php
header("Access-Control-Allow-Origin: *"); // Replace with the actual origin of your React app
header("Content-Type: application/json");

// Include the database connection class or file
include "../Connection/connection.php";


function generateInvoice()
{
    global $conn;
    $currentYear = date('Y');

    // Query to get the last invoice number for the current year
    $queryID = mysqli_query($conn, "SELECT MAX(SUBSTRING_INDEX(invno, '-', -1)) AS max_id FROM tbl_invoice WHERE invno LIKE 'Inv-$currentYear%'");
    $row = mysqli_fetch_assoc($queryID);

    if (empty($row['max_id'])) {
        $nextId = "Inv-$currentYear-0001";
    } else {
        $nextNumericPart = intval($row['max_id']) + 1;
        $nextId = "Inv-$currentYear-" . str_pad($nextNumericPart, 4, '0', STR_PAD_LEFT);
    }

    return $nextId;
}

$invno = generateInvoice();

// Return the invoice number as JSON
$response = ['invoiceNumber' => $invno];
echo json_encode($response);
