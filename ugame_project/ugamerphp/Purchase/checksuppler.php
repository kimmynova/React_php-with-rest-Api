<?php
include "../Connection/connection.php";
include "../GenerateUniqkey/Unip_key_ID.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

$allsupData = mysqli_query($conn, "SELECT supid, supName, address, checkmark FROM tbl_supplier");

if (mysqli_num_rows($allsupData) > 0) {
    $json_array = array();

    while ($row = mysqli_fetch_assoc($allsupData)) {
        // Check if the "checkmark" field is "Unchecked"
        if ($row['checkmark'] === 'Unchecked') {
            $json_array[] = array(
                "supid" => $row['supid'],
                "supName" => $row['supName'],
                "address" => $row['address'],
                "checkmark" => $row['checkmark']
            );
        }
    }

    echo json_encode($json_array);
} else {
    echo json_encode(["result" => "Please check data!"]);
}
