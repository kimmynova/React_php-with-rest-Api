import React, { useContext, useState } from 'react'
import logo from '../../Aseset/logo.jpg'
import { useLocation, useNavigate } from 'react-router';
import { AlertContext } from '../../alertmesengebox/alert';
const Purchase_print = (
    { Employee, pono, productitems, setShowInvoice, supplier, Date, subtotal, Grandtotal, Remark

    }) => {
    const [msg, setmsg] = useState("")
    const [error, setError] = useState("")
    const AlertBox = useContext(AlertContext);
    const printhandle = () => {
        window.print()
    }




    const savehandle = async () => {
        try {
            // Prepare the data to send
            const dataToSend = {
                Employee,
                pono,
                "PurchaseData": {
                    "purdate": Date,
                    "empName": Employee,
                    "supid": supplier,
                    "grandtotal": Grandtotal,
                    "Remark": Remark,
                    "items": productitems // Make sure 'productitems' is an array of item objects
                }
            };
            console.log(dataToSend)

            // Make an HTTP POST request to your PHP script
            const response = await fetch('http://localhost/ugame_project/ugamerphp/Purchase/Purchase.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.success) {
                    setmsg("Your Data is successful!");
                    window.print()
                    AlertBox.save();
                    setTimeout(() => {
                        window.location.reload()
                    }, 3000);

                } else {
                    setError("Error: Make Sure Data is Correct");
                }
            } else {
                setError("Error: Failed to save data.");
                AlertBox.error();
            }
        } catch (error) {
            AlertBox.error();
            console.error('Error:', error);

            setError('An error occurred while saving data.');
            AlertBox.organize();
        }
    };

    return (
        <>
            <div className='absolute inset-0 z-[999] flex items-center justify-center'>
                <div
                    className='w-screen h-screen bg-white dark:bg-[#06080F] opacity-1'>
                    <ul className=' flex print:hidden gap-3 text-white hide-on-print'>
                        {/* <li><button className='border bg-[#2980b9] px-5 mt-5' onClick={printhandle}>Print</button></li> */}
                        {/* <li><button className='border bg-[#2980b9] px-5 mt-5'> Download</button></li> */}
                        <li><button onClick={savehandle} className='border bg-[#299e29] px-5 mt-5'> save</button></li>
                        <li> <button className='border bg-[#ff9c3f] px-5 mt-5' onClick={() => setShowInvoice(false)}>Edit</button></li>
                    </ul>
                </div>


                <div className='border bg-white text-black w-[600px] h-full absolute top-5 right-0 left-0 bottom-9 m-auto shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]'>
                    {/* Header section */}

                    <header className='flex justify-center items-center flex-col'>
                        <img className='w-[80px] h-[80px] ' src={logo} alt="" />
                        <span className='text-2xl'>U Gamer Computer</span>
                        <span>The Olympia Mall (1st Floor), Phnom Penh, Cambodia</span>
                    </header>
                    <div className='text-left px-4 pt-2'>
                        <h6>Tel: <span>095 709 709</span></h6>
                        <h6>Email: <span>info@u-gamer.com</span></h6>
                    </div>
                    {/* Detail-section */}
                    <section className='flex justify-between  w-full  py-2 px-4'>
                        <div className='flex flex-col '>
                            <h2>Purchase No: {pono}</h2>
                            <h2>Purchase Date: {Date}</h2>
                        </div>
                        <div className='flex flex-col'>
                            <h2>Employee Name: {Employee}</h2>
                            <h2>Suppplier ID: {supplier}</h2>
                        </div>
                    </section>

                    <div className=' flex items-center flex-col mb-4'>
                        <h1 className=' text-blue-500 font-bold text-3xl text-center'>Purchase Order</h1>
                        <table>
                            <thead>
                                <tr className='grid grid-cols-5 px-4 gap-10 bg-[#2980b9] border text-white w-full'>
                                    <th>No</th>
                                    <th>Itemid</th>
                                    <th>unitprice</th>
                                    <th>Quantity</th>
                                    <th>Total Price</th>
                                </tr>
                            </thead>

                            <tbody className='border-y ' >
                                {productitems.map((items, i) => (
                                    <tr className='w-full grid grid-cols-5 px-4 mb-2 gap-4 ml-7 pt-2' key={i}>
                                        <td>{items.No}</td>
                                        <td>{items.itemid}</td>
                                        <td>${items.unitprice}</td>
                                        <td>{items.quantity}</td>
                                        <td>${items.total}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* sub and grandTotal section */}
                    <section className='text-end px-4'>
                        <h2>Sub Total: $ {subtotal} </h2>
                        <h2>Grand Total: $ {Grandtotal}</h2>
                        <h2>Description: {Remark}</h2>
                    </section>
                    {/* <footer className='flex items-center justify-center flex-col'>
                    <p className='w-[90%] h-[30%] px-4 my-5 '>- ចំពោះ Laptop / Desktop និងទំនិញផ្សេងៗ ខាងហាងយើងខ្ញុំមិនទទួលខុសត្រូវ ចំពោះផលិតផលដែលបានខូចខាតដោយការ ឆេះ ចូលទឹក បាត់បង់ Seal / QR Code ធានារបស់ក្រុមហ៊ុនខូចខាតបាក់បែកទ្រង់ទ្រាយដើមនៃទំនិញនឹងមិន
                        ធានាលើផ្នែកមួយចំនួនទៀតដែលកើតមកពីការមិនប្រុងប្រយត្ន័របស់អតិថិជន och Powersupply/Adapter/Battery/Speaker/Dead Pixel/Screen line</p>
                    <h2>Copy Right &copy;2023-2024 <span className='text-red-500 font-bold'>Project ugamer</span><p className='text-center text-red-500'>Group 5 - PPIU</p></h2>
                </footer> */}
                </div>
            </div>
        </>
    )
}

export default Purchase_print