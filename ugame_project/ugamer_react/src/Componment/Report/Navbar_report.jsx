import React, { useEffect, useState } from 'react'
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveTwoTone';
import IndeterminateCheckBoxTwoToneIcon from '@mui/icons-material/IndeterminateCheckBoxTwoTone';
import SupervisorAccountTwoToneIcon from '@mui/icons-material/SupervisorAccountTwoTone';
import CurrencyExchangeTwoToneIcon from '@mui/icons-material/CurrencyExchangeTwoTone';




const Navbar_report = ({ handleClick, handleClick1, handleproduct }) => {
    const [invociedata, setInvociedata] = useState([""]);
    const [invoicedetaildata, setInvoicedetaildata] = useState([""]);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [invoiceCount, setInvoiceCount] = useState(0);
    const [purchaseCount, setpurchaseCount] = useState(0);
    const [supplierCount, setsupplierCount] = useState(0);
    const [productCount, setproductCount] = useState(0);

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost/ugame_project/ugamerphp/Report/Report.php')
            .then((response) => response.json())
            .then((data) => {
                if (data && data.invociedata) {
                    setInvoiceCount(data.invociedata.length);
                    setMsg(data.invociedata);
                    setMsg(data.invoicedetaildata);
                } else {
                    // Handle the case where there's no invociedata
                    // setError(data.invoicedetaildata && data.invociedata);
                }
            })
            .catch((err) => {
                setError('An error occurred while fetching data');
                console.log(err);
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            });
    }, []);

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost/ugame_project/ugamerphp/Report/Report.php')
            .then((response) => response.json())
            .then((data) => {
                if (data && data.purchaseData) {
                    setpurchaseCount(data.purchaseData.length);
                    setMsg(data.purchaseData);
                    setLoading(false);
                } else {
                    // Handle the case where there's no purchaseData
                    // setError(data.invoicedetaildata && data.invociedata);
                }
            })
            .catch((err) => {
                setError('An error occurred while fetching data');
                console.log(err);
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            });
    }, []);

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost/ugame_project/ugamerphp/Report/Report.php')
            .then((response) => response.json())
            .then((data) => {
                if (data && data.productData) {
                    setproductCount(data.productData.length);
                    setMsg(data.productData);
                } else {
                    // Handle the case where there's no productData
                    // setError(data.invoicedetaildata && data.invociedata);
                }
            })
            .catch((err) => {
                setError('An error occurred while fetching data');
                console.log(err);
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            });
    }, []);






    // useEffect(() => {
    //     setLoading(true);
    //     fetch('http://localhost/ugame_project/ugamerphp/Report/Report.php')
    //         .then((response) => response.json())
    //         .then((data) => {
    //             if (data && data.supplierData) {
    //                 setsupplierCount(data.supplierData.length);
    //             } else {

    //             }
    //         })
    //         .catch((err) => {
    //             setError('An error occurred while fetching data');
    //             setLoading(false);
    //             console.log(err);
    //         });
    // }, []);
    return (
        <div className='text-white grid grid-cols-7  mx-4 px-4 gap-2 print:hidden'>
            <h1 className='dark:text-white text-black text-[18px]'>Dash borad<span className='text-[12px] font-light'> Report</span></h1>

            <button onClick={handleClick}
                className='flex items-center justify-between gap-4 p-4 border rounded bg-[rgb(0,0,255)] w-[180px] h-[50px] border-none hover:opacity-70'>
                <span className='text-[72px] font-bold flex items-center justify-center'><ShoppingCartTwoToneIcon /></span>
                <span className='font-bold text-[22px]'>Invoice<p className='font-light text-[16px] text-right'>{invoiceCount}</p></span>
            </button>



            <button onClick={handleClick1}
                className='flex items-center justify-between gap-4 p-4 border rounded bg-[rgb(160,54,173)] w-[180px] h-[50px] border-none hover:opacity-70'>
                <span className='text-[72px] font-bold flex items-center justify-center'><CurrencyExchangeTwoToneIcon />
                </span><span className=' font-bold text-[18px]'>PURCHASE<p className='font-light text-[16px] text-right'>{purchaseCount}</p></span>
            </button>

            <button onClick={handleproduct} className='flex items-center justify-between gap-4 p-4 border rounded bg-[rgb(255,0,0)] w-[180px] h-[50px] border-none hover:opacity-70'>
                <span className='text-[72px] font-bold flex items-center justify-center'><SupervisorAccountTwoToneIcon />
                </span><span className=' font-bold text-[22px]'>Products<p className='font-light text-[16px] text-right'>{productCount}</p></span>
            </button>
            {/* <button className='flex items-center justify-between gap-4 p-4 border rounded bg-[rgb(255,69,0)] w-[180px] h-[70px] border-none hover:opacity-70'>
                <span className='text-[72px] font-bold flex items-center justify-center'><InventoryTwoToneIcon />
                </span><span className=' font-bold text-[22px]'>Product<p className='font-light text-[16px] text-right'>50</p></span>
            </button> */}
            {/* <button className='flex items-center justify-between gap-4 p-4 border rounded bg-[rgb(255,20,147)] w-[180px] h-[70px] border-none hover:opacity-70'>
                <span className='text-[72px] font-bold flex items-center justify-center'><IndeterminateCheckBoxTwoToneIcon />
                </span><span className=' font-bold text-[22px]'>Invoice<p className='font-light text-[16px] text-right'>50</p></span>
            </button> */}
            {/* <button className='flex items-center justify-between gap-4 p-4 border rounded bg-[rgb(0,255,127)] w-[180px] h-[70px] border-none hover:opacity-70'>
                <span className='text-[72px] font-bold flex items-center justify-center'><ArchiveTwoToneIcon />
                </span><span className=' font-bold text-[22px]'>Supplier<p className='font-light text-[16px] text-right'>{supplierCount}</p></span>
            </button> */}

        </div>
    )
}

export default Navbar_report