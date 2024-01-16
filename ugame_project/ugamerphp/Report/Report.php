<?php
include "../Connection/connection.php";
include "../GenerateUniqkey/Unip_key_ID.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

if (mysqli_connect_error()) {
    echo json_encode(["error" => "Database connection error"]);
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
                $invoiceData = array();
                while ($row = mysqli_fetch_array($allinvoice)) {
                    $invoiceData[] = array(
                        "invno" => $row['invno'],
                        "invdate" => $row["invdate"],
                        "empName" => $row["empName"],
                        "custName" => $row["custName"],
                        "grandtotal" => $row["grandtotal"],
                        "Remark" => $row["Remark"]
                    );
                }
                $json_array['invociedata'] = $invoiceData;
            } else {
                $json_array['invociedata'] = ["Result" => "No data available for invoices"];
            }

            // Fetch data from tbl_invoicedetail
            $allinvoicedetail = mysqli_query($conn, "SELECT * FROM tbl_invoicedetail");
            if (mysqli_num_rows($allinvoicedetail) > 0) {
                $invoicedetailData = array();
                while ($row = mysqli_fetch_array($allinvoicedetail)) {
                    $invoicedetailData[] = array(
                        "No" => $row['No'],
                        "Invno" => $row["invno"],
                        "itemid" => $row["itemid"],
                        "Unitprice" => $row["Unitprice"],
                        "qty" => $row["qty"],
                        "total" => $row["total"]
                    );
                }
                $json_array['invoicedetailData'] = $invoicedetailData;
            } else {
                $json_array['invoicedetailData'] = ["Result" => "No data available for invoice details"];
            }

            // Fetch data from tbl_purchaseorder
            $allpurchase = mysqli_query($conn, "SELECT * FROM tbl_purchaseorder");
            if (mysqli_num_rows($allpurchase) > 0) {
                $purchaseData = array();
                while ($row = mysqli_fetch_array($allpurchase)) {
                    $purchaseData[] = array(
                        "pono" => $row['pono'],
                        "purdate" => $row["purdate"],
                        "empName" => $row["empName"],
                        "supid" => $row["supid"],
                        "grandtotal" => $row["grandtotal"],
                        "Remark" => $row["Remark"]
                    );
                }
                $json_array['purchaseData'] = $purchaseData;

                // Fetch data from tbl_purchaseorderdetail
                $allpurchasedetail = mysqli_query($conn, "SELECT * FROM tbl_purchaseorderdetail");
                if (mysqli_num_rows($allpurchasedetail) > 0) {
                    $purchaseOrderDetailData = array();
                    while ($row = mysqli_fetch_array($allpurchasedetail)) {
                        $purchaseOrderDetailData[] = array(
                            "No" => $row['No'],
                            "pono" => $row["pono"],
                            "itemid" => $row["itemid"],
                            "Unitprice" => $row["Unitprice"],
                            "qty" => $row["qty"],
                            "total" => $row["total"],

                        );
                    }
                    $json_array['purchaseOrderDetailData'] = $purchaseOrderDetailData;
                } else {
                    $json_array['purchaseOrderDetailData'] = ["Result" => "No data available for purchase order details"];
                }
            } else {
                $json_array['purchaseData'] = ["Result" => "No data available for purchase orders"];
            }

            // Fetch data from tbl_supplier

            $alljoinproduct = mysqli_query($conn, "SELECT p.prodid, p.prodname,p.prodType,Qty, MAX(pp.prodprice) AS lastProdPrice
            ,MAX(pp.prodDate) AS lastDate ,MAX(pp.Cost) AS lastCost FROM products p
            LEFT JOIN productprice pp ON p.prodid = pp.prodid
            GROUP BY p.prodid, p.prodname 
            HAVING qty> 0
            ");
            if (mysqli_num_rows($alljoinproduct) > 0) {
                $productData = array();
                while ($row = mysqli_fetch_array($alljoinproduct)) {
                    $productData[] = array(
                        "prodid" => $row['prodid'],
                        "prodName" => $row['prodname'],
                        "prodType" => $row['prodType'],
                        "Qty" => $row['Qty'],
                        "prodDate" => $row['lastDate'],
                        "Cost" => $row['lastCost'],
                        "prodprice" => $row['lastProdPrice']

                    );
                }
                $json_array['productData'] = $productData;
            } else {
                $json_array['productData'] = ["Result" => "No data available for Product"];
            }

            $allproductprice = mysqli_query($conn, "SELECT * FROM productprice");
            if (mysqli_num_rows($allproductprice) > 0) {
                $productData = array();
                while ($row = mysqli_fetch_array($allproductprice)) {
                    $productData[] = array(
                        "prodid" => $row['prodid'],
                        "proddate" => $row['prodDate'],
                        "Cost" => $row['Cost'],
                        "prodprice" => $row['prodprice'],
                        "Remark" => $row['Remark']

                    );
                }
                $json_array['productpriceData'] = $productData;
            } else {
                $json_array['productpriceData'] = ["Result" => "No data available for Product"];
            }

            $allcheckproduct = mysqli_query($conn, "SELECT p.prodid, p.prodname, p.prodType, Qty, MAX(pp.prodprice) AS lastProdPrice
            , MAX(pp.prodDate) AS lastDate, MAX(pp.Cost) AS lastCost FROM products p
            LEFT JOIN productprice pp ON p.prodid = pp.prodid
            GROUP BY p.prodid, p.prodname
            HAVING lastDate = DATE(NOW())
            "); // HAVING lastDate = DATE(NOW()) just check cuurent date
            if (mysqli_num_rows($allcheckproduct) > 0) {
                $productData = array();
                while ($row = mysqli_fetch_array($allcheckproduct)) {
                    $productData[] = array(
                        "prodid" => $row['prodid'],
                        "prodName" => $row['prodname'],
                        "prodType" => $row['prodType'],
                        "Qty" => $row['Qty'],
                        "prodDate" => $row['lastDate'],
                        "Cost" => $row['lastCost'],
                        "prodprice" => $row['lastProdPrice']
                    );
                }
                $json_array['productcheckData'] = $productData;
            } else {
                $json_array['productcheckData'] = ["Result" => "No data Update"];
            }



            $allproductOutstock = mysqli_query($conn, "SELECT p.prodid, p.prodname,p.prodType,Qty, MAX(pp.prodprice) AS lastProdPrice
            ,MAX(pp.prodDate) AS lastDate ,MAX(pp.Cost) AS lastCost FROM products p
            LEFT JOIN productprice pp ON p.prodid = pp.prodid
            GROUP BY p.prodid, p.prodname 
            HAVING Qty=0
            ");
            if (mysqli_num_rows($allproductOutstock) > 0) {
                $productData = array();
                while ($row = mysqli_fetch_array($allproductOutstock)) {
                    $productData[] = array(
                        "prodid" => $row['prodid'],
                        "prodName" => $row['prodname'],
                        "prodType" => $row['prodType'],
                        "Qty" => $row['Qty'],
                        "prodDate" => $row['lastDate'],
                        "Cost" => $row['lastCost'],
                        "prodprice" => $row['lastProdPrice']

                    );
                }
                $json_array['productStockData'] = $productData;
            } else {
                $json_array['productStockData'] = ["Result" => "No data available for Product"];
            }

            $checklengthstock = mysqli_query($conn, "SELECT * FROM products WHERE Qty = 0");

            if (mysqli_num_rows($checklengthstock) > 0) {
                $productData = array();
                while ($row = mysqli_fetch_array($checklengthstock)) {
                    $productData[] = array(
                        "prodid" => $row['prodid'],
                        "prodName" => $row['prodname'],
                        "prodType" => $row['prodType'],
                        "Qty" => $row['Qty'],

                    );
                }
                $json_array['StockoutData'] = $productData;
            } else {
                $json_array['StockoutData'] = ["Result" => "No data available for Product"];
            }






            echo json_encode($json_array);
            // echo json_encode($json_array, JSON_PRETTY_PRINT);
            break;
    }
}
