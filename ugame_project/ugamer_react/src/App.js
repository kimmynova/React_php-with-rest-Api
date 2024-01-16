import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, NavLink } from 'react-router-dom';
import Navbar from "./Componment/Navbar";
import Home from "./page/Home";
import User from "./Componment/Userform/User"
import Register from "./page/Register";
import Viewproduct from "./Componment/Product_File/Viewproduct";
import Login from "./page/Login";
import Protected from "./Componment/Protect";
import Employee from "./Componment/Employeeform/Employee";
import Edittable from "./Componment/Product_File/Edittable";
import Edituser from "./Componment/Userform/Edituser";
import EditEmployee from "./Componment/Employeeform/EditEmployee";
import AddEmployee from "./Componment/Employeeform/AddEmployee";
import AddCustomer from "./Componment/custumer/AddCustomer";
import Add_Product from "./Componment/Product_File/Add_Product";
import EditProduct from "./Componment/Product_File/EditProduct";
import Invoice from "./Componment/Invoice_Product/Invoice";
import Print_invoice from "./Componment/Invoice_Product/Print_invoice";
import Report from "./Componment/Report/Report";
import Customer from "./Componment/custumer/Customer";
import Editcustomer from "./Componment/custumer/Editcustomer";
import Customerphone from "./Componment/custumer/Customerphone";
import Employeephone from "./Componment/Employeeform/Employeephone";
import Employeeemail from "./Componment/Employeeform/Employeeemail";
import Purchase_order from "./Componment/Purchase_order/Purchase_order";
import Addsupplier from "./Componment/Supplier/Addsupplier";
import Supplier from "./Componment/Supplier/Supplier";
import SupplierEmail from "./Componment/Supplier/SupplierEmail";
import SupplierPhone from "./Componment/Supplier/SupplierPhone";
import SupplierEdit from "./Componment/Supplier/SupplierEdit";
import Purchase_print from "./Componment/Purchase_order/Purchase_print";
import Adduser from "./page/Adduser";
import Reportproduct from "./Componment/Report/Reports/Reportproduct";
import Error from "./alertmesengebox/Error";
import Category from "./Componment/Category/Category";
import AddCategory from "./Componment/Category/AddCategory";
import EditCategory from "./Componment/Category/EditCategory";
import Reportinvoice from "./Componment/Report/Reports/Reportinvoice";
import Reportpurchase from "./Componment/Report/Reports/Reportpurchase";

function App() {

  return (
    <div className="App">

      <Router>
        <div className="dark:bg-[#06080F] dark:text-[#f5f5f5] dark:duration-1000 duration-1000 ease-out h-screen">

          <AppContent />

        </div>
      </Router>

    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isLoginRoute = location.pathname === '/';
  const isregsiterRoute = location.pathname === '/Register';
  const isInvoiceRoute = location.pathname === '/invoice'
  const isprintInvoiceRoute = location.pathname === '/print_invoice'
  const userRole = localStorage.getItem('UserRole')
  const errorRoute = location.pathname === '*'

  return (
    <>
      {!isLoginRoute && !isregsiterRoute && !isprintInvoiceRoute && !errorRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Protected Component={Home} />} />

        {userRole == 'SuperAdmin' && (
          <>
          <Route path="/category" element={<Category />} />
          <Route path="/Addcategory" element={<AddCategory />} />
          <Route path="/editCategory/:id" element={<EditCategory />} />

            <Route path="/Employee" element={<Employee />} />
            <Route path="/addEmployee" element={<AddEmployee />} />
            <Route path="/editEmployee/:id" element={<EditEmployee />} />
            <Route path="/employeephone/:id" element={<Employeephone />} />
            <Route path="/employeeemail/:id" element={<Employeeemail />} />

            <Route path="/register" element={<Register />} />
            <Route path="/Adduser" element={<Adduser />} />
            <Route path="/user" element={<User />} />
            <Route path="/edituser/:id" element={<Edituser />} />

            <Route path="/product" element={<Add_Product />} />
            <Route path="/showproduct" element={<Edittable />} />
            <Route path="/editproduct/:id" element={<EditProduct />} />
            <Route path="/report" element={<Report />} />
            <Route path="/reporta" element={<Reportproduct />} />
            <Route path="/vproduct" element={<Viewproduct />} />
            <Route path="/Addcustomer" element={<AddCustomer />} />
            <Route path="/showcustomer" element={<Customer />} />
            <Route path="/editcustomer/:id" element={<Editcustomer />} />
            <Route path="/custphone/:custid" element={<Customerphone />} />

            <Route path="/invoice" element={<Invoice />} />
            <Route path="/print_invoice" element={<Print_invoice />} />
            <Route path="/purchaseorder" element={<Purchase_order />} />
            <Route path="/purchaseprint" element={<Purchase_print />} />
            <Route path="/purchaseorder_print" element={<Purchase_order />} />
            <Route path="Addsupplier" element={<Addsupplier />} />
            <Route path="supplier" element={<Supplier />} />
            <Route path="supplier/:supid" element={<Supplier />} />
            <Route path="/editsupplier/:supid" element={<SupplierEdit />} />
            <Route path="supplierphone/:supid" element={<SupplierPhone />} />
            <Route path="supplieremail/:supid" element={<SupplierEmail />} />
          </>
        )}
        {userRole === 'HR' ? (
          <>
            <Route path="/category" element={<Category />} />
            <Route path="/Addcategory" element={<AddCategory />} />
            <Route path="/editCategory/:id" element={<EditCategory />} />
            
            <Route path="/Employee" element={<Employee />} />
            <Route path="/addEmployee" element={<AddEmployee />} />
            <Route path="/editEmployee/:id" element={<EditEmployee />} />
            <Route path="/employeephone/:id" element={<Employeephone />} />
            <Route path="/employeeemail/:id" element={<Employeeemail />} />

            <Route path="/register" element={<Register />} />
            <Route path="/Adduser" element={<Adduser />} />
            <Route path="/user" element={<User />} />
            <Route path="/edituser/:id" element={<Edituser />} />

            <Route path="Addsupplier" element={<Addsupplier />} />
            <Route path="supplier" element={<Supplier />} />
            <Route path="supplier/:supid" element={<Supplier />} />
            <Route path="/editsupplier/:supid" element={<SupplierEdit />} />
            <Route path="supplierphone/:supid" element={<SupplierPhone />} />
            <Route path="supplieremail/:supid" element={<SupplierEmail />} />

            <Route path="/product" element={<Add_Product />} />
            <Route path="/showproduct" element={<Edittable />} />
            <Route path="/editproduct/:id" element={<EditProduct />} />
            <Route path="/report" element={<Report />} />
            <Route path="/reporta" element={<Reportproduct />} />
          </>
        ) : null}
        {/* Seller routes */}
        {userRole === 'Seller' && (
          <>
            <Route path="/vproduct" element={<Viewproduct />} />
            <Route path="/showproduct" element={<Edittable />} />
            <Route path="/Addcustomer" element={<AddCustomer />} />
            <Route path="/showcustomer" element={<Customer />} />
            <Route path="/editcustomer/:id" element={<Editcustomer />} />
            <Route path="/custphone/:custid" element={<Customerphone />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/print_invoice" element={<Print_invoice />} />
            <Route path="/report_invoice" element={<Reportinvoice/>} />
          </>
        )}

        {/* Stock routes */}
        {userRole === 'Stock' && (
          <>
            <Route path="/product" element={<Add_Product />} />
            <Route path="/showproduct" element={<Edittable />} />
            <Route path="/editproduct/:id" element={<EditProduct />} />
            <Route path="/purchaseorder" element={<Purchase_order />} />
            <Route path="/purchaseprint" element={<Purchase_print />} />
            <Route path="/purchaseorder_print" element={<Purchase_order />} />
            <Route path="Addsupplier" element={<Addsupplier />} />
            <Route path="supplier" element={<Supplier />} />
            <Route path="supplier/:supid" element={<Supplier />} />
            <Route path="/editsupplier/:supid" element={<SupplierEdit />} />
            <Route path="supplierphone/:supid" element={<SupplierPhone />} />
            <Route path="supplieremail/:supid" element={<SupplierEmail />} />
            <Route path="/report_product" element={<Reportproduct />} />
            <Route path="/report_purchase" element={<Reportpurchase/>} />
          </>
        )}
        <Route path="*" element={<Error/>} />
      </Routes>
    </>
  );
}

export default App;




