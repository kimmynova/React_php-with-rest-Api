import React, { useContext, useState } from 'react'
import { AlertContext } from '../../alertmesengebox/alert';
import { useNavigate } from 'react-router';
import axios from 'axios';

const AddCategory = () => {
  const [inputlist, setInputList] = useState([{ Cname: "" }]);
  // const [inputlist2, setInputList2] = useState([{ EmpName: "", contact: "" }]);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("")
  const navigate = useNavigate();
  const AlertBox = useContext(AlertContext);
  const [numRowsToAdd, setNumRowsToAdd] = useState(1);

  // Function to handle input changes for each field in the employee entries
  const handleInput = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputlist];
    list[index][name] = value;
    setInputList(list);


  };
  const handleAddClick = () => {
    // setInputList([...inputlist, { empName: "", gender: "", dob: "", role: "", address: "" }]);
    const newRows = Array.from({ length: numRowsToAdd }, () => ({
      Cname: ""
    }));
    setInputList([...inputlist, ...newRows]);
    setNumRowsToAdd(1)
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
      Object.values(entry).some((value) => value === "")
      );

      if (hasEmptyFields) {
        AlertBox.error();
        setMsg("All fields are required for all entries.");
        return;
      }

      
      const CategoryData = inputlist.map((entry) => ({
        categorydata: {
          Cname: entry.Cname,
        },
      }));


      // Use Promise.all to insert data into both tables
      const responses = await Promise.all(
        CategoryData.map((entry) =>
          axios.post(
            "http://localhost/ugame_project/ugamerphp/Product/Categories.php",
            entry, // Send the entire entry as an object, not in an array
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
        )
      );

      console.log("Data to send:", CategoryData);

      console.log("category Response:", responses);

      const hasError = responses.some((res) => !res.data.success);
      if (hasError) {
        setMsg("An error occurred while saving. No entries were saved.");
      } else {
        setMsg("All entries saved successfully.");
        AlertBox.save();
        setTimeout(() => {
          navigate("/category");
        }, 2000);
      }
    } else if (dialogbox.isDenied) {
      setTimeout(() => {
        AlertBox.unsave();
        navigate("/category");
      }, 2000);
    }
  };


  return (
    // main table
    <div className='flex w-[50%] m-auto mt-4 dark:bg-[#06080F] flex-col'>
      <div className='flex items-center mt-3 mb-2 gap-5'>
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
              <tr className='  dark:bg-[#3f4042] border-y bg-[#2980b9] text-white grid grid-cols-2 gap-2 px-4 py-4'>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>

              {inputlist.map((entry, i) => {
                return (

                  <tr className='dark:bg-[#3f4042] grid grid-cols-2 px-3 gap-2' key={i}>
                    <td>
                      <input
                        type='text'
                        name='Cname' // Use 'empName' here for consistency
                        value={entry.Cname}
                        onChange={(e) => handleInput(e, i)} // Pass the index here
                        placeholder='CategoryName'
                        className='dark:bg-[#3f4042] w-[100%] h-[70%] rounded-md border-2 p-2 pt-3 py-5 mt-3 border-gray-400'
                      />
                    </td>
                    <td className='flex justify-center items-center '><button onClick={() => handleRemove(i)} className='bg-red-500  px-2 py-2 my-2 hover:bg-orange-400 text-white font-bold  rounded'>remove</button></td>

                  </tr>

                );
              })}

            </tbody>

          </table>
        </div>
      </div>
    </div>
  )
}

export default AddCategory