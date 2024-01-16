import React from 'react'
import axios from 'axios';
import  { useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AlertContext } from '../../alertmesengebox/alert';
const Addsupplier = () => {
  

  // State variable for managing the list of employee entries
  const [inputlist, setInputList] = useState([{ supName:"", address: "", supPhone: "", supemail: "" }]);
  // const [inputlist2, setInputList2] = useState([{ EmpName: "", contact: "" }]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("")
  const navigate = useNavigate();
  const AlertBox = useContext(AlertContext);

  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [numRowsToAdd, setNumRowsToAdd] = useState(1);

  
  const handleInput = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputlist];
    list[index][name] = value;
    setInputList(list);


  };
  
  // const handleAddClick = () => {
  //   const newRows = Array.from({ length: numRowsToAdd }, () => ({
  //     supName: "",supName:"", address: "", supPhone: "",supemail: ""
  //   }));
  //   setInputList([...inputlist, ...newRows]);
    
  // };
  const handleAddClick = () => {
    console.log("Adding rows");
    setInputList((prevInputList) => {
        const newRows = Array.from({ length: numRowsToAdd }, () => ({
            supName: "",
            address: "",
            supPhone: "",
            supemail: "",
        }));
        return [...prevInputList, ...newRows];
    });
};





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
        entry.isNew && Object.values(entry).some((value) => value === "")
      );

      if (hasEmptyFields) {
        AlertBox.error();
        setMsg("All fields are required for all entries.");
        return;
      }

      const supplierData = inputlist.map((entry) => ({
        supplierData: {
          supName: entry.supName,
          address: entry.address,
          supplierphone: entry.supPhone.split(/,\r\n|\r|\n/).filter(Boolean).map((phone) => ({ supPhone: phone })),
          supplieremail: entry.supemail.split(/,\r\n|\r|\n/).filter(Boolean).map((email) => ({ supemail:email })),
        },
      }));
      


      // Use Promise.all to insert data into both tables
      const responses = await Promise.all(
        supplierData.map((entry) =>
          axios.post(
            "http://localhost/ugame_project/ugamerphp/Supplier/Supplier.php",
            entry, // Send the entire entry as an object, not in an array
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
        )
      );

      console.log("Data to send:", supplierData);

      console.log("Employee Response:", responses);

      const hasError = responses.some((res) => !res.data.success);
      if (hasError) {
        setMsg("An error occurred while saving. No entries were saved.");
      } else {
        setMsg("All entries saved successfully.");
        AlertBox.save();
        setTimeout(() => {
          navigate("/supplier");
        }, 2000);
      }
    } else if (dialogbox.isDenied) {
      setTimeout(() => {
        AlertBox.unsave();
        navigate("/supplier");
      }, 2000);
    }
  };


  return (
    // main table
    <div className='flex dark:bg-[#06080F] flex-col'>
      <div className='flex justify-end items-center mx-[4.5rem] mt-3 mb-2 gap-5'>
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
        <div className='dark:text-white w-[90%] h-[70vh] overflow-scroll overflow-y-visible overflow-x-hidden '>
          <table className='dark:bg-[#3f4042] '>
            <thead className='top-0'>
              <tr className='  dark:bg-[#3f4042] border-y bg-[#2980b9] text-white grid grid-cols-6 gap-2 px-4 py-4'>
                <th>SupplyName</th>
                {/* <th>Date</th> */}
                <th>Address</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>

              {inputlist.map((entry, i) => {
                return (

                  <tr className='dark:bg-[#3f4042] grid grid-cols-6 px-3 gap-2' key={i}>
                    <td>
                      <input
                        type='text'
                        name='supName' // Use 'supName' here for consistency
                        value={entry.supName}
                        onChange={(e) => handleInput(e, i)} // Pass the index here
                        placeholder='Supplier Name'
                        className='dark:bg-[#3f4042] w-[100%] h-[70%] rounded-md border-2 p-2 pt-3 py-5 mt-3 border-gray-400'
                        autoComplete='off'
                     />
                    </td>

                    <td>
                      <input
                        type='text'
                        name='address'
                        onChange={(e) => handleInput(e, i)}
                        value={entry.address}
                        className='dark:bg-[#3f4042] w-[100%] h-[70%] rounded-md border-2 p-2 border-gray-400 pt-3 py-5 mt-3'
                        autoComplete='off'
                     />

                    </td>
                 
                    <td>
                      <textarea
                        name="supPhone"
                        rows="2"
                        value={entry.supPhone}
                        onChange={(e) => handleInput(e, i, 'phone')} // Pass 'phone' as the field name
                        className='dark:bg-[#3f4042] w-[100%] h-[70%] rounded-md border-2 p-2 border-gray-400 pt-3 py-4 mt-3'
                      ></textarea>
                    </td>
                    <td>
                      <textarea
                        name="supemail"
                        rows="2"
                        value={entry.supemail}
                        onChange={(e) => handleInput(e, i, 'email')} // Pass 'email' as the field name
                        className='dark:bg-[#3f4042] w-[100%] h-[70%] rounded-md border-2 p-2 border-gray-400 pt-3 py-4 mt-3'
                      ></textarea>
                    </td>

                      <td className='flex justify-center items-center'><button onClick={() => handleRemove(i)} className='bg-red-500 w-[60px] h-[30px]  hover:bg-orange-400 text-white font-bold  rounded'>remove</button></td>
                  
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

export default Addsupplier