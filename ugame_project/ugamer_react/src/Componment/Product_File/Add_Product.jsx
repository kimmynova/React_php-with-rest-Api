
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertContext } from '../../alertmesengebox/alert';

const Add_Product = ({ setOpenUpdate }) => {
  // const [previewImages, setPreviewImages] = useState([]);
  // const [inputlist, setInputList] = useState([
  //   { prodName: '', prodType: '', Cost: 0.0, prodprice: 0.0, Qty: 0.0, img: null },
  const initialRow = {
    prodName: '',
    prodType: '',
    Cost: 0.0,
    prodprice: 0.0,
    Qty: 0.0,
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
  const [categories, setCategories] = useState([]);

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
  };

  // Function to handle adding a new row to the list of product entries
  // const handleAddClick = () => {
  //   const newRows = Array.from({ length: numRowsToAdd }, () => ({
  //     prodName: '',
  //     prodType: '',
  //     Cost: 0.0,
  //     prodprice: 0.0,
  //     Qty: 0.0,
  //     img: null,
  //   }));
  //   setInputList([...inputlist, ...newRows]);
  //   setPreviewImages([...previewImages, null]);
  // };
  const handleAddClick = () => {
    const newRows = Array.from({ length: numRowsToAdd }, () => ({ ...initialRow }));
    setInputList([...inputlist, ...newRows]);
    setPreviewImages([...previewImages, ...Array(numRowsToAdd).fill(null)]);
    setNumRowsToAdd(1)
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
        formData.append("prodName", entry.prodName);
        formData.append("prodType", entry.prodType);
        formData.append("Cost", entry.Cost);
        formData.append("prodprice", entry.prodprice);
        formData.append("Qty", entry.Qty);
        formData.append("img", entry.img);
        return formData;
      });
  
      try {
        const productResponse = await Promise.all(
          formDataArray.map((formData) =>
            axios.post(
              "http://localhost/ugame_project/ugamerphp/Product/Product.php",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
          )
        );
  
        console.log("Product Response:", productResponse);
  
        const allSuccess = productResponse.every(
          (response) => response.data.success
        );
  
        if (allSuccess) {
          setMsg("All entries saved successfully.");
          AlertBox.save();
          setTimeout(() => {
            navigate('/showproduct');
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
        navigate('/showproduct');
      }, 2000);
    }
  };
  

  useEffect(() => {
    // Fetch categories
    fetch('http://localhost/ugame_project/ugamerphp/Product/Categories.php')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => {
        console.error('Error fetching categories:', err);
      });
  }, []);

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
        <div className='dark:text-white w-[90%] h-[70vh] overflow-scroll overflow-y-visible overflow-x-hidden'>
          <table className='dark:bg-[#3f4042]'>
            <thead className='top-0'>
              <tr className='dark:bg-[#3f4042] border-y bg-[#2980b9] text-white grid grid-cols-7 gap-2 px-4 py-4'>
                <th>Name</th>
                <th>Type</th>
                <th>Cost</th>
                <th>Product Price</th>
                <th>Qty</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {inputlist.map((entry, i) => {
                return (
                  <tr className='dark:bg-[#3f4042] grid grid-cols-7 px-3 gap-2' key={i}>
                    <td>
                      <input
                        type='text'
                        name='prodName'
                        value={entry.prodName}
                        onChange={(e) => handleInput(e, i)}
                        placeholder='Product Name'
                        className='dark:bg-[#3f4042] w-[100%] h-[70%] rounded-md border-2 p-2 pt-3 py-5 mt-3 border-gray-400'
                        autoComplete='off'
                      />
                    </td>
                    <td>
                      <select
                        name='prodType'
                        onChange={(e) => handleInput(e, i)}
                        value={entry.prodType}
                        className='dark:bg-[#3f4042] w-[100%] h-[70%] rounded-md border p-2 border-gray-400 pt-3 mt-3'
                      >
                        <option value=''>Select category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.Type}>
                            {category.Type}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type='number'
                        name='Cost'
                        value={entry.Cost}
                        onChange={(e) => handleInput(e, i)}
                        placeholder='$'
                        className='dark:bg-gray-700 text-right w-[100%] h-[70%] rounded-md border-2 p-2 pt-3 py-5 mt-3 border-gray-400'
                      />
                    </td>
                    <td>
                      <input
                        type='number'
                        name='prodprice'
                        value={entry.prodprice}
                        onChange={(e) => handleInput(e, i)}
                        placeholder='Product Price'
                        className='dark:bg-[#3f4042] text-right w-[100%] h-[70%] rounded-md border-2 p-2 pt-3 py-5 mt-3 border-gray-400'
                      />
                    </td>
                    <td>
                      <input
                        type='number'
                        name='Qty'
                        value={entry.Qty}
                        onChange={(e) => handleInput(e, i)}
                        placeholder='Qty'
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
  );
};

export default Add_Product;
