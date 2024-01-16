import React, { useEffect, useState } from 'react';
import ScatterPlotTwoToneIcon from '@mui/icons-material/ScatterPlotTwoTone';
const Reportinvoice = () => {
    const [invociedata, setInvociedata] = useState([]);
    const [invoicedetaildata, setInvoicedetaildata] = useState([]);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
    // const[filterdate ,setfilterdate]= useState("")
    // const [selectedDate, setSelectedDate] = useState('');
    // const [filteredData, setFilteredData] = useState([]);
    const [invoiceCount, setInvoiceCount] = useState(0);
    const [grandtotal, setGrandtotal] = useState(0)
    const [Quantity, setQuantity] = useState(0)

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const[selectedMonthYear,setSelectedMonthYear]=useState('')

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost/ugame_project/ugamerphp/Report/Report.php')
            .then((response) => response.json())
            .then((data) => {
                if (data && data.invociedata && data.invoicedetailData) {
                    setInvociedata(data.invociedata);
                    setInvoicedetaildata(data.invoicedetailData);
                    console.log(invociedata)

                } else {

                }
                setTimeout(() => {
                    if (data && data.invociedata && data.invoicedetailData) {
                        console.log(data);
                        setMsg(data.invocieData);
                        setMsg(data.invoicedetailData);

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

    // const handledateChange = (e) => {
    //     const selectedDate = e.target.value;
    //     setFilteredData(selectedDate);

    //     if (selectedDate) {
    //         const filterData = invociedata.filter((item) => item.invdate === selectedDate);

    //         if (filterData.length > 0) {
    //             setInvociedata(filterData);
    //         } else {
    //             setInvociedata([]); // No data for the selected date
    //             alert("No Data");
    //         }
    //     } else {

    //         setFilteredData(invociedata);
    //     }
    // }

    // const handleFilter = () => {
    //     if (startDate && endDate) {
    //         const filterData = invociedata.filter((item) => {
    //             return item.invdate >= startDate && item.invdate <= endDate;
    //         });
    //         console.log(filterData)

    //         if (filterData.length > 0) {
    //             setInvociedata(filterData);
    //         } else {
    //             setInvociedata([]);
    //             alert("No data for the selected date range");
    //         }
    //     } else {
    //         alert("Please select a date range for filtering");
    //     }
    // };
    const handleFilter = () => {
        if (selectedMonthYear) {
            // Send a request to your PHP backend with the selected filter criteria
            fetch(`http://localhost/ugame_project/ugamerphp/Report/Checkdateinvoice.php?invdate=${selectedMonthYear}`)
                .then((response) => response.json())
                .then((data) => {
                        if (data && data.filterinoviceData) {
                            setInvociedata(data.filterinoviceData); // Update purchaseData with the filtered data
                        } else {
                            setInvociedata([]); // Handle no data found by setting an empty array
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
        const calculatedGrandTotal = invociedata.reduce(
            (accumulator, item) => accumulator + parseFloat(item.grandtotal),
            0
        );
        setGrandtotal(calculatedGrandTotal)

        const calculatedQty = invoicedetaildata.reduce(
            (accumulator, item) => accumulator + parseFloat(item.qty),
            0
        );

        // Update the grandtotal state variable with the calculated sum
        setQuantity(calculatedQty);
    }, [invociedata], [invoicedetaildata]);


    return (
        <>
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

                    {/* <label htmlFor="">CheckDate: </label>
                   
                    <input type="date" onChange={handledateChange} value={selectedDate} className='border px-2 py-2 dark:bg-slate-400' />
                    <span>To</span>
                    <input type="date" className='border px-2 py-2 dark:bg-slate-400' /> */}

                    {/* <label htmlFor="startDate">From:</label>
                    <input
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
                        className="border px-2 py-2 dark-bg-slate-400"
                    /> */}
                </div>
                <div className='flex items-center gap-2'>
                <button
                     onClick={() => handleFilter()}
                       className='border bg-[#ff8e43] text-white w-[60px] h-[50px] rounded'>search
                    </button>
                    <button className='border bg-[#9e297b] text-white w-[60px] h-[50px] rounded' onClick={() => handleRefresh()}>Refresh</button>
                    <button onClick={handleprint} className='border bg-[#299e29] text-white w-[60px] h-[50px] rounded'>Print</button>
                </div>

            </div>
            <div className=' max-h-[65vh] w-[60%]  border overflow-y-auto m-auto  shadow-md mb-2'>

                <table className='w-[100%]  bg-gray-100 dark:bg-[#06080F] '>
                    <thead className='grid grid-cols-6 text-white py-3 bg-[#2980b9] dark:bg-[#3f4042]'>
                        <tr>
                            <th className='p-2'>Invoice No</th>
                        </tr>
                        <tr>
                            <th className='p-2'>Invoice Date</th>
                        </tr>
                        <tr>
                            <th className='p-2'>Employee Name</th>
                        </tr>
                        <tr>
                            <th className='p-2'>Customer Name</th>

                        </tr>
                        <tr>
                            <th className='p-2'>Grand Total</th>

                        </tr>
                        <tr>
                            <th className='p-2'>Remark</th>

                        </tr>
                    </thead>
                    <tbody>
                        {error ? (
                            <tr>
                                <td className='text-red-500'>Something went wrong!</td>
                            </tr>
                        ) : isLoading ? (
                            <tr>
                                <td className=' text-green-500'>Loading....</td>
                            </tr>
                        ) : typeof invociedata === 'object' && invociedata.Result ? (
                            <tr>
                                <td>
                                    <p className='text-orange-500'>{invociedata.Result}</p>
                                </td>
                            </tr>
                        ) : Array.isArray(invociedata) && invociedata.length === 0 ? (
                            <tr>
                                <td>
                                    <p className='text-orange-500'>No data available</p>
                                </td>
                            </tr>
                        ) : (
                            invociedata.map((inv, i) => (
                                <React.Fragment key={i}>
                                    <tr className='grid grid-cols-6 bg-gray-200 dark:bg-slate-400 font-bold'>
                                        <td className='p-2'>{inv.invno}</td>
                                        <td className='p-2'>{inv.invdate}</td>
                                        <td className='p-2'>{inv.empName}</td>
                                        <td className='p-2'>{inv.custName}</td>
                                        <td className='p-2'>$ {inv.grandtotal}</td>
                                        <td className='p-2 text-red-600 font-bold text-xl'>{inv.Remark}</td>
                                    </tr>
                                    <tr className='grid grid-cols-5 bg-[#7fc7df] dark:bg-[#3f4042] text-white'>
                                        <th className='p-2'>No</th>
                                        <th className='p-2'>Item ID</th>
                                        <th className='p-2'>Quantity</th>
                                        <th className='p-2'>Unit Price</th>
                                        <th className='p-2'>Total</th>
                                    </tr>
                                    {invoicedetaildata
                                        .filter((invdetail) => invdetail.Invno === inv.invno)
                                        .map((invdetail, j) => (
                                            <tr key={j} className='grid grid-cols-5 p-2'>
                                                <td className='p-2'>{invdetail.No}</td>
                                                <td className='p-2'>{invdetail.itemid}</td>
                                                <td className='p-2'>{invdetail.qty}</td>
                                                <td className='p-2'>${invdetail.Unitprice}</td>
                                                <td className='p-2'>$ {invdetail.total}</td>
                                            </tr>
                                        ))}
                                </React.Fragment>
                            )))}
                    </tbody>
                </table>
                <footer className='flex gap-2 items-end  justify-end flex-col bg-[#7fc7df] text-white'>
                    <div className='mr-3 flex gap-2'>
                        <span value={Quantity}>Qty Total: {Quantity}</span>
                        <span value={grandtotal}>Grand Total: $ {grandtotal}</span>
                    </div>
                </footer>
            </div>

        </>
    );
}

export default Reportinvoice