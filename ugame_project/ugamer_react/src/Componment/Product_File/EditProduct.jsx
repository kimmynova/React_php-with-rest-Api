
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertContext, msgbox } from '../../alertmesengebox/alert';

const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [previewImages, setPreviewImages] = useState([]);
    const [selectedproductType, setSelectedproductType] = useState([]);
    const [Categories,  setCategories] = useState([]);
    const [formvalue, setFormvalue] = useState({
        id: '',
        prodName: '',
        prodType: '',
        Cost: 0.0,
        prodprice: 0.0,
        Qty: 0,
        img: null,
        Remark:"",
    });

    const [msg, setmsg] = useState('');
    const Alertbox = useContext(AlertContext);

    const handleInput = (e) => {
        if (e.target.type === 'file') {
            const selectedImage = e.target.files[0];
            if (selectedImage) {
                // Only update the img property if a new image is selected
                setFormvalue({ ...formvalue, img: selectedImage });
                const imageURL = URL.createObjectURL(selectedImage);
                setPreviewImages([imageURL]);
            }
        } else {
            // Update other form fields without changing the img property
            setFormvalue({ ...formvalue, [e.target.name]: e.target.value||'' });
        }
    };



    // useEffect(() => {
    //     const productRowData = async () => {
    //         try {
    //             const response = await axios.get(`http://localhost/ugame_project/ugamerphp/Product/product.php/${id}`);
    //             if (response.data) {
    //                 setFormvalue({
    //                     id: response.data.id, // Set the id property
    //                     prodName: response.data.prodname,
    //                     prodType: response.data.prodType,
    //                     Cost: response.data.Cost,
    //                     prodprice: response.data.prodprice,
    //                     Qty: response.data.Qty,
    //                     img: response.data.img

    //                 });

    //             }
    //         } catch (error) {
    //             console.error('Error:', error);
    //         }
    //     };
    //     productRowData();
    // }, [id]);
    // useEffect(() => {
    //     const productRowData = async () => {
    //         try {
    //             const response = await axios.get(`http://localhost/ugame_project/ugamerphp/Product/product.php/${id}`);
    //             if (response.data) {
    //                 setFormvalue({
    //                     rowproductdata: {
    //                         id: response.data.id, // Set the id property
    //                         prodname: response.data.prodname,
    //                         prodType: response.data.prodType,
    //                         Qty: response.data.Qty,
    //                         img: response.data.img,
    //                         Cost: response.data.Cost,
    //                         prodprice: response.data.prodprice,
    //                     }
    //                 });
    //             }
    //             console.log(response.data)
    //         } catch (error) {
    //             console.error('Error:', error);
    //         }
    //     };
    //     productRowData();
    // }, [id]);
    useEffect(() => {
        const productRowData = async () => {
            try {
                const response = await axios.get(`http://localhost/ugame_project/ugamerphp/Product/product.php/${id}`);
                if (response.data) {
                    setFormvalue({
                        id: response.data.id,
                        prodName: response.data.prodname, 
                        prodType: response.data.prodType,
                        Cost: response.data.Cost,
                        prodprice: response.data.prodprice,
                        Qty: response.data.Qty,
                        img: response.data.img,
                        Remark: response.data.Remark,
                    });
                }                    
            } catch (error) {
                console.error('Error:', error);
            }
        };
        productRowData();
    }, [id]);
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const alert = await Alertbox.msgbox();

        if (alert.isConfirmed) {

            const formData = new FormData();
            formData.append("prodid", formvalue.id);
            formData.append("prodName", formvalue.prodName);
            formData.append("prodType", formvalue.prodType);
            formData.append("Cost", formvalue.Cost);
            formData.append("prodprice", formvalue.prodprice);
            formData.append("Remark", formvalue.Remark || "");
            formData.append("Qty", formvalue.Qty);
           
            if (formvalue.img !== null) {
                formData.append("img", formvalue.img);
            }
            console.log("formvalue.prodName:", formvalue.prodName);

            try {
                const response = await axios.post(
                    `http://localhost/ugame_project/ugamerphp/Product/updateproduct.php/${id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
                        },
                    }
                );
                console.log(response);
                if (response.data.success) {
                    setmsg("Product updated successfully");
                    setFormvalue({ ...formvalue, ...response.data.updatedData });
                    setTimeout(() => {
                        Alertbox.save()
                        navigate("/showproduct")
                    }, 1500);
                } else {
                    setmsg("Error updating product");
                }
            } catch (error) {
                console.error('Error:', error);
                setmsg("Error updating product");
                Alertbox.error();
            }
        } else if (alert.isDenied) {
            Alertbox.unsave();
        }

    };


    useEffect(() => {
        fetch('http://localhost/ugame_project/ugamerphp/Product/selectProduct.php')
            .then(response => response.json())
            .then(data => setSelectedproductType(data))
            .catch(err => {
                setSelectedproductType(err);
                console.log(err);
            });

    }, []);

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
        <div className='absolute inset-0 z-[999] flex items-center justify-center'>
            <Link to='/showproduct'>
                <div className='fixed top-0 left-0 w-screen h-screen bg-black opacity-80'></div>
            </Link>
            <div className='md:absolute border shadow border-gray-500 dark:bg-[#06080F] bg-white max-w-md h-[95vh] top-2 right-0 left-0 bottom-0 m-auto relative'>
                <Link to='/showproduct'>
                    <button className='bg-red-600 w-[55px] h-[56px] rounded text-white hover:bg-green-600 absolute top-0 right-0'>X</button>
                </Link>
                <div className='dark:bg-[#06080F] flex items-center justify-center'>
                    <form className='w-[60%] mx-5 flex items-center justify-center flex-col gap-1'>
                        <h3 className='dark:bg-[#3f4042] bg-[#2980b9] text-white w-[450px] h-[9vh] text-center pt-3 text-2xl'>Edit</h3>
                        {msg && <div className="text-green-500 pt-3">{msg}</div>}
                        <label className='text-left'>
                            Product Name:
                            <input
                                className='dark:bg-[#3f4042] w-[300px] h-[10%] rounded-md border-2 p-2 border-gray-400'
                                onChange={handleInput}
                                value={formvalue.prodName}
                                name='prodName'
                            />
                        </label>
                        <label className='text-left'>
                            Type:
                            {/* <input
                                className='dark-bg-[#3f4042] w-[300px] h-[10%] rounded-md border-2 p-2 border-gray-400'
                                onChange={handleInput}
                                value={formvalue.prodType}
                                name='prodType'
                            /> */}

                            <select
                                name='prodType'
                                onChange={(e) => handleInput(e)}
                                value={selectedproductType.prodType}
                                className='dark:bg-[#3f4042] w-[300px] h-[10%] rounded-md border-2 p-2 border-gray-400'
                            >
                                {/* <option value=''>Select category</option> */}
                                {selectedproductType.map((category) => (
                                    <option key={category.prodName} value={category.Type}>
                                        {category.Type}
                                    </option>

                                ))}
                                {Categories.map((categories)=>(
                                <option key={categories.id} value={categories.Type}>
                                    {categories.Type}
                                </option>
                                ))}
                                </select>
                        </label>
                        <label className='text-left'>
                            Cost:
                            <input
                                type='number'
                                // step='0.01'
                                className='dark:bg-[#3f4042] w-[300px] h-[10%] rounded-md border-2 p-2 border-gray-400'
                                onChange={handleInput}
                                value={formvalue.Cost}
                                name='Cost'
                               
                            />
                        </label>
                        <label className='text-left'>
                            Price:
                            <input
                                type='number'
                                // step='0.01'
                                className='dark:bg-[#3f4042] w-[300px] h-[10%] rounded-md border-2 p-2 border-gray-400'
                                onChange={handleInput}
                                value={formvalue.prodprice}
                                name='prodprice'
                            />
                        </label>
                        <label className='text-left'>
                            Quantity:
                            <input
                                type='number'
                                className='dark:bg-[#3f4042] w-[300px] h-[10%] rounded-md border-2 p-2 border-gray-400'
                                onChange={handleInput}
                                value={formvalue.Qty}
                                name='Qty'
                            />
                        </label>
                        <label className='text-left'>
                            Remark:
                            <input
                                type='text'
                                className='dark:bg-[#3f4042] w-[300px] h-[10%] rounded-md border-2 p-2 border-gray-400'
                                onChange={handleInput}
                                value={formvalue.Remark}
                                name='Remark'
                                autoComplete='off'
                            />
                        </label>
                  

                        {/* <label className='text-left'>
                            {previewImages && (
                                <img
                                    src={previewImages[0] || `http://localhost/ugame_project/ugamerphp/UploadPictureFolder/${formvalue.img}`}
                                    alt='Product Preview'
                                    className='w-[80px] h-[80px] object-cover border'
                                />
                            )}
                            <input
                                type='file'
                                name='img'
                                onChange={handleInput}
                                placeholder='Select Image'
                                value={previewImages}
                            />
                        </label> */}
                            
                        <label className='text-left flex items-center gap-5'>
                            {previewImages && formvalue.img && (
                                <img
                                    src={previewImages[0] || `http://localhost/ugame_project/ugamerphp/UploadPictureFolder/${formvalue.img}`}
                                    alt='Product Preview'
                                    className='w-[80px] h-[80px] object-cover border'
                                />
                            )}
                            <input
                                type='file'
                                name='img'
                                onChange={handleInput}
                                placeholder='Select Image'
                            />
                        </label>
                        <button onClick={handleSubmit} className='flex items-center bg-red-600 px-8 py-1 rounded text-white m-1 hover:bg-green-600'>Update</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;



