import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { AlertContext } from '../alertmesengebox/alert';
import axios from 'axios';
import { Password } from '@mui/icons-material';

const Adduser = () => {
    // const [previewImages, setPreviewImages] = useState([]);
  // const [inputlist, setInputList] = useState([
  //   { Name: '', Username: '', Cost: 0.0, prodprice: 0.0, Qty: 0.0, img: null },
  const initialRow = {
    Name: '',
    Username: '',
    Role:'',
    Password:'',
    compass:'',
    img: null,
  };
  
  const [inputlist, setInputList] = useState([initialRow]);
  const [previewImages, setPreviewImages] = useState([null]);
  // ]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const AlertBox = useContext(AlertContext);
  const [numRowsToAdd, setNumRowsToAdd] = useState(1);
  const [selectedproduct, setSelectedproduct] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [role, setrole] = useState("");
  const [Employees, setEmployees] = useState([]);

  // Function to handle input changes for each field in the product entries
  const handleInput = (e, index) => {
    const { name, value, type } = e.target;
    const list = [...inputlist];
    if (type === 'file') {
      const selectedImage = e.target.files[0];
      list[index][name] = selectedImage;

      // Create a preview URL for the selected image and store it in the previewImages state
      const imageURL = URL.createObjectURL(selectedImage);
      const previews = [...previewImages];
      previews[index] = imageURL;
      setPreviewImages(previews);
    } else {
      list[index][name] = value;
    }
    setInputList(list);

    if (name === 'Name') {
        const selectedEmployeeData = employee.find((emp) => emp.empname === value);
        list[index]['Role'] = selectedEmployeeData ? selectedEmployeeData.role : "";
      }
  };

  const handleAddClick = () => {
    const newRows = Array.from({ length: numRowsToAdd }, () => ({ ...initialRow }));
    setInputList([...inputlist, ...newRows]);
    setPreviewImages([...previewImages, ...Array(numRowsToAdd).fill(null)]);
  };
  

  // Function to handle removing a row from the list of product entries
  const handleRemove = (indexToRemove) => {
    setInputList((prevInputList) =>
      prevInputList.filter((_, index) => index !== indexToRemove)
    );
    // Also remove the corresponding preview image
    setPreviewImages((prevPreviewImages) => {
      const updatedPreviewImages = [...prevPreviewImages];
      updatedPreviewImages.splice(indexToRemove, 1); // Remove the image at the specified index
      return updatedPreviewImages;
    });
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
  
      const formDataArray = inputlist.map((entry) => {
        const formData = new FormData();
        formData.append("Name", entry.Name);
        formData.append("Username", entry.Username);
        formData.append("Role", entry.Role);
        formData.append("Password", entry.Password);
        formData.append("img", entry.img);
        return formData;
      });
  
      try {
        const userResponse = await Promise.all(
          formDataArray.map((formData) =>
            axios.post(
              "http://localhost/ugame_project/ugamerphp/user/user.php",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
          )
        );
  
        console.log("Product Response:", userResponse);
  
        const allSuccess = userResponse.every(
          (response) => response.data.success
        );
  
        if (allSuccess) {
          setMsg("All entries saved successfully.");
          AlertBox.save();
          setTimeout(() => {
            navigate('/user');
          }, 2000);
        } else {
          setMsg("An error occurred while saving. No entries were saved.");
        }
      } catch (error) {
        console.error("Error:", error);
        setMsg("An error occurred while saving. No entries were saved.");
      }
    } else if (dialogbox.isDenied) {
      setTimeout(() => {
        AlertBox.unsave();
        navigate('/user');
      }, 2000);
    }
  };
  

  useEffect(() => {
    // Fetch employee
    fetch('http://localhost/ugame_project/ugamerphp/Employee/Employee.php')
      .then((response) => response.json())
      .then((data) => {
        setEmployee(data);
      
      })
      .catch((err) => {
        console.error('Error fetching employee:', err);
      });
  }, []);
//   useEffect(() => {
//     if (selectedEmployee) {
//         const selectedEmployeeData = Employees.find((emp) => emp.empname === selectedEmployee);
//         const selectedEmployeeRole = selectedEmployeeData ? selectedEmployeeData.Role : "Not found";
//         setrole(selectedEmployeeRole);
//        console.log(selectedEmployeeRole)
//     }
// }, [selectedEmployee, Employees]);


function checkP() {
    const passwordMismatch = inputlist.some((entry) => entry.Password !== entry.compass);
    const shortPassword = inputlist.some((entry) => entry.Password.length < 5);
    if (passwordMismatch) {
      setMsg('Passwords and Confirm Passwords do not match.');
    } else if (shortPassword) {
      setMsg('At least one password is less than 5 characters.');
    } else {
      setMsg('');
    }
  }
  
  
  return (
    <div className='flex dark:bg-[#06080F] flex-col'>
      <div className='flex justify-end items-center mx-[8.5rem] mt-3 mb-2 gap-5'>
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
          onClick={handlesave}
          className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
        >
          Save
        </button>
      </div>
      <div className='flex justify-center items-center flex-col'>
        <p className='text-red-600'>
          {msg !== '' ? (
            <span className='text-green-600'>{msg}</span>
          ) : (
            <span>{error}</span>
          )}
        </p>
        <div className=' dark:text-white w-[90%] h-[70vh] overflow-scroll overflow-y-visible overflow-x-hidden'>
          <table className='dark:bg-[rgb(63,64,66)]'>
            <thead className='top-0'>
              <tr className='dark:bg-[#3f4042] border-y bg-[#2980b9] text-white grid grid-cols-7 gap-2 px-4 py-4'>
                <th>Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Password</th>
                <th>Comfrim</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>                
              {inputlist.map((entry, i) => {
                return (
                  <tr className='dark:bg-[#3f4042] grid grid-cols-7 px-3 gap-2' key={i}>
                     <td>
                      <select
                        name='Name'
                        onChange={(e) => handleInput(e, i)}
                        value={entry.Name}
                        className='dark:bg-[#3f4042] w-[100%] h-[70%] rounded-md border p-2 border-gray-400 pt-3 mt-3'
                      >
                        <option value=''>Select User</option>
                        {employee.map((category) => (
                          <option key={category.id} value={category.empname}>
                            {category.empname}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type='text'
                        name='Username'
                        value={entry.Username}
                        onChange={(e) => handleInput(e, i)}
                        placeholder='UserName'
                        className='dark:bg-[#3f4042] w-[100%] h-[70%] rounded-md border-2 p-2 pt-3 py-5 mt-3 border-gray-400'
                        autoComplete='off'
                     />
                    </td>
                   
                    <td>
                      <input
                        type='text'
                        name='Role'
                        value={entry.Role}
                        onChange={(e) => handleInput(e, i)}
                        placeholder='Role'
                        className='dark:bg-[#3f4042] text-right w-[100%] h-[70%] rounded-md border-2 p-2 pt-3 py-5 mt-3 border-gray-400'
                        autoComplete='off'
                      />
                    </td>
                    <td>
                      <input
                        type='password'
                        name='Password'
                        value={entry.Password}
                        onBlur={checkP}
                        onChange={(e) => handleInput(e, i)}
                        placeholder='Password'
                        className='dark:bg-[#3f4042] text-right w-[100%] h-[70%] rounded-md border-2 p-2 pt-3 py-5 mt-3 border-gray-400'
                      />
                    </td>
                    <td>
                      <input
                        type='password'
                        name='compass'
                        value={entry.compass}
                        onBlur={checkP}
                        onChange={(e) => handleInput(e, i)}
                        placeholder='Comfrim Password'
                        className='dark:bg-[#3f4042] text-right w-[100%] h-[70%] rounded-md border-2 p-2 pt-3 py-5 mt-3 border-gray-400'
                      />
                    </td>
                    <td className='border flex justify-between items-center px-4 my-4'>
                      <input
                        type='file'
                        name='img'
                        onChange={(e) => {
                          handleInput(e, i);
                        }}
                        placeholder='Select Image'
                      />
                      {previewImages[i] && (
                        <img
                          src={previewImages[i]}
                          alt='Product Preview'
                          className='w-[50px] h-[50px] object-cover border'
                        />
                      )}
                    </td>
                    <td className='flex justify-center '>
                      <button
                        onClick={() => handleRemove(i)}
                        className='bg-red-500 w-[60%] my-2 hover:bg-orange-400 text-white font-bold  rounded'
                      >
                        Remove
                      </button>
                    </td>
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

export default Adduser