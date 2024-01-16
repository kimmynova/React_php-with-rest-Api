<?php
$conn = new mysqli("localhost", "root", "", "ugamersystem");

if ($conn->connect_error) {
    die("connection failed" . $conn->connect_error);
}

function create_unqueid()
{
    $characters = 'abcdefghijklmnopwrstuvwxyz0123456789';
    $characters_length = strlen($characters);
    $random = '';
    for ($i = 0; $i < 30; $i++) {
        $random .= $characters[mt_rand(0, $characters_length - 1)];
    }
    return $random;
}
