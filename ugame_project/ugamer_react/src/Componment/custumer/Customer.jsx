import React, { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../alertmesengebox/alert';
import axios from 'axios';
import { Link, json, useNavigate } from 'react-router-dom';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';

const Customer = () => {

    const [openEmployee, setopenEmployee] = useState(false);

    const [isLoading, setisLoading] = useState(null)
    const [error, setError] = useState("")
    const [msg, setMsg] = useState("")
    const [customers, setCustomers] = useState([]);
    const [serachData, setserachData] = useState([]); //filter
    const [Query, setQuery] = useState("");
    const AlertBox = useContext(AlertContext);
const navigator =useNavigate();

    useEffect(() => {
        setisLoading(true);
        fetch('http://localhost/ugame_project/ugamerphp/Customer/Customer.php')
            .then(response => response.json())
            .then(data => {
                setTimeout(() => {
                    if (data && data.result) {
                        setMsg(data.result);
                    } else {
                        console.log(data);
                        setCustomers(data);
                        setserachData(data);
                    }
                    setisLoading(false);
                }, 1000);
            })
            .catch(err => {
                setError("An error occurred while fetching data");
                setisLoading(false);
                console.error(err);
            });
    }, []);

   
    const handserach = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setQuery(searchValue);
        if (searchValue.length > 0) {
          const searchResults =serachData.filter(
            (prod) =>
              prod.custid.toLowerCase().includes(searchValue) ||
              prod.custName.toLowerCase().includes(searchValue)
            
          );
          setCustomers(searchResults);
        } else {
            setCustomers(serachData); // Reset to all users when the search query is empty
        }
      };



    const handleRemove = async (id) => {

        const remove = await AlertBox.Remove();

        if (remove.isConfirmed) {
            try {
                const res = await axios.delete(`http://localhost/ugame_project/ugamerphp/Customer/Customer.php/${id}`);
                if (res.data.success) {
                    setMsg(res.data.success);
                    // setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer.custid !== id));
                    AlertBox.save();
                    setTimeout(() => {
                     window.location.reload()
                    }, 1500);

                } else {
                    setMsg("An error occurred while deleting the employee data");
                    AlertBox.error();
                }
            } catch (err) {
                setError("An error occurred while deleting the employee data");
                AlertBox.error();
            }
        } else if (remove.isDenied) {
            AlertBox.unsave();
        }
    };
   
    const handleCheck = (e) => {
        const { id, checked } = e.target;
        
        if (id === "allSelected") {
          const checkedValues = customers.map((customer) => ({
            ...customer,
            isChecked: checked,
          }));
          setCustomers(checkedValues);
        } else {
          const checkedValue = customers.map((user) =>
            user.custid === id ? { ...user, isChecked: checked } : user
          );
          setCustomers(checkedValue);
        }
      };
      
      const handleRemoveAll = async () => {
        const checkedIds = customers
          .filter((customer) => customer.isChecked)
          .map((customer) => customer.custid);
      
        if (checkedIds.length === 0) {
          setMsg('Please select at least one customer to delete.');
          return;
        }
      
        const remove = await AlertBox.Remove();
      
        if (remove.isConfirmed) {
          try {
            const response = await axios.delete(
              `http://localhost/ugame_project/ugamerphp/Customer/deletemutipcustomer.php`,
              { data: { checkedIds } } // Send the array of checkedIds in the request body
            );
      
            if (response.data.success) {
              setMsg(response.data.success);
              setCustomers((prevCustomers) =>
                prevCustomers.filter(
                  (customer) => !checkedIds.includes(customer.custid)
                )
              );
              AlertBox.save();
              setTimeout(() => {
                window.location.reload()
              }, 1500);
            } else {
              setMsg('An error occurred while deleting the selected customers');
              AlertBox.error();
            }
          } catch (err) {
            setError('An error occurred while deleting the selected customers');
            AlertBox.error();
          }
        } else if (remove.isDenied) {
          AlertBox.unsave();
        }
      };
      
    return (
        <>
            <div className='mt-2 flex items-center justify-between mx-[8.6rem]' >

                <input type="text" value={Query} onChange={(e) => handserach(e)} placeholder='Name or ID....' className='border p-2 dark:bg-gray-500 shadow-md font-bold dark:text-white text-gray-600' />
                {msg && <div className="text-red-500 pt-3 mr-[8rem]">{msg}</div>}
                <div className='flex items-center gap-3'>
                    <Link to={"/addcustomer"}><button className='bg-[#2980b9] md:w-[90px] md:h-[40px] sm:w-[90px] text-sm rounded-md text-white hover:opacity-70 shadow-md '>Add Customer</button></Link>
                </div>
            </div>
            <div className='flex justify-center items-center mb-[0.9rem] pt-1 '>
                {/* {openEmployee && <AddEmployee setopenEmployee={setopenEmployee} />} */}

                <div className=' lg:max-w-[80%] md:w-full sm:max-w-full h-[70vh] border bg-white dark:bg-[#06080F] shadow-lg mb-4] overflow-x-auto  '>
                    <table className='w-full border-y  '>
                        <thead>
                            <tr className='dark:bg-[#3f4042] bg-slate-500 grid grid-cols-7 max-md:text-sm justify-center items-center'>
                                <th className='text-white pt2'></th> 
                                <th className='text-white pt-2'>ID</th>
                                <th className='text-white pt-2'>Name</th>
                                <th className='text-white pt-2'>Gender</th>
                                <th className='text-white pt-2'>Address</th>
                                <th className='text-white pt-2'>Phone</th>
                                <th className='text-white pt-2'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>

                            {error ? (
                                <tr>
                                    <td className='text-red-500'>Something went wrong!</td>
                                </tr>
                            ) : isLoading ? (
                                <tr>
                                    <td className=' text-green-500'>Loading....</td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr><td><p className=' text-orange-500'>No data available</p></td></tr>
                            ) :

                                customers.map((customerData) => (
                                    <tr className='dark:bg-[#3f4042] lg:mx-w-full md:text-xl sm:text-sm grid grid-cols-7 justify-center items-center border ' key={customerData.custid}>
                                     <td> <input
  type="checkbox"
  id={customerData.custid} // Set the id to custid
  checked={customerData?.isChecked || false}
  onChange={handleCheck}
/></td>

                                        
                                        <td className='flex pt-2 items-center justify-center'>{customerData.custid}</td>
                                        <td className='flex pt-2 items-center justify-center md:pr-5 sm:pr-5'>{customerData.custName}</td>
                                        <td className='flex pt-2 items-center justify-center sm:pr-2'>{customerData.gender}</td>
                                        <td className='flex pt-2 items-center justify-center sm:pr-5'>{customerData.address}</td>
                                        <td className='flex pt-2 items-center justify-center sm:pr-5'>
                                            <Link to={`/custphone/${customerData.custid}`}>
                                                <VisibilityTwoToneIcon className='hover:text-red-500 cursor-pointer' />
                                            </Link>
                                        </td>
                                        <td className='flex pt-2 items-center justify-center'>
                                            <div className='flex justify-center items-center gap-2 mr-8 '>
                                                <Link to={"/editcustomer/" + customerData.custid} className='w-[60px] rounded h-[30px] flex items-center justify-center px-9 text-white bg-green-500 hover:opacity-70'>Edit</Link>
                                                <button onClick={() => handleRemove(customerData.custid)} className='w-[60px] rounded h-[30px] flex items-center justify-center px-8 text-white bg-red-600 hover:opacity-70'>Delete</button>
                                            </div>
                                        </td>
                                        <td className='m-2 flex items-center justify-center'></td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                </div>

            </div>
            <div className='flex items-center gap-3 ml-[10rem]'>
            < label>
            <input type="checkbox" id="allSelected" checked={!customers.some((customer) => !customer.isChecked)}onChange={handleCheck}
/>
✔️ Check all</label>

               <span onClick={() => handleRemoveAll()} className='hover:text-red-600 cursor-pointer'>⛔ Delete</span>
        
            </div>
        </>

    )
}

export default Customer












   // const handleremoveall = async (id) => {
    //     const checkedinput = customers
    //       .filter((customer) => customer.isChecked)
    //       .map((customer) => customer.custid);
      
       
    //     const remove = await AlertBox.Remove();
      
    //     if (remove.isConfirmed) {
    //       try {
    //         const response = await axios.delete(
    //           'http://localhost/ugame_project/ugamerphp/Customer/Customer.php/'+id,
    //           checkedinput 
    //         );
      
    //         if (response.data.success) {
    //           setMsg(response.data.success);
    //           setCustomers((prevCustomers) =>
    //             prevCustomers.filter(
    //               (customer) => !checkedinput.includes(customer.custid)
    //             )
    //           );
    //           AlertBox.save();
    //         } else {
    //           setMsg('An error occurred while deleting the selected customers');
    //           AlertBox.error();
    //         }
    //       } catch (err) {
    //         setError('An error occurred while deleting the selected customers');
    //         AlertBox.error();
    //       }
    //     } else if (remove.isDenied) {
    //       AlertBox.unsave();
    //     }
       
    //   };
      