-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 01, 2023 at 08:11 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ugamersystem`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` varchar(50) NOT NULL,
  `Cname` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `Cname`) VALUES
('U-2023-0850', 'Accessory'),
('U-2023-2177', 'Case'),
('U-2023-2892', 'Desktop'),
('U-2023-3147', 'Router'),
('U-2023-3916', 'Laptop'),
('U-2023-4619', 'Gaming'),
('U-2023-7453', 'Headset'),
('U-2023-8307', 'GPU');

-- --------------------------------------------------------

--
-- Table structure for table `productprice`
--

CREATE TABLE `productprice` (
  `prodid` varchar(50) NOT NULL,
  `prodDate` date NOT NULL,
  `Cost` float NOT NULL,
  `prodprice` float NOT NULL,
  `Remark` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productprice`
--

INSERT INTO `productprice` (`prodid`, `prodDate`, `Cost`, `prodprice`, `Remark`) VALUES
('Prod-2023-7589', '2023-11-01', 1000, 1500, ''),
('Prod-2023-7290', '2023-11-01', 800, 800, ''),
('Prod-2023-7290', '2023-11-01', 800, 1000, 'EditStock'),
('Prod-2023-7290', '2023-11-01', 800, 1000, ''),
('Prod-2023-7290', '2023-11-01', 900, 1200, '');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `prodid` varchar(20) NOT NULL,
  `prodname` varchar(50) NOT NULL,
  `prodType` varchar(50) NOT NULL,
  `Qty` int(10) NOT NULL,
  `img` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`prodid`, `prodname`, `prodType`, `Qty`, `img`) VALUES
('Prod-2023-7290', 'Dell', 'Laptop', 10, 'za68sfgfucdpsc363ktgdceomcgls9.jpg'),
('Prod-2023-7589', 'Asuse', 'Laptop', 20, 'svw1n5dyw9lpa7v6lckwbc802978xl.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_customer`
--

CREATE TABLE `tbl_customer` (
  `custid` varchar(50) NOT NULL,
  `custname` varchar(50) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `address` varchar(200) NOT NULL,
  `Status` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_customer`
--

INSERT INTO `tbl_customer` (`custid`, `custname`, `gender`, `address`, `Status`) VALUES
('Cust-2023-0001', 'Bong Sakadal', 'Male', 'Sakada@gmail.com', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_customerphone`
--

CREATE TABLE `tbl_customerphone` (
  `custid` varchar(50) NOT NULL,
  `contact` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_customerphone`
--

INSERT INTO `tbl_customerphone` (`custid`, `contact`) VALUES
('Cust-2023-0001', 97123);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_employee`
--

CREATE TABLE `tbl_employee` (
  `id` varchar(50) NOT NULL,
  `empname` varchar(50) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `dob` date NOT NULL,
  `role` varchar(50) NOT NULL,
  `address` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_employee`
--

INSERT INTO `tbl_employee` (`id`, `empname`, `gender`, `dob`, `role`, `address`) VALUES
('Emp-2023-0001', 'kimleng', 'Male', '2023-10-13', 'HR', '33,45'),
('Emp-2023-0002', 'sela', 'Male', '2023-10-11', 'Stock', '33,45'),
('Emp-2023-0003', 'somnet', 'Male', '2023-10-04', 'Seller', '33,45'),
('Emp-2023-0004', 'Ngan', 'Male', '2023-11-18', 'HR', '52,12'),
('Emp-2023-0005', 'Yuon Jim', 'Male', '2023-10-02', 'Seller', '12,34a');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_employeeemail`
--

CREATE TABLE `tbl_employeeemail` (
  `id` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_employeeemail`
--

INSERT INTO `tbl_employeeemail` (`id`, `email`) VALUES
('Emp-2023-0001', 'kim@gamil.com'),
('Emp-2023-0002', 'adadkaka@ada'),
('Emp-2023-0003', 'somnet@gmail.com'),
('Emp-2023-0004', 'nagn@gmail.com'),
('Emp-2023-0005', 'jim@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_employeephone`
--

CREATE TABLE `tbl_employeephone` (
  `id` varchar(20) NOT NULL,
  `Contact` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_employeephone`
--

INSERT INTO `tbl_employeephone` (`id`, `Contact`) VALUES
('Emp-2023-0001', 9671318),
('Emp-2023-0002', 193131),
('Emp-2023-0003', 9183138),
('Emp-2023-0004', 88913193),
('Emp-2023-0005', 9817237),
('Emp-2023-0005', 981239),
('Emp-2023-0005', 91239);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_invoice`
--

CREATE TABLE `tbl_invoice` (
  `invno` varchar(20) NOT NULL,
  `invdate` date NOT NULL,
  `empName` varchar(50) NOT NULL,
  `custName` varchar(50) NOT NULL,
  `grandtotal` int(50) NOT NULL,
  `Remark` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_invoice`
--

INSERT INTO `tbl_invoice` (`invno`, `invdate`, `empName`, `custName`, `grandtotal`, `Remark`) VALUES
('Inv-2023-0001', '2023-10-18', 'somnet', 'Owner-owner', 1500, ''),
('Inv-2023-0002', '2023-09-18', 'somnet', 'Owner-owner', 300, ''),
('Inv-2023-0003', '2023-10-18', 'somnet', 'Owner-owner', 4120, 'hleo'),
('Inv-2023-0004', '2023-10-19', 'Secret', 'Owner-owner', 90, '');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_invoicedetail`
--

CREATE TABLE `tbl_invoicedetail` (
  `No` int(11) NOT NULL,
  `invno` varchar(50) NOT NULL,
  `itemid` varchar(50) NOT NULL,
  `Unitprice` int(11) NOT NULL,
  `qty` int(50) NOT NULL,
  `total` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_invoicedetail`
--

INSERT INTO `tbl_invoicedetail` (`No`, `invno`, `itemid`, `Unitprice`, `qty`, `total`) VALUES
(1, 'Inv-2023-0001', 'Asuse', 1500, 1, 1500),
(1, 'Inv-2023-0002', 'WIFI 2.0', 300, 1, 300),
(1, 'Inv-2023-0003', 'Asuse', 1500, 1, 1500),
(2, 'Inv-2023-0003', 'v', 10, 1, 10),
(3, 'Inv-2023-0003', 'DEll', 1000, 1, 1000),
(4, 'Inv-2023-0003', 'a', 10, 1, 10),
(5, 'Inv-2023-0003', 'MSI', 1600, 1, 1600),
(1, 'Inv-2023-0004', 'Msi', 10, 9, 90);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_purchaseorder`
--

CREATE TABLE `tbl_purchaseorder` (
  `pono` varchar(50) NOT NULL,
  `purdate` date NOT NULL,
  `empName` varchar(50) NOT NULL,
  `supid` varchar(50) NOT NULL,
  `grandtotal` float NOT NULL,
  `Remark` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_purchaseorder`
--

INSERT INTO `tbl_purchaseorder` (`pono`, `purdate`, `empName`, `supid`, `grandtotal`, `Remark`) VALUES
('Po-2023-0001', '2023-11-01', 'sela', 'Sup-2023-3238', 23000, 'NEW product');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_purchaseorderdetail`
--

CREATE TABLE `tbl_purchaseorderdetail` (
  `No` varchar(50) NOT NULL,
  `pono` varchar(50) NOT NULL,
  `itemid` varchar(50) NOT NULL,
  `Unitprice` float NOT NULL,
  `qty` int(10) NOT NULL,
  `total` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_purchaseorderdetail`
--

INSERT INTO `tbl_purchaseorderdetail` (`No`, `pono`, `itemid`, `Unitprice`, `qty`, `total`) VALUES
('1', 'Po-2023-0001', 'Asuse', 1500, 10, 15000),
('2', 'Po-2023-0001', 'Dell', 800, 10, 8000);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_supplier`
--

CREATE TABLE `tbl_supplier` (
  `supid` varchar(50) NOT NULL,
  `supName` varchar(50) NOT NULL,
  `address` varchar(50) NOT NULL,
  `checkmark` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_supplier`
--

INSERT INTO `tbl_supplier` (`supid`, `supName`, `address`, `checkmark`) VALUES
('Sup-2023-0789', 'MSI', 'UK', 'Unchecked'),
('Sup-2023-3238', 'Asuse', 'USA', 'Checked');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_supplieremail`
--

CREATE TABLE `tbl_supplieremail` (
  `supid` varchar(50) NOT NULL,
  `supemail` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_supplieremail`
--

INSERT INTO `tbl_supplieremail` (`supid`, `supemail`) VALUES
('Sup-2023-0789', 'k'),
('Sup-2023-3238', 'd'),
('Sup-2023-0789', 'l'),
('Sup-2023-0789', 'a');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_supplierphone`
--

CREATE TABLE `tbl_supplierphone` (
  `supid` varchar(50) NOT NULL,
  `supPhone` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_supplierphone`
--

INSERT INTO `tbl_supplierphone` (`supid`, `supPhone`) VALUES
('Sup-2023-0789', 12),
('Sup-2023-0789', 45),
('Sup-2023-3238', 12),
('Sup-2023-0789', 67);

-- --------------------------------------------------------

--
-- Table structure for table `user_login`
--

CREATE TABLE `user_login` (
  `id` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Role` varchar(50) NOT NULL,
  `Password` varchar(50) NOT NULL,
  `img` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_login`
--

INSERT INTO `user_login` (`id`, `Name`, `Username`, `Role`, `Password`, `img`) VALUES
('U-2023-0001', 'Secret', 'Admin', 'SuperAdmin', '12345', 'f0vftrvhfr7cvlxpa8uxpwwg7ujgu8.png'),
('U-2023-4166', 'sela', 'sela', 'Stock', '12345', '43ofv3gzly1285zmb2j5phd8ny6yzr.jpg'),
('U-2023-5752', 'kimleng', 'kim', 'HR', '12345', 'y1ldt9to1h8p1uggtfxtmw1cltw078.bmp'),
('U-2023-6435', 'Ngan', 'ngan', 'HR', '12345', '94dmt1v1ipojwvlkm02hucww6kw67g.jpg'),
('U-2023-7576', 'somnet', 'somnet', 'Seller', '12345', '66i4obhcmwwwutys5kk1twp8436yog.jpg'),
('U-2023-7915', 'Yuon Jim', 'jim', 'Seller', '12345', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`prodid`);

--
-- Indexes for table `tbl_customer`
--
ALTER TABLE `tbl_customer`
  ADD PRIMARY KEY (`custid`);

--
-- Indexes for table `tbl_employee`
--
ALTER TABLE `tbl_employee`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_invoice`
--
ALTER TABLE `tbl_invoice`
  ADD PRIMARY KEY (`invno`);

--
-- Indexes for table `tbl_purchaseorder`
--
ALTER TABLE `tbl_purchaseorder`
  ADD PRIMARY KEY (`pono`);

--
-- Indexes for table `tbl_supplier`
--
ALTER TABLE `tbl_supplier`
  ADD PRIMARY KEY (`supid`);

--
-- Indexes for table `user_login`
--
ALTER TABLE `user_login`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
