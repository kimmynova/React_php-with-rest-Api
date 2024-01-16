<?php
// function generateProductID()
// {
//     global $conn;
//     $currentYear = date("Y");

//     $sql = mysqli_query($conn, "SELECT MAX(prodid) as max_pono FROM products WHERE prodid LIKE 'Prod-$currentYear%'");
//     $row = mysqli_fetch_assoc($sql);
//     $currentproID = $row['max_pono'];
//     $numPart = (int)substr($currentproID, -4);
//     $nextNumPart = $numPart + 1;
//     $nextproid = "Prod-$currentYear-" . str_pad($nextNumPart, 4, '0', STR_PAD_LEFT);
//     return $nextproid;
// }

/////////////////////////userID
function generateUserId()
{
    global $conn;
    $currentYear = date("Y");

    do {
        $nextNumPart = rand(1, 9999);
        $nextproid = "U-$currentYear-" . str_pad($nextNumPart, 4, '0', STR_PAD_LEFT);
        $sql = mysqli_query($conn, "SELECT COUNT(*) as count FROM user_login WHERE id='$nextproid'");
        $row = mysqli_fetch_assoc($sql);
        $count = $row['count'];
    } while ($count > 0);

    return $nextproid;
}


function generateProductID()
{
    global $conn;
    $currentYear = date("Y");

    do {
        $nextNumPart = rand(1, 9999);
        $nextproid = "Prod-$currentYear-" . str_pad($nextNumPart, 4, '0', STR_PAD_LEFT);
        $sql = mysqli_query($conn, "SELECT COUNT(*) as count FROM products WHERE prodid='$nextproid'");
        $row = mysqli_fetch_assoc($sql);
        $count = $row['count'];
    } while ($count > 0);

    return $nextproid;
}

function generateEmployeeId()
{
    global $conn;


    $currentYear = date('Y');

    $currentMaxIdQuery = mysqli_query($conn, "SELECT MAX(id) as max_pono FROM tbl_employee WHERE id LIKE 'Emp-$currentYear%'");
    $row = mysqli_fetch_assoc($currentMaxIdQuery);
    $currentMaxId = $row['max_pono'];

    $numericPart = (int)substr($currentMaxId, -4);
    $nextNumericPart = $numericPart + 1;

    $nextId = "Emp-$currentYear-" . str_pad($nextNumericPart, 4, '0', STR_PAD_LEFT);

    return $nextId;
}
function generateCustomerId()
{
    global $conn;
    $currentYear = date('Y');

    $currentMaxIdQuery = mysqli_query($conn, "SELECT MAX(custid) as max_custid FROM tbl_customer WHERE custid LIKE 'Cust-$currentYear%'");
    $row = mysqli_fetch_assoc($currentMaxIdQuery);
    $currentMaxId = $row['max_custid'];

    $numericPart = (int)substr($currentMaxId, -4);
    $nextNumericPart = $numericPart + 1;

    $nextId = "Cust-$currentYear-" . str_pad($nextNumericPart, 4, '0', STR_PAD_LEFT);

    return $nextId;
    // Get the current year
    // $currentYear = date('Y');
    // $nextNumericPart = 1;
    // $nextId = "Cust-$currentYear-" . str_pad($nextNumericPart, 4, '0', STR_PAD_LEFT);

    // // Check if the generated ID already exists in the table
    // $checkQuery = mysqli_query($conn, "SELECT custid FROM tbl_customer WHERE custid = '$nextId'");
    // while (mysqli_num_rows($checkQuery) > 0) {
    //     $nextNumericPart++;
    //     $nextId = "Cust-$currentYear-" . str_pad($nextNumericPart, 4, '0', STR_PAD_LEFT);
    //     $checkQuery = mysqli_query($conn, "SELECT custid FROM tbl_customer WHERE custid = '$nextId'");
    // }

    // return $nextId;
}
function generatesupplierId()
{
    global $conn;

    // Get the current year
    // $currentYear = date('Y');
    // $nextNumericPart = 1;
    // $nextId = "Sup-$currentYear-" . str_pad($nextNumericPart, 4, '0', STR_PAD_LEFT);

    // // Check if the generated ID already exists in the table
    // $checkQuery = mysqli_query($conn, "SELECT supid FROM tbl_supplier WHERE supid = '$nextId'");
    // while (mysqli_num_rows($checkQuery) > 0) {
    //     $nextNumericPart++;
    //     $nextId = "Sup-$currentYear-" . str_pad($nextNumericPart, 4, '0', STR_PAD_LEFT);
    //     $checkQuery = mysqli_query($conn, "SELECT supid FROM tbl_supplier WHERE supid = '$nextId'");
    // }

    // return $nextId;
    global $conn;
    $currentYear = date("Y");

    do {
        $nextNumPart = rand(1, 9999);
        $nextsupid = "Sup-$currentYear-" . str_pad($nextNumPart, 4, '0', STR_PAD_LEFT);
        $sql = mysqli_query($conn, "SELECT COUNT(*) as count FROM tbl_supplier WHERE supid='$nextsupid'");
        $row = mysqli_fetch_assoc($sql);
        $count = $row['count'];
    } while ($count > 0);

    return $nextsupid;
}


function generateInvoiceID()
{
    global $conn;


    $currentYear = date('Y');

    // Query to get the last invoice number for the current year
    $queryID = mysqli_query($conn, "SELECT MAX(SUBSTRING_INDEX(invno, '-', -1)) AS max_invno FROM tbl_invoice WHERE invno LIKE 'Inv-$currentYear%'");
    $row = mysqli_fetch_assoc($queryID);

    if (empty($row['max_invno'])) {
        $nextId = "Inv-$currentYear-0001";
    } else {
        // Extract and increment the numeric part
        $nextNumericPart = intval($row['max_invno']) + 1;

        // Format the new invoice number with leading zeros
        $nextId = "Inv-$currentYear-" . str_pad($nextNumericPart, 4, '0', STR_PAD_LEFT);
    }



    return $nextId;
}
function generatepuID()
{
    global $conn;


    $currentYear = date('Y');

    // Query to get the last invoice number for the current year
    $queryID = mysqli_query($conn, "SELECT MAX(SUBSTRING_INDEX(pono, '-', -1)) AS max_pono FROM tbl_purchaseorder WHERE pono LIKE 'Po-$currentYear%'");
    $row = mysqli_fetch_assoc($queryID);

    if (empty($row['max_pono'])) {
        $nextId = "Po-$currentYear-0001";
    } else {
        // Extract and increment the numeric part
        $nextNumericPart = intval($row['max_pono']) + 1;

        // Format the new invoice number with leading zeros
        $nextId = "Po-$currentYear-" . str_pad($nextNumericPart, 4, '0', STR_PAD_LEFT);
    }



    return $nextId;
}
function generateCategoryId()
{
    global $conn;


    $currentYear = date('Y');

    do {
        $nextNumPart = rand(1, 9999);
        $nextid = "U-$currentYear-" . str_pad($nextNumPart, 4, '0', STR_PAD_LEFT);
        $sql = mysqli_query($conn, "SELECT COUNT(*) as count FROM category WHERE id='$nextid'");
        $row = mysqli_fetch_assoc($sql);
        $count = $row['count'];
    } while ($count > 0);

    return $nextid;
}
