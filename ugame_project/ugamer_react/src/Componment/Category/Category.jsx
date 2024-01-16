import React, { useContext, useEffect, useState } from 'react'
import { AlertContext } from '../../alertmesengebox/alert';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Category = () => {
    const [openEmployee, setopenEmployee] = useState(false);

    const [isLoading, setisLoading] = useState(null)
    const [error, setError] = useState("")
    const [msg, setmsg] = useState("")
    const [Categories, setCategories] = useState([]);
    const AlertBox = useContext(AlertContext);
    const [serachData, setserachData] = useState([]); //filter
    const [Query, setQuery] = useState("");
    const [numRowsToAdd, setNumRowsToAdd] = useState(1);


    useEffect(() => {
        setisLoading(true);
        fetch('http://localhost/ugame_project/ugamerphp/Product/Categories.php')
            .then(response => response.json())
            .then(data => {
                setTimeout(() => {
                    if (data && data.result) {
                        console.log(data)
                        setmsg(data.result);
                    } else {
                        setCategories(data);
                        setserachData(data);
                    }
                    setisLoading(false);
                }, 1000);
            })
            .catch(err => {
                setError(err);
                setisLoading(false);
                console.log(err)
            })
    }, []

    )
    const handleRemove = async (id) => {

        const remove = await AlertBox.Remove();

        if (remove.isConfirmed) {
            try {
                const res = await axios.delete(`http://localhost/ugame_project/ugamerphp/Product/Categories.php/${id}`);
                if (res.data.success) {
                    setmsg(res.data.success);
                    // Update your category list or do any necessary updates here
                    AlertBox.save();
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);

                } else {
                    setmsg("An error occurred while deleting the category data");
                    AlertBox.error();
                }
            } catch (err) {
                setError("An error occurred while deleting the category data");
                AlertBox.error();
            }
        } else if (remove.isDenied) {
            AlertBox.unsave();
        }
    };

    
    const handserach = (e) => {
        const getsearch = e.target.value.toLowerCase();
        //  console.log(getsearch)
        if (getsearch.length > 0) {
            const searchItemData = serachData.filter(
                (item) =>
                    item.Type.toLowerCase().includes(getsearch) ||
                    item.id.toLowerCase().includes(getsearch)
            );
            setCategories(searchItemData);
        } else {
            setCategories(serachData);
        }
        setQuery(getsearch); // Set Query to the search value
    };
    /////////////////////removeAllcheck
    const handleChecked = (e) => {
        const { id, checked } = e.target;
        if (id === "allSelected") {
            const checkvalueAll = Categories.map((category) => ({
                ...category,
                isChecked: checked,
            }))

            setCategories(checkvalueAll);
            console.log(checkvalueAll);
        } else {
            const checkedValueOne = Categories.map((emp) => (
                emp.id === id ? { ...emp, isChecked: checked } : emp
            ))
            console.log(checkedValueOne);
            setCategories(checkedValueOne);
        }


    }
    const handleRemoveAll = async (e) => {
        const checkedcateIds = Categories
            .filter((category) => category.isChecked)
            .map((category) => category.id)

        if (checkedcateIds.length === 0) {
            setmsg('Please select at least one Employee to delete!');
            return;
        }
        const remove = await AlertBox.Remove();
        if (remove.isConfirmed) {
            try {
                const res = await axios.delete(`http://localhost/ugame_project/ugamerphp/Product/mulitpleCateDelete.php`,
                    { data: { checkedcateIds } } //sent requess array to request body
                );
                if (res.data.ok) {
                    setmsg(res.data.ok);
                    setCategories((prevCategory) =>
                        prevCategory.filter(
                            (category) => !checkedcateIds.includes(category.id)
                        )
                    );
                    AlertBox.save();
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000);

                } else {
                    setmsg("An error ocuured wwhile deleting the select category");
                }
            } catch (err) {
                setError("An error ocuured wwhile deleting the select category");
                AlertBox.error();
            }
        } else if (remove.isDenied) {
            AlertBox.unsave();
        }
    }
    return (
        <>
            <div className='mt-2 flex items-center justify-between mx-[21.5rem]' >

                <input type="text" value={Query} onChange={(e) => handserach(e)} placeholder='Name or ID....' className='border p-2 dark:bg-gray-500 shadow-md font-bold text-gray-600 dark:text-white' />
                {msg && <div className="text-red-500 pt-3 mr-[8rem]">{msg}</div>}
                <div className='flex items-center gap-3'>
                    <Link to={"/Addcategory"}><button className='bg-[#2980b9] md:w-[90px] md:h-[40px] sm:w-[90px] text-sm rounded-md text-white hover:opacity-70 shadow-md '>Add </button></Link>
                </div>
            </div>
            <div className='flex justify-center items-center mb-[0.9rem] pt-2  '>
                {/* {openEmployee && <AddEmployee setopenEmployee={setopenEmployee} />} */}

                <div className=' lg:max-w-[95%] md:w-[50%] sm:max-w-full h-[60vh] border bg-white dark:bg-[#06080F] shadow-lg mb-4 overflow-scroll overflow-x-hidden overflow-y-visible'>

                    <table className='w-full border-y   '>
                        <thead>
                            <tr className='dark:bg-[#3f4042] bg-slate-500 grid grid-cols-5 max-md:text-sm justify-center items-center '>
                                <th className='text-white p-2'></th>
                                <th className='text-white p-2'>Id</th>
                                <th className='text-white p-2'>Category</th>
                                <th className='text-white pt-2'>Action</th>
                                <th className='text-white p-2'></th>
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
                            ) : Categories.length === 0 ? (
                                <tr><td><p className=' text-orange-500'>No data available</p></td></tr>
                            ) :
                                (Categories.map((categoryData) => (
                                    <tr className='dark:bg-[#3f4042] lg:mx-w-full md:text-xl sm:text-sm grid grid-cols-5 justify-center items-center border '
                                        key={categoryData.id}
                                    >
                                        <td className='flex p-2 items-center justify-center'>
                                            <input type="checkbox" id={categoryData.id}
                                                onChange={handleChecked}
                                                checked={categoryData.isChecked || false}
                                            />

                                        </td>
                                        <td className='flex pt-2 items-center justify-center'>{categoryData.id}</td>
                                        <td className='flex pt-2 items-center justify-center md:pr-5 sm:pr-5'>{categoryData.Type}</td>
                                     
                                        <td className='flex pt-2 items-center justify-center'>
                                            <div className='flex justify-center items-center gap-2 mr-8 '>
                                                <Link to={"/editCategory/" + categoryData.id} className='w-[60px] rounded h-[30px] flex items-center justify-center px-9 text-white bg-green-500 hover:opacity-70'>Edit</Link>
                                                <button onClick={() => handleRemove(categoryData.id)}
                                                    className='w-[60px] rounded h-[30px] flex items-center justify-center px-8 text-white bg-red-600 hover:opacity-70'>Delete</button>
                                            </div>
                                        </td>
                                        <td className='m-2 flex items-center justify-center'>

                                        </td>

                                    </tr>
                                )))}

                        </tbody>
                    </table>
                </div>
            </div>
            <div className='flex items-center gap-3 ml-[22rem]'>
                < label>
                    <input type="checkbox" id="allSelected" checked={!Categories.some((category) => !category.isChecked)} onChange={handleChecked}
                    />
                    ✔️ Check all</label>

                <span onClick={() => handleRemoveAll()} className='hover:text-red-600 cursor-pointer'>⛔ Delete</span>

            </div>
        </>

    )
}

export default Category