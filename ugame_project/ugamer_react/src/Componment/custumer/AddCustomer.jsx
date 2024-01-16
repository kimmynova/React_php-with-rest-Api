import axios from 'axios';
import React, { useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AlertContext } from '../../alertmesengebox/alert';




const AddCustomer = () => {
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const [inputlist, setInputList] = useState([{ CustName: "", gender: "", Contact: "", Addresss: "" }]);
    const navigate = useNavigate();
    const AlertBox = useContext(AlertContext)
    const [numRowsToAdd, setNumRowsToAdd] = useState(1);


    const handleInput = (e, type, index) => {
        const { name, value } = e.target;
        const list = [...inputlist];
        list[index][name] = value;
        setInputList(list);
    };

    // Function to handle adding a new row to the list of employee entries
    // const handleAddClick = () => {

    //     setInputList([...inputlist, { CustName: "", gender: "", Contact: "", Addresss: "" }]);

    // };
    // const handleAddClick = () => {

    //     const newRows = Array.from({ length: numRowsToAdd }, () => ({
    //         CustName: "", gender: "", Contact: "", Addresss: ""
    //     }));
    //     setInputList([...inputlist, ...newRows]);
    //     setNumRowsToAdd(1)
       
    // };
    
    const handleAddClick = () => {
        setInputList((prevInputList) => {
            const newRows = Array.from({ length: numRowsToAdd }, () => ({
                CustName: "",
                gender: "",
                Contact: "",
                Addresss: "",
            }));
            return [...prevInputList, ...newRows];
            
        });
    };
    
// const handleAddClick = () => {
//     if (inputlist.length + numRowsToAdd <= 5) { // Check if total rows won't exceed the limit
//         const newRows = Array.from({ length: numRowsToAdd }, () => ({
//             CustName: "", gender: "", Contact: "", Addresss: ""
//         }));
//         setInputList([...inputlist, ...newRows]);
//     } else {
//         setMsg("You've reached the maximum limit of 5 rows.");
//     }
// };

    const handleRemove = (indexToRemove) => {
        setInputList((prevInputList) =>
            prevInputList.filter((_, index) => index !== indexToRemove)

        );
    };

    const handlesave = async (e) => {
        e.preventDefault();
        const dialogbox = await AlertBox.alertInsert();
        if (dialogbox.isConfirmed) {
            const hasEmptyFields = inputlist.some((entry) =>
                // entry.isNew && Object.values(entry).some((value) => value === ""));
                entry.isNew && Object.values(entry).some((value) => value === ""));
                
            if (hasEmptyFields) {
                setMsg("All fields are required for the added entries.");
                return;
            }
            const entriesToSave = inputlist.map((entry) => ({
                customerdata: {
                    CustName: entry.CustName,
                    gender: entry.gender,
                    customerphone: entry.Contact.split(/,\r\n|\r|\n/).filter(Boolean),
                    Addresss: entry.Addresss,
                },
            }));

            // ...

            const responses = await Promise.all(
                entriesToSave.map((entry) =>
                    axios.post(
                        "http://localhost/ugame_project/ugamerphp/Customer/Customer.php",
                        entry // Send the entire entry as an object, not in an array
                    )
                )
            );

            const hasError = responses.some((res) => !res.data.success);
            if (hasError) {
                setMsg("An error occurred while saving. No entries were saved.");
                AlertBox.error();
            } else {
                setMsg("All entries saved successfully.");
                AlertBox.save();
                setTimeout(() => {
                    navigate("/showcustomer");
                }, 2000);
            }
        } else if (dialogbox.isDenied) {
            AlertBox.unsave()
        }
    };



    return (
        <div className='flex dark:bg-[#06080F] flex-col'>   
        {/* <h6 className='mt-2 p-2'>Note: <span className=' text-red-500'>Multiple phone number just press enter key for new line</span></h6> */}
            <div className='flex items-center justify-end mx-[8.5rem] my-5 gap-5'>
                <label htmlFor='numRowsToAdd'>Number of Rows to Add</label>
                <input
                    id='numRowsToAdd'
                    className='border py-2 pl-2 dark:bg-gray-500 font-light'
                    type='number'
                    value={numRowsToAdd}
                    onChange={(e) => setNumRowsToAdd(parseInt(e.target.value))}
                    

                />

                <button
                    onClick={handleAddClick}
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                >
                    Add Row
                </button>

                <button
                    onClick={handlesave} className='bg-green-500 hover.bg-green-700 text-white font-bold py-2 px-4 rounded'
                >
                    Save
                </button>
            </div>
            <div className='flex justify-center items-center flex-col'>
                <p className='text-red-600'>
                    {
                        msg !== "" ?
                            <span className='text-green-600'>{msg}</span> :
                            <span>{error}</span>
                    }
                </p>
                <div className='dark:text-white w-[80%] h-[70vh] overflow-scroll overflow-y-visible overflow-x-hidden'>
                    <table className='dark:bg-[#3f4042] border '>
                        <thead className='top-0 '>
                            <tr className='  dark:bg-[#3f4042] border-y bg-[#2980b9] text-white grid grid-cols-5 gap-2 px-4 py-4'>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Phone</th>
                                <th>Address</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {inputlist.map((entry, i) => {
                                return (

                                    <tr className='dark:bg-[#3f4042] grid grid-cols-5 px-3 gap-2' key={i}>
                                        <td>
                                            <input
                                                type='text'
                                                name='CustName'
                                                value={entry.CustName}
                                                onChange={(e) => handleInput(e, "CustName", i)}
                                                placeholder='customer name'
                                                className='dark:bg-[#3f4042] w-[100%] h-[70%] rounded-md border-2 p-2 pt-3 py-5 mt-3 border-gray-400'
                                                autoComplete='off'
                                           />
                                        </td>
                                        <td>
                                            <select
                                                name='gender'
                                                onChange={(e) => handleInput(e, "gender", i)}
                                                value={entry.gender}
                                                className='dark:bg-[#3f4042] w-[100%] h-[70%] rounded-md border-2 p-2 border-gray-400 pt-3 py-5 mt-3'
                                            >
                                                <option value=''>Select Gender</option>
                                                <option value='Male'>Male</option>
                                                <option value='Female'>Female</option>
                                            </select>
                                        </td>


                                        <td>  <textarea
                                            rows="2"
                                            name="Contact"
                                            value={entry.Contact}
                                            onChange={(e) => handleInput(e, "Contact", i)}
                                            placeholder='phone number'
                                            className='dark:bg-[#3f4042] w-[100%] h-[70%] rounded-md border-2 p-2 border-gray-400 pt-3 py-5 mt-3'
                                        />

                                        </td>

                                        <td>
                                            <input
                                                type='text'
                                                name='Addresss'
                                                onChange={(e) => handleInput(e, "address", i)}
                                                value={entry.Addresss}
                                                placeholder='Address'
                                                className='dark:bg-[#3f4042] w-[100%] h-[70%] rounded-md border-2 p-2 border-gray-400 pt-3 py-5 mt-3'
                                                autoComplete='off'
                                           />
                                        </td>
                                        {/* {inputlist.length-1===i&&
                          <td  className='flex justify-center '><button onClick={()=>handleRemove(i)} className='bg-red-500 w-[60%] my-2 hover:bg-blue-700 text-white font-bold  rounded'>remove</button></td>
                          } */}

                                        <td className='flex justify-center items-center '><button onClick={() => handleRemove(i)} className='bg-red-500 w-[70px] h-[50px] rounded hover:bg-orange-400 text-white font-bold '>remove</button></td>

                                    </tr>

                                );
                            })}

                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
};


export default AddCustomer;