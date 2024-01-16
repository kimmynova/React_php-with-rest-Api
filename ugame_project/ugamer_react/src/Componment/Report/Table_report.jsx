import React, { useState } from 'react';
import Reportinvoice from './Reports/Reportinvoice';
import Navbar_report from './Navbar_report';
import Reportpurchase from './Reports/Reportpurchase';
import Reportproduct from './Reports/Reportproduct';

const Table_report = () => { 
    const [showReport, setshowReport] = useState(false);
    const [showpurchaseReport, setshowpurchaseReport] = useState(false);
    const [productReport, setproductReport] = useState(false);
    const handleClick = () => {
        setshowReport(!showReport);
        setshowpurchaseReport(false);
       setproductReport(false)
      };
      const handleClick1 = () => {
        setshowpurchaseReport(!showpurchaseReport);
        setshowReport(false)
        setproductReport(false)
    
      };
      const handleproduct = () => {
       setproductReport(!productReport);
        setshowpurchaseReport(false);
        setshowReport(false);
      };
    return (
      
            <div className='flex flex-col justify-center mx-2 items-center gap-1'>
                <Navbar_report handleClick={handleClick} handleClick1={handleClick1}  handleproduct={handleproduct}/>
                {showReport ? 
                <Reportinvoice /> : null}
                {showpurchaseReport? <Reportpurchase/>:null}
                {productReport ?<Reportproduct/>:null}
              
            </div>
    );
}

export default Table_report;
