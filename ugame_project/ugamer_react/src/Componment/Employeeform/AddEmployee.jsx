import axios from 'axios';
import React, { useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { AlertContext } from '../../alertmesengebox/alert';

const AddEmployee = () => {


  // State variable for managing the list of employee entries
  const [inputlist, setInputList] = useState([{ empName: "", gender: "", dob: "", role: "", address: "", phone: "", email: "" }]);
  // const [inputlist2, setInputList2] = useState([{ EmpName: "", contact: "" }]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("")
  const navigate = useNavigate();
  const AlertBox = useContext(AlertContext);

  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [numRowsToAdd, setNumRowsToAdd] = useState(1);

  // Function to handle input changes for each field in the employee entries
  const handleInput = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputlist];
    list[index][name] = value;
    setInputList(list);


  };
  // const inputhandle = (e, index) => {
  //   const { name, value } = e.target;
  //   const list2 = [...inputlist2];
  //   list2[index][name] = value;
  //   setInputList2(list2);
  // }
  // Function to handle adding a new row to the list of employee entries
  const handleAddClick = () => {
    // setInputList([...inputlist, { empName: "", gender: "", dob: "", role: "", address: "" }]);
    const newRows = Array.from({ length: numRowsToAdd }, () => ({
      empName: "", gender: "", dob: "", role: "", address: "", phone: "", email: ""
    }));
    setInputList([...inputlist, ...newRows]);
    setNumRowsToAdd(1)
  };
  // const handleAddClick2 = () => {
  //   setInputList2([...inputlist2, { EmpName: "", Contact: "" }]);
  //   setSelectedEmployee([...selectedEmployee, ""]); // Add an empty selected employee for the new row
  // };

  // Function to handle selecting an employee in the sub-table
  // const handleSelectChange = (e, index) => {
  //   const { value } = e.target;
  //   const updatedSelectedEmployees = [...selectedEmployee];
  //   updatedSelectedEmployees[index] = value;
  //   setSelectedEmployee(updatedSelectedEmployees);
  // };



  const handleRemove = (indexToRemove) => {
    setInputList((prevInputList) =>
      prevInputList.filter((_, index) => index !== indexToRemove)

    );
  };
  // const handleRemove2 = (indexToRemove) => {
  //   setInputList2((prevInputList2) =>
  //     prevInputList2.filter((_, index) => index !== indexToRemove)

  //   );
  // };

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

      // Prepare data for insertion into both tables
      // const employeeData = inputlist.map((entry) => ({
      //   employeeData: {
      //     empName: entry.empName,
      //     gender: entry.gender,
      //     dob: entry.dob,
      //     role: entry.role,
      //     address: entry.address,
      //     customerphone: entry.phone.split(/\r\n|\r|\n/).filter(Boolean),
      //     customeremail: entry.email.split(/\r\n|\r|\n/).filter(Boolean),
      //   },
      // }));
      // Change this in your React component
      const employeeData = inputlist.map((entry) => ({
        employeedata: {
          empName: entry.empName,
          gender: entry.gender,
          dob: entry.dob,
          role: entry.role,
          address: entry.address,
          employeephone: entry.phone.split(/,\r\n|\r|\n/).filter(Boolean).map((phone) => ({ Contact: phone })),
          employeeemail: entry.email.split(/,\r\n|\r|\n/).filter(Boolean).map((email) => ({ email })),
        },
      }));


      // Use Promise.all to insert data into both tables
      const responses = await Promise.all(
        employeeData.map((entry) =>
          axios.post(
            "http://localhost/ugame_project/ugamerphp/Employee/Employee.php",
            entry, // Send the entire entry as an object, not in an array
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
        )
      );

      console.log("Data to send:", employeeData);

      console.log("Employee Response:", responses);

      const hasError = responses.some((res) => !res.data.success);
      if (hasError) {
        setMsg("An error occurred while saving. No entries were saved.");
      } else {
        setMsg("All entries saved successfully.");
        AlertBox.save();
        setTimeout(() => {
          navigate("/Employee");
        }, 2000);
      }
    } else if (dialogbox.isDenied) {
      setTimeout(() => {
        AlertBox.unsave();
        navigate("/Employee");
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
              <tr className='  dark:bg-[#3f4042] border-y bg-[#2980b9] text-white grid grid-cols-9 gap-2 px-4 py-4'>
                <th>Name</th>
                <th>Gender</th>
                <th>Date of Birth</th>
                <th>Position</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>

              {inputlist.map((entry, i) => {
                return (

                  <tr className='dark:bg-[#3f4042] grid grid-cols-9 px-3 gap-2' key={i}>
                    <td>
                      <input
                        type='text'
                        name='empName' // Use 'empName' here for consistency
                        value={entry.empName}
                        onChange={(e) => handleInput(e, i)} // Pass the index here
                        placeholder='Employee Name'
                        className='dark:bg-[#3f4042] w-[100%] h-[70%] rounded-md border-2 p-2 pt-3 py-5 mt-3 border-gray-400'
                        autoComplete='off'
                     />
                    </td>
                    <td>
                      <select
                        name='gender'
                        onChange={(e) => handleInput(e, i)}
                        value={entry.gender}
                        className='dark:bg-[#3f4042] w-[100%] h-[70%] rounded-md border-2 p-2 border-gray-400 pt-3 py-5 mt-3'
                      >
                        <option value=''>Select Gender</option>
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type='date'
                        name='dob'
                        onChange={(e) => handleInput(e, i)}
                        value={entry.dob}
                        className='dark:bg-[#3f4042] w-[100%] h-[70%] rounded-md border-2 p-2 border-gray-400 pt-3 py-5 mt-3'
                      />
                    </td>
                    <td>
                      <select
                        name='role'
                        onChange={(e) => handleInput(e, i)}
                        value={entry.role}
                        className='dark:bg-[#3f4042] w-[100%] h-[70%] rounded-md border-2 p-2 border-gray-400 pt-3 py-5 mt-3'
                      >
                        <option value=''>Select role</option>
                        <option value='HR'>HR</option>
                        <option value='Seller'>Seller</option>
                        <option value='Stock'>Stock</option>
                      </select>
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
                    {/* {inputlist.length-1===i&&
                    <td  className='flex justify-center '><button onClick={()=>handleRemove(i)} className='bg-red-500 w-[60%] my-2 hover:bg-blue-700 text-white font-bold  rounded'>remove</button></td>
                    } */}
                    <td>
                      <textarea
                        name="phone"
                        rows="2"
                        value={entry.phone}
                        onChange={(e) => handleInput(e, i, 'phone')} // Pass 'phone' as the field name
                        className='dark:bg-[#3f4042] w-[100%] h-[70%] rounded-md border-2 p-2 border-gray-400 pt-3 py-4 mt-3'
                      ></textarea>
                    </td>
                    <td>
                      <textarea
                        name="email"
                        rows="2"
                        value={entry.email}
                        onChange={(e) => handleInput(e, i, 'email')} // Pass 'email' as the field name
                        className='dark:bg-[#3f4042] w-[100%] h-[70%] rounded-md border-2 p-2 border-gray-400 pt-3 py-4 mt-3'
                      ></textarea>
                    </td>

                 
                      <td className='flex justify-center items-center '><button onClick={() => handleRemove(i)} className='bg-red-500 w-full px-2 py-2 my-2 hover:bg-orange-400 text-white font-bold  rounded'>remove</button></td>
                   
                  </tr>

                );
              })}

            </tbody>

          </table>
        </div>
        <div className=' flex justify-center items-center gap-6 my-4  '>

          {/* sub table

          <div className='dark:text-white w-[80%] h-[30vh] overflow-scroll overflow-y-visible overflow-x-hidden '>

            <table className='dark:bg-[#3f4042] border   '>
              <thead className='sticky top-0 '>
                <tr className='  dark:bg-[#3f4042] border-y bg-[#2980b9] text-white grid grid-cols-3 gap-2 px-4 py-4'>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody >
                {inputlist2.map((entry1, i) => {
                  return (

                    <tr className='dark:bg-[#3f4042]  grid grid-cols-3  gap-2 px-3 mt-3 ' key={i}>
                      <td>
                        <select
                          placeholder='Employee Name'
                          className='dark:bg-[#3f4042] w-[100%] rounded-md border py-4 border-gray-400 '
                          value={selectedEmployee[i]} // Use the selected employee based on the index
                          onChange={(e) => handleSelectChange(e, i)} // Add an onChange handler
                        >
                          <option value=""></option>
                          {inputlist.map((entry, j) => (
                            <option key={j} value={entry.empName}>
                              {entry.empName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          name='Contact'
                          value={entry1.Contact}
                          onChange={(e) => inputhandle(e, i)}
                          className='dark:bg-[#3f4042] w-[100%] rounded border py-4  border-gray-400'
                        />

                      </td>

                      <td className='flex justify-center items-center'><button onClick={() => { handleRemove2(i) }} className='bg-red-500 w-[50%] mb-9 hover:bg-orange-400 text-white font-bold rounded'>
                        remove
                      </button></td>
                    </tr>

                  );
                })}

              </tbody>

            </table>

          </div>
          <div className='flex justify-center items-center'>
           
              <button
                onClick={handleAddClick2}
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              >
                Add Row
              </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;