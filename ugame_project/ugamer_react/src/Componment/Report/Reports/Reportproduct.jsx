import React, { useEffect, useState } from 'react'
import ScatterPlotTwoToneIcon from '@mui/icons-material/ScatterPlotTwoTone';
import stocks from"../../../Aseset/in-stock.png"
import outStocks from"../../../Aseset/out-of-stock.png"
const Reportproduct = () => {

    const [invociedata, setInvociedata] = useState([""]);
    const [productdata, setproductdata] = useState([""]);
    const [productpricedata, setproductpricedata] = useState([""]);
    const [TodayProductdata, setTodayProductdata] = useState([]);
    const [Stockdata, setStockProductdata] = useState([]);


    const [TodayProductpricedata, setTodayProductpricedata] = useState([""]);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
    // const[filterdate ,setfilterdate]= useState("")
    const [selectedDate, setSelectedDate] = useState('');
    const [filteredData, setFilteredData] = useState(invociedata);
    const [StockProductdataCount, setStockProductdataCount] = useState(0);
    const [ProductdataCount, setProductdataCount] = useState(0);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedMonthYear, setSelectedMonthYear] = useState('');
    // useEffect(() => {
    //     setLoading(true);
    //     fetch('http://localhost/ugame_project/ugamerphp/Report/Report.php')
    //         .then((response) => response.json())
    //         .then((data) => {
    //             if (data && data.productData) {
    //                 setproductdata(data.productData);
    //                 setLoading(false);
    //             } else {
    //                 setError('No data available for Product');
    //             }
    //             setLoading(false);
    //         })
    //         .catch((err) => {
    //             setError('An error occurred while fetching data');
    //             setLoading(false);
    //             console.error('Fetch error:', err);
    //         });
    // }, []);

    // useEffect(() => {
    //     setLoading(true);
    //     fetch('http://localhost/ugame_project/ugamerphp/Report/Report.php')
    //         .then((response) => response.json())
    //         .then((data) => {
    //             if (data && data.productcheckData) {
    //                 setTodayProductdata(data.productcheckData);
    //                 setLoading(false);
    //             } else {
    //                 setError('No data available for Product');
    //             }
    //             setLoading(false);
    //         })
    //         .catch((err) => {
    //             setError('An error occurred while fetching data');
    //             setLoading(false);
    //             console.error('Fetch error:', err);
    //         });
    // }, []);

    // useEffect(() => {
    //     setLoading(true);
    //     fetch('http://localhost/ugame_project/ugamerphp/Report/Report.php')
    //         .then((response) => response.json())
    //         .then((data) => {
    //             console.log('API Response Data:', data);
    //             if (data && data.productpriceData) {
    //                 setproductpricedata(data.productpriceData);
    //                 setLoading(false);
    //             } else {


    //                 // setError('No data available for Product');
    //                 setMsg(data.Result);
    //             }
    //             setLoading(false);
    //         })
    //         .catch((err) => {
    //             setError('An error occurred while fetching data');
    //             setLoading(false);
    //             console.error('Fetch error:', err);
    //         });
    // }, []);
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            fetch('http://localhost/ugame_project/ugamerphp/Report/Report.php')
                .then((response) => response.json())
                .then((data) => {
                    if (data) {
                        if (data.productData) {
                            setproductdata(data.productData);
                            setProductdataCount(data.productData.length)
                        }
                        if (data.productcheckData) {
                            setTodayProductdata(data.productcheckData);
                        }
                        if (data.productpriceData) {
                            setproductpricedata(data.productpriceData);
                        }
                        if (data.productStockData) {
                            setStockProductdata(data.productStockData);
                        }

                        if (data.StockoutData.length) {
                            setStockProductdataCount(data.StockoutData.length);
                        }
                        setLoading(false);
                    } else {
                        setError('No data available for Product');
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    setError('An error occurred while fetching data');
                    setLoading(false);
                    console.error('Fetch error:', err);
                });
        }, 1000); // 600 milliseconds timeout
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
    //             window.location.reload()
    //         }
    //     } else {

    //         setFilteredData(invociedata);
    //     }
    // }
    // const handleFilter = () => {
    //     if (startDate && endDate) {
    //         const filterData = productdata.filter((item) => {
    //             return item.prodDate >= startDate && item.prodDate <= endDate;
    //         });

    //         const filterDataprice = productpricedata.filter((item) => {
    //             return item.proddate >= startDate && item.proddate <= endDate;
    //         });

    //         if (filterData.length > 0 || filterDataprice > 0) {
    //             setproductdata(filterData);
    //             setproductpricedata(filterDataprice);
    //         } else {
    //             setproductdata([]);
    //             setproductpricedata([]);
    //             alert("No data for the selected date range");
    //         }
    //     } else {
    //         alert("Please select a date range for filtering");
    //     }
    // };
    const handleFilter = () => {
        if (selectedMonthYear) {
            // Send a request to your PHP backend with the selected filter criteria
            fetch(`http://localhost/ugame_project/ugamerphp/Report/Checkdateproduct.php?prodDate=${selectedMonthYear}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data && data.filteredData) {
                        setproductdata(data.filteredData); // Update purchaseData with the filtered data
                        setproductpricedata(data.filteredData); // Update purchaseData with the filtered data
                    } else {
                        setproductdata([]); // Handle no data found by setting an empty array
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


    return (
        <>
            <div className='flex gap-6 justify-center items-center mx-4 print:hidden'>
                <div className='flex gap-2'>
                    <ScatterPlotTwoToneIcon />
                    <h1 className='font-bold'>List Report</h1>
                </div>

                <div className='flex gap-2 items-center'>
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
                        className="border px-2 py-2 dark:bg-slate-400"
                    /> */}
                    <label htmlFor="monthYear">Select Month and Year: </label>
                <input  className="border px-2 py-2 dark:bg-slate-400"
                    type="month"
                    id="monthYear"
                    value={selectedMonthYear}
                    onChange={(e) => setSelectedMonthYear(e.target.value)}
                />
                    <button className='border bg-[#9e297b] text-white w-[70px] h-[50px] rounded' onClick={() => handleRefresh()}>Refresh</button>
                </div>
                <div className='flex items-center gap-2 '>
                    <button
                        onClick={() => handleFilter()}
                        className='border bg-[#ff8e43] text-white w-[60px] h-[50px] rounded'>Search
                    </button>
                    <button onClick={handleprint} className='border bg-[#299e29] text-white w-full h-[50px] rounded'>Print</button>
                </div>
            </div>
            <div className='flex justify-between items-center gap-2'>
                <div className='max-h-[60vh] w-[1200px] border overflow-y-auto shadow-md mb-2'>
                    <table className='w-[100%] bg-gray-100 dark:bg-[#06080F]'>
                        <thead className='grid grid-cols-6 text-white py-3 bg-[#2980b9] dark:bg-[#3f4042]'>
                            <tr>

                                <th className='p-2'>No</th>
                            </tr>
                            <tr>
                                <th className='p-2'>Item ID</th>
                            </tr>
                            <tr>
                                <th className='p-2'>Type</th>
                            </tr>
                            <tr>
                                <th className='p-2'>Date</th>
                            </tr>
                            <tr>
                                <th className='p-2'>Cost</th>
                            </tr>
                            <tr>
                                <th className='p-2'>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <h1 className='p-2 text-orange-600 font-bold'>Today</h1>
                            {error ? (
                                <tr>
                                    <td className='text-red-500'>Something went wrong!</td>
                                </tr>
                            ) : isLoading ? (
                                <tr>
                                    <td className='text-green-500'>Loading....</td>
                                </tr>
                            ) : typeof TodayProductdata === 'object' && TodayProductdata.Result ? (
                                <tr>
                                    <td>
                                        <p className='text-orange-500'>{TodayProductdata.Result}</p>
                                    </td>
                                </tr>
                            ) : Array.isArray(TodayProductdata) && TodayProductdata.length === 0 ? (
                                <tr>
                                    <td>
                                        <p className='text-orange-500'>No data available</p>
                                    </td>
                                </tr>
                            ) : (
                                TodayProductdata.map((Tprod, i) => (
                                    <tr className='grid grid-cols-6 bg-gray-200 items-center dark:bg-[#06080F]' key={i}>
                                        <td className='p-2'>{Tprod.prodid}</td>
                                        <td className='p-2'>{Tprod.prodName}</td>
                                        <td className='p-2'>{Tprod.prodType}</td>
                                        <td className='p-2'>{Tprod.prodDate}</td>
                                        <td className='p-2'>{Tprod.Cost}</td>
                                        <td className='p-2'>{Tprod.prodprice}</td>
                                       
                                    </tr>
                                ))
                            )}
                        </tbody>

                        <thead className='grid grid-cols-5 text-white py-3 bg-[#2980b9] dark:bg-[#3f4042]'>
                            <tr>
                                <th className='p-2'>No</th>
                            </tr>
                            <tr>
                                <th className='p-2'>Item ID</th>
                            </tr>
                            <tr>
                                <th className='p-2'>Type</th>
                            </tr>
                            <tr>
                                <th className='p-2'>Date</th>
                            </tr>
                            <tr>
                                <th className='p-2'>Qty</th>
                            </tr>
                        </thead>
                        <tbody>
                            <h1 className='p-2 text-red-600 font-bold'>Out Stock</h1>
                            {error ? (
                                <tr>
                                    <td className='text-red-500'>Something went wrong!</td>
                                </tr>
                            ) : isLoading ? (
                                <tr>
                                    <td className='text-green-500'>Loading....</td>
                                </tr>
                            ) : typeof Stockdata === 'object' && Stockdata.Result ? (
                                <tr>
                                    <td>
                                        <p className='text-orange-500'>{Stockdata.Result}</p>
                                    </td>
                                </tr>
                            ) : Array.isArray(Stockdata) && Stockdata.length === 0 ? (
                                <tr>
                                    <td>
                                        <p className='text-orange-500'>No data available</p>
                                    </td>
                                </tr>
                            ) : (
                                Stockdata.map((stock, i) => (
                                    <tr className='grid grid-cols-5 bg-gray-200 items-center dark:bg-[#06080F]' key={i}>
                                        <td className='p-2'>{stock.prodid}</td>
                                        <td className='p-2'>{stock.prodName}</td>
                                        <td className='p-2'>{stock.prodType}</td>
                                        <td className='p-2'>{stock.prodDate}</td>
                                        <td className='p-2'>{stock.Qty}</td>
                                    </tr>
                                ))
                            )}

                        </tbody>

                        <thead className='grid grid-cols-7 text-white py-3 bg-[#2980b9] dark:bg-[#3f4042]'>
                            <tr>
                                <th className='p-2'>Product No</th>
                            </tr>
                            <tr>
                                <th className='p-2'>Name</th>
                            </tr>
                            <tr>
                                <th className='p-2'>Type</th>
                            </tr>
                            <tr>
                                <th className='p-2'>Date</th>
                            </tr>
                            <tr>
                                <th className='p-2'>Quantity</th>
                            </tr>
                            <tr>
                                <th className='p-2'>Cost</th>
                            </tr>
                            <tr>
                                <th className='p-2'>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <h1 className='p-2'>All products</h1>
                            {error ? (
                                <tr>
                                    <td className='text-red-500'>Something went wrong!</td>
                                </tr>
                            ) : isLoading ? (
                                <tr>
                                    <td className='text-green-500'>Loading....</td>
                                </tr>
                            ) : typeof productdata === 'object' && productdata.Result ? (
                                <tr>
                                    <td>
                                        <p className='text-orange-500'>{productdata.Result}</p>
                                    </td>
                                </tr>
                            ) : Array.isArray(productdata) && productdata.length === 0 ? (
                                <tr>
                                    <td>
                                        <p className='text-orange-500'>No data available</p>
                                    </td>
                                </tr>
                            ) : (
                                productdata.map((inv, i) => (
                                    <React.Fragment key={i}>
                                        <tr className='grid grid-cols-7 bg-gray-200 dark:bg-[#06080F]'>
                                            <td className='p-2'>{inv.prodid}</td>
                                            <td className='p-2'>{inv.prodName}</td>
                                            <td className='p-2'>{inv.prodType}</td>
                                            <td className='p-2'>{inv.prodDate}</td>
                                            <td className='p-2'>{inv.Qty}</td>
                                            <td className='p-2'>$ {inv.Cost}</td>
                                            <td className='p-2'>$ {inv.prodprice}</td>
                                        </tr>
                                    </React.Fragment>
                                ))
                            )}

                        </tbody>

                        <thead className='grid grid-cols-5 text-white py-3 bg-[#2980b9] dark:bg-[#3f4042]'>
                            <tr>
                                <th className='p-2'>No</th>
                            </tr>
                            <tr>
                                <th className='p-2'>Date</th>
                            </tr>
                            <tr>
                                <th className='p-2'>Cost</th>
                            </tr>
                            <tr>
                                <th className='p-2'>Price</th>
                            </tr>
                            <tr>
                                <th className='p-2'>Remark</th>
                            </tr>

                        </thead>
                        <tbody>
                            <h1 className='p-2'>All product price</h1>
                            {error ? (
                                <tr>
                                    <td className='text-red-500'>Something went wrong!</td>
                                </tr>
                            ) : isLoading ? (
                                <tr>
                                    <td className='text-green-500'>Loading....</td>
                                </tr>
                            ) : typeof productpricedata === 'object' && productpricedata.Result ? (
                                <tr>
                                    <td>
                                        <p className='text-orange-500'>{productpricedata.Result}</p>
                                    </td>
                                </tr>
                            ) : Array.isArray(productpricedata) && TodayProductdata.length === 0 ? (
                                <tr>
                                    <td>
                                        <p className='text-orange-500'>No data available</p>
                                    </td>
                                </tr>
                            ) : (
                                productpricedata.map((invdetail, j) => (
                                    <tr key={j} className='grid grid-cols-5'>
                                        <td className='p-2'>{invdetail.prodid}</td>
                                        <td className='p-2'>{invdetail.proddate}</td>
                                        <td className='p-2'>$ {invdetail.Cost}</td>
                                        <td className='p-2'>$ {invdetail.prodprice}</td>
                                        <td className=' text-red-600 font-bold p-2'>{invdetail.Remark}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className='text-2xl flex flex-col gap-2 justify-center print:hidden'>
                    <div className='flex items-center gap-4  border  p-4 pl-4 bg-slate-800 shadow rounded-2xl text-white'>
                       <img className='w-[100px] h-[100px] object-contain' src={outStocks} alt="" />
                        <span >Out Stock: </span>
                        <p className='text-red-500'> {StockProductdataCount}</p>
                    </div>
                    <div className='flex items-center gap-4  border p-4 pl-4 bg-slate-800 shadow rounded-2xl text-white  '>
                        <img className='w-[100px] h-[100px] object-contain' src={stocks} alt="" />
                        <span > In Stock: </span>
                        <p className='text-red-500'> {ProductdataCount}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Reportproduct