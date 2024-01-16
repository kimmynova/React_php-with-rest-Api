import React, { useContext, useEffect, useState } from 'react'
import Image from '../../Aseset/Asus2.jpg';
import { Link } from 'react-router-dom';
import Add_Product from './Add_Product';
import { AlertContext } from '../../alertmesengebox/alert';
import axios from 'axios';
const Edittable = () => {
    const [openUpdate, setOpenUpdate] = useState(false)
    const [products, setproducts] = useState([]);
    const [error, setError] = useState("");
    const [msg, setmsg] = useState("")
    const [isloading, setloading] = useState("");
    const AlertBox = useContext(AlertContext);
    const [serachData, setserachData] = useState([]); //filter
    const [Query, setQuery] = useState("");
    const UserRole = localStorage.getItem('UserRole')
    // Dummy data
    // const product = [{
    //     id: "1",
    //     proname: "Asus",
    //     proprice: 10,
    //     protype: "Computer",
    //     img: Image,
    // },
    // {
    //     id: "2",
    //     proname: "Asus",
    //     proprice: 10,
    //     protype: "Computer",
    //     img: Image,
    // }]

    useEffect(() => {
        setloading(true)
        fetch('http://localhost/ugame_project/ugamerphp/Product/Product.php')
            .then(response => response.json())
            .then(data => {
                setTimeout(() => {
                    if (data && data.Result) {
                        setmsg(data.Result)
                    } else {
                        setproducts(data);
                        setserachData(data);
                    }
                    setloading(false)
                }, 1000);
            })
            .catch(err => {
                setError(err);
                console.log(err);
            });
    }, []);

    const handserach = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setQuery(searchValue);
    
        if (searchValue.length > 0) {
          const searchResults =serachData.filter(
            (prod) =>
              prod.id.toLowerCase().includes(searchValue) ||
              prod.prodname.toLowerCase().includes(searchValue)||
              prod.prodType.toLowerCase().includes(searchValue)
            
          );    
          setproducts(searchResults);
        } else {
            setproducts(serachData); // Reset to all users when the search query is empty
        }
      };

    const handleRemove = async (prodid) => {

        const remove = await AlertBox.Remove();

        if (remove.isConfirmed) {
            try {
                const res = await axios.delete(`http://localhost/ugame_project/ugamerphp/Product/product.php/${prodid}`)
                if (res.data.success) {
                    setmsg(res.data.success);
                    // Update your employee list or do any necessary updates here
                    AlertBox.save();
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);

                } else {
                    setmsg("An error occurred while deleting the employee data");
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
    const handleChecked = (e) => {
        const { id, checked } = e.target;
        if (id === "allSelected") {
            const checkvalueAll = products.map((prodid) => ({
                ...prodid,
                isChecked: checked,
            }))

            setproducts(checkvalueAll);
            console.log(checkvalueAll);
        } else {
            const checkedValueOne = products.map((prod) => (
                prod.id === id ? { ...prod, isChecked: checked } : prod
            ))
            console.log(checkedValueOne);
           setproducts(checkedValueOne);
        }


    }
    const handleRemoveAll=async()=>{
        const checkedprodIds = products
        .filter((products) => products.isChecked)
        .map((products) => products.id)

    if (checkedprodIds.length === 0) {
        setmsg('Please select at least one Employee to delete!');
        return;
    }
    const remove = await AlertBox.Remove();
    if (remove.isConfirmed) {
        try {
            const res = await axios.delete(`http://localhost/ugame_project/ugamerphp/Product/DeleteMultip_prod.php`,
                { data: { checkedprodIds } } //sent requess array to request body
            );
            if (res.data.ok) {
                setmsg(res.data.ok);
                setproducts((prevproducts) =>
                    prevproducts.filter(
                        (products) => !checkedprodIds.includes(products.id)
                    )
                );
                AlertBox.save();
                setTimeout(() => {
                    window.location.reload()
                }, 1500);
            } else {
                setmsg("An error ocuured wwhile deleting the select employee");
            }
        } catch (err) {
            setError("An error ocuured wwhile deleting the select employee");
            AlertBox.error();
        }
    } else if (remove.isDenied) {
        AlertBox.unsave();
    }
    }
    return (
        <>
        <div className='mt-2 flex items-center justify-between mx-[2rem]' >
        <input type="text" value={Query} onChange={(e) => handserach(e)} placeholder='Name or ID....' className='border p-2 mx-4 dark:bg-gray-500 dark:text-white shadow-md font-bold text-gray-600' />
        {msg && <div className="text-red-500 pt-3 mr-[8rem]">{msg}</div>}   
        <div className='flex items-center '>
         <Link to="/product">
                <button hidden={UserRole==='Seller'}
                    className=' md:w-[90px] sm:w-[90px] rounded bg-red-500 mt-2 font-medium py-2 text-white hover:opacity-70 ml-3'
                >
                    Add product
                </button>
            </Link>
            </div>
            </div>
        <div className='flex justify-center items-center px-4 mb-[0.9rem] py-2 sm:ml-7'>
           
            <div className='h-[60vh] md:w-full sm:w-[100%] border shadow-lg sm:mx-0 overflow-x-hidden overflow-y-auto'>

                <table className='w-full border-y'>

                    <thead>
                        <tr className='dark:bg-[#3f4042] bg-slate-500 grid grid-cols-10 max-md:text-sm justify-center items-center p-3 '>
                            <th className='text-white m-3'></th>
                            <th className='text-white m-3'>Id</th>
                            <th className='text-white m-3'>Name</th>
                            <th className='text-white m-3'>Category</th>
                            {UserRole!=='Seller'&&
                            <th className='text-white m-3'>Cost</th>
                            }
                            <th className='text-white m-3'>Price</th>
                            <th className='text-white m-3'>Qty</th>
                            <th className='text-white m-3'>Image</th>
                            <th className='text-white '>Status</th>
                            {UserRole!=='Seller'&&
                            <th className='text-white m-3'>Action</th>
                            }
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {error ? (
                            <tr>
                                <td className='text-red-500'>Something went wrong!</td>
                            </tr>
                        ) : isloading ? (
                            <tr>
                                <td className=' text-green-500'>Loading....</td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                            <td><p className=' text-orange-500'>No data available</p></td>
                            </tr>
                        ) :
                            (
                                products.map((product) => (
                                    <tr className='dark:bg-[#3f4042] lg:mx-w-full md:text-xl sm:text-sm grid grid-cols-10 justify-center items-center border'
                                        key={product.id}
                                    >
                                     <td><input hidden={UserRole==='Seller'||UserRole=='Stock'}  type="checkbox" id={product.id}
                                                onChange={handleChecked}
                                                checked={product.isChecked || false}
                                                /></td>
                                        <td className='m-2 flex items-center justify-center'>{product.id}</td>
                                        <td className='m-2 flex items-center justify-center'>{product.prodname}</td>
                                        <td className='m-2 flex items-center justify-center'>{product.prodType}</td>
                                        {UserRole!=='Seller'&&
                                        <td className='m-2 flex items-center justify-center'>${product.Cost}</td>
                                        }
                                        <td className='m-2 flex items-center justify-center'>${product.prodprice}</td>
                                        <td className='m-2 flex items-center justify-center'>{product.qty}</td>
                                        <td className='m-2 flex items-center justify-center'>
                                            <img src={`http://localhost/ugame_project/ugamerphp/UploadPictureFolder/${product.img}`} className="w-[50px] h-[50px] border border-gray-500 shadow-black object-cover"
                                                alt={product.prodname} />
                                        </td>
                                       <td className={'text-red-500 font-bold mr-8'}>
                                       {product.qty==0 && 'Out of stock'}
                                       </td>
                                        <td className='flex justify-center items-center gap-2 lg:ml-5 md:mr-[4rem] sm:ml-16'>
                                        {UserRole !== 'Seller' && 
                                            <div className=' flex gap-2 items-center justify-center'>
                                                <button onClick={() => handleRemove(product.id)} className='w-[60px] rounded h-[30px] flex items-center justify-center px-9 text-white bg-red-500 hover:opacity-70'>Delete</button>
                                                <Link to={"/EditProduct/" + product.id}> <button className='w-[60px] rounded h-[30px] flex items-center justify-center px-9 text-white bg-green-700 hover:opacity-70'>Edit</button></Link>
                                               
                                            </div>
                                             }   
                                        </td>
                                    </tr>

                                )))}

                    </tbody>
                </table>
            </div>
        </div>
        
        <div  className='flex items-center gap-3 ml-[5.6rem]'>
                <label hidden={UserRole==='Seller'||UserRole=='Stock'}>
                    <input  type="checkbox" id="allSelected" checked={!products.some((product) => !product.isChecked)} onChange={handleChecked}
                    />
                    ✔️ Check all</label>

                <span hidden={UserRole==='Seller'||UserRole=='Stock'}  onClick={() => handleRemoveAll()} className='hover:text-red-600 cursor-pointer'>⛔ Delete</span>

            </div>
        </>
    )
}

export default Edittable
