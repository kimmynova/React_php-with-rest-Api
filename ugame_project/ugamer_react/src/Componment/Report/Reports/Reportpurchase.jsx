import React, { useEffect, useState } from 'react'
import ScatterPlotTwoToneIcon from '@mui/icons-material/ScatterPlotTwoTone';
const Reportpurchase = () => {
    const [purchaseData, setpurchasedData] = useState([""]);
    const [purchaseOrderDetailData, setpurchasedetailData] = useState([""]);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
    // const[filterdate ,setfilterdate]= useState("")
    const [selectedDate, setSelectedDate] = useState('');
    const [filteredData, setFilteredData] = useState(purchaseData);
    const [invoiceCount, setInvoiceCount] = useState(0);
    const [grandtotal, setGrandtotal] = useState(0)
    const [Quantity, setQuantity] = useState(0)

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedMonthYear, setSelectedMonthYear] = useState('');
    // const [filteredData, setFilteredData] = useState([]);
    useEffect(() => {
        setLoading(true);
        fetch('http://localhost/ugame_project/ugamerphp/Report/Report.php')
            .then((response) => response.json())
            .then((data) => {
                if (data && data.purchaseData && data.purchaseOrderDetailData) {
                    // Assuming data is the JSON response from your API
                    setpurchasedData(data.purchaseData);
                    setpurchasedetailData(data.purchaseOrderDetailData);

                } else {
                }
                setTimeout(() => {
                    if (data && data.purchaseData && data.purchaseOrderDetailData) {
                        setMsg(data.purchaseData);
                        setMsg(data.purchaseOrderDetailData);

                    } else {
                        // setError(data.invoicedetaildata && data.invociedata);
                    }
                    setLoading(false);
                }, 1000);
            })
            .catch((err) => {
                setError('An error occurred while fetching data');
                setLoading(false);
                console.log(err);
            });
    }, []);
    const handleprint = () => {
        window.print();
    }

    
    const handleFilter = () => {
        if (selectedMonthYear) {
            // Send a request to your PHP backend with the selected filter criteria
            fetch(`http://localhost/ugame_project/ugamerphp/Report/Checkdatepurchase.php?filter=${selectedMonthYear}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data && data.filteredData) {
                        setpurchasedData(data.filteredData); // Update purchaseData with the filtered data
                    } else {
                        setpurchasedData([]); // Handle no data found by setting an empty array
                        alert(data.No)
                        window.location.reload()
                    }
                })
                .catch((error) => {
                    console.error('An error occurred while fetching data:', error);
                });
        } else {
            alert('Please select a month and year for filtering');
        }
    };

    
    const handleRefresh = () => {
        setTimeout(() => {
            setMsg(!msg)
            window.location.reload()
        }, 500);
    }

    useEffect(() => {
        // Calculate the sum of "Grand Total" values from the invociedata array
        const calculatedGrandTotal = purchaseData.reduce(
            (accumulator, item) => accumulator + parseFloat(item.grandtotal),
            0
        );
        setGrandtotal(calculatedGrandTotal)

        const calculatedQty = purchaseOrderDetailData.reduce(
            (accumulator, item) => accumulator + parseFloat(item.qty),
            0
        );

        // Update the grandtotal state variable with the calculated sum
        setQuantity(calculatedQty);
    }, [purchaseData], [purchaseOrderDetailData]);
    return (
        <>
            {!msg && "Loading..."}
            <div className='flex gap-6 items-center justify-center mx-4  print:hidden'>

                <div className='flex gap-2'>
                    <ScatterPlotTwoToneIcon />
                    <h1 className='font-bold'>List Report</h1>
                </div>

             
                <div className='flex gap-2 items-center '>
                    <label htmlFor="monthYear">Select Month and Year: </label>
                <input  className="border px-2 py-2 dark:bg-slate-400"
                    type="month"
                    id="monthYear"
                    value={selectedMonthYear}
                    onChange={(e) => setSelectedMonthYear(e.target.value)}
                />
                {/* <button onClick={handleFilter}>Filter</button> */}
                   
                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => handleFilter()}
                            className='border bg-[#ff8e43] text-white w-[60px] h-[50px] rounded'>search
                        </button>
                        <button className='border bg-[#9e297b] text-white w-[70px] h-[50px] rounded' onClick={() => handleRefresh()}>Refresh</button>
                        <button onClick={handleprint} className='border bg-[#299e29] text-white w-[70%] h-[50px] rounded'>Print</button>
                    </div>
                </div>
                

            </div>
            <div className=' max-h-[65vh] w-[60%] m-auto border overflow-y-auto shadow-md mb-2'>

                <table className='w-[100%]  bg-gray-100 dark:bg-[#06080F] '>
                    <thead className='grid grid-cols-6 text-white py-3 bg-[#2980b9] dark:bg-[#3f4042]'>
                        <tr>
                            <th className='p-2'>Purchase No</th>
                        </tr>
                        <tr>
                            <th className='p-2'>Purchase Date</th>
                        </tr>
                        <tr>
                            <th className='p-2'>Supplier id</th>
                        </tr>
                        {/* <tr>
                          <th className='p-2'>Customer Name</th>

                      </tr> */}
                        <tr>
                            <th className='p-2'>Grand Total</th>

                        </tr>
                        <tr>
                            <th className='p-2'>Remark</th>

                        </tr>
                    </thead>
                    <tbody>
                        {purchaseData.map((purchaseData, i) => (
                            <React.Fragment key={i}>
                                <tr className='grid grid-cols-6 bg-gray-200 dark:bg-slate-400'>
                                    <td className='p-2'>{purchaseData.pono}</td>
                                    <td className='p-2'>{purchaseData.purdate}</td>
                                    <td className='p-2'>{purchaseData.supid}</td>
                                    <td className='p-2'>$ {purchaseData.grandtotal}</td>
                                    <td className='p-2 font-bold text-xl text-red-600'>{purchaseData.Remark}</td>
                                </tr>
                                <tr className='grid grid-cols-5 bg-[#7fc7df] dark:bg-[#3f4042] text-white'>
                                    <th className='p-2'>No</th>
                                    <th className='p-2'>Item ID</th>
                                    <th className='p-2'>Quantity</th>
                                    <th className='p-2'>Unit Price</th>
                                    <th className='p-2'>Total</th>
                                </tr>
                                {purchaseOrderDetailData
                                    .filter((purchaseDetail) => purchaseDetail.pono === purchaseData.pono)
                                    .map((purchaseDetail, j) => (
                                        <tr key={j} className='grid grid-cols-5 p-2'>
                                            <td className='p-2'>{purchaseDetail.No}</td>

                                            <td className='p-2'>{purchaseDetail.itemid}</td>
                                            <td className='p-2'>{purchaseDetail.qty}</td>
                                            <td className='p-2'>${purchaseDetail.Unitprice}</td>
                                            <td className='p-2'>$ {purchaseDetail.total}</td>
                                        </tr>
                                    ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                <footer className='flex gap-2 items-end  justify-end flex-col bg-[#7fc7df] text-white'>
                    <div className='mr-3 flex gap-2'>
                        <span>Qty Total: {Quantity}</span>
                        <span>Grand Total: $ {grandtotal}</span>
                    </div>
                </footer>
            </div>

        </>
    )
}

export default Reportpurchase


// const handledateChange = (e) => {
    //     const selectedDate = e.target.value;
    //     setSelectedDate(selectedDate); // Update selectedDate state

    //     if (selectedDate) {
    //         const filterData = purchaseData.filter((item) => item.purdate === selectedDate);

    //         if (filterData.length > 0) {
    //             setFilteredData(filterData);
    //         } else {
    //             setFilteredData([]); // No data for the selected date
    //             alert("No Data");
    //             // You may choose to handle this case differently
    //         }
    //     } else {
    //         setFilteredData(purchaseData);
    //     }
    // };
    // const handleFilter = () => {
    //     if (startDate && endDate) {
    //         const filterData = purchaseData.filter((item) => {
    //             return item.purdate >= startDate && item.purdate <= endDate;
    //         });
    //         console.log(filterData)

    //         if (filterData.length > 0) {
    //             setpurchasedData(filterData);
    //         } else {
    //             setpurchasedData([]);
    //             alert("No data for the selected date range");
    //         }
    //     } else {
    //         alert("Please select a date range for filtering");
    //     }
    // };
 {/* <input
                        type="date"
                        id="startDate"
                        onChange={(e) => setStartDate(e.target.value)}
                        value={startDate}
                        className="border px-2 py-2 dark:bg-slate-400"
                    />
                    <label htmlFor="endDate">To:</label>
                    <input
                        type="date"
                        id="endDate"
                        onChange={(e) => setEndDate(e.target.value)}
                        value={endDate}
                        className="border px-2 py-2 dark:bg-slate-400"
                    /> */}
                    {/* <label htmlFor="">CheckDate1: </label> */}

                    {/* <input type="date" onChange={handledateChange} className='border px-2 py-2  dark:bg-slate-400' /> */}
                    {/* <input type="date" onChange={handledateChange} value={selectedDate} className='border px-2 py-2 dark:bg-slate-400' /> */}


                       {/* <div className='flex gap-2 items-center'>
                  <label htmlFor="">Due date: </label>
                  <input type="date" className='border px-2 py-2  dark:bg-slate-400' readOnly />
              </div>
              <span>to</span> */}