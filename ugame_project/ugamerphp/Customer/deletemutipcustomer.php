<?php
include "../Connection/connection.php";
include "../GenerateUniqkey/Unip_key_ID.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json");

if (mysqli_connect_error()) {
	echo json_encode(["error" => "Database connection error"]);
	exit;
} else {
	$method = $_SERVER['REQUEST_METHOD'];
	switch ($method) {
		case 'GET':
			$path = explode('/', $_SERVER['REQUEST_URI']);
			if (isset($path[5])) {
				$custid = $path[5];
				$stmt = $conn->prepare("SELECT * FROM tbl_customer WHERE custid = ?");
				$stmt->bind_param("s", $custid);
				$stmt->execute();
				$result = $stmt->get_result();

				if ($result->num_rows > 0) {
					$row = $result->fetch_assoc();
					echo json_encode([
						'custid' => $row['custid'],
						'custName' => $row['custname'],
						'gender' => $row['gender'],
						'address' => $row['address'],
					]);
				} else {
					echo json_encode(["result" => "Customer not found"]);
				}

				$stmt->close();
				return;
			} else {
				$allcustData = mysqli_query($conn, "SELECT * FROM tbl_customer");
				if (mysqli_num_rows($allcustData) > 0) {
					$json_array = [];
					while ($row = mysqli_fetch_assoc($allcustData)) {
						$custid = $row['custid'];
						$phoneQuery = mysqli_query($conn, "SELECT Contact FROM tbl_customerphone WHERE custid = '$custid'");
						$phoneData = [];
						while ($phoneRow = mysqli_fetch_assoc($phoneQuery)) {
							$phoneData[] = $phoneRow['Contact'];
						}
						$json_array[] = [
							'custid' => $row['custid'],
							'custName' => $row['custname'],
							'gender' => $row['gender'],
							'address' => $row['address'],
							'contact' => $phoneData
						];
					}
					echo json_encode($json_array);
				} else {
					echo json_encode(["result" => "No customer data available"]);
				}
			}
			break;

		case 'DELETE':
			// Get the JSON data from the request body
			$data = json_decode(file_get_contents("php://input"));

			if (isset($data->checkedIds) && is_array($data->checkedIds)) {
				// Handle deleting multiple users
				$checkedIds = $data->checkedIds;

				// Use IN clause to delete multiple users at once in both tables
				$placeholders = implode(', ', array_fill(0, count($checkedIds), '?'));
				$stmt1 = $conn->prepare("DELETE FROM tbl_customer WHERE custid IN ($placeholders)");
				$stmt2 = $conn->prepare("DELETE FROM tbl_customerphone WHERE custid IN ($placeholders)");

				// Bind parameters
				$types = str_repeat('s', count($checkedIds)); // Assuming IDs are strings
				$stmt1->bind_param($types, ...$checkedIds);
				$stmt2->bind_param($types, ...$checkedIds);

				// Execute the DELETE operations
				$success1 = $stmt1->execute();
				$success2 = $stmt2->execute();

				if ($success1 && $success2) {
					$deletedCount = $stmt1->affected_rows;
					echo json_encode(["success" => "$deletedCount user(s) have been deleted"]);
				} else {
					echo json_encode(["error" => "Failed to delete user(s)"]);
				}

				$stmt1->close();
				$stmt2->close();
			} else {
				echo json_encode(["error" => "Invalid input data"]);
			}
			break;

		default:
			echo json_encode(["error" => "Unsupported HTTP method"]);
			break;
	}
}
