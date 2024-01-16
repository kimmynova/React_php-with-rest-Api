import React, { useContext, useEffect, useState } from 'react'
import { Link, json, useNavigate } from 'react-router-dom'
import Edituser from './Edituser'
import axios from 'axios';
import Swal from 'sweetalert2';
import { AlertContext } from '../../alertmesengebox/alert';
import defaultProfileImage from '../../Aseset/boy.png';
const User = () => {
    const [users, setuser] = useState([]);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [error, setError] = useState("");
    const [msg, setmsg] = useState("");
    const [isLoading, setisLoading] = useState(null);
    const navigate = useNavigate();
    const AlertBox = useContext(AlertContext);
    const [Query, setQuery] = useState("");
    const [searchData, setSearchData] = useState([]);
    const userRole = localStorage.getItem('UserRole')
    useEffect(() => {
        setisLoading(true);
        fetch('http://localhost/ugame_project/ugamerphp/user/user.php')
            .then(response => response.json())
            .then(data => {
                setTimeout(() => {


                    if (data && data.Resault) {
                        setmsg(data.Resault)
                    } else {
                        setuser(data)

                        setSearchData(data)
                    }
                    setisLoading(false);
                    console.log(data)

                }, 1000);
            })
            .catch(err => {
                setError(err);
                console.log(err);
            });

    }, []);

    const deleteHandle = async (id) => {

        const remove = await AlertBox.Remove();

        if (remove.isConfirmed) {
            try {
                const res = await axios.delete(`http://localhost/ugame_project/ugamerphp/user/user.php/${id}`);
                if (res.data.Success) {
                    setmsg(res.data.Success);
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

    //////////////////////////////////////////////////
    // const handleChecked = (e) => {
    //     const { id, checked } = e.target;
    //     if (id === "allSelected") {
    //         const checkvalueAll = users.map((id) => ({
    //             ...id,
    //             isChecked: checked,
    //         }))

    //         setuser(checkvalueAll);
    //         console.log(checkvalueAll);
    //     } else {
    //         const checkedValueOne = users.map((user) => (
    //             user.id === id ? { ...user, isChecked: checked } : user
    //         ))
    //         console.log(checkedValueOne);
    //         setuser(checkedValueOne);
    //     }


    // }

    const handleChecked = (e) => {
        const { id, checked } = e.target;

        if (id === "allSelected") {
            const checkvalueAll = users.map((user) => ({
                ...user,
                isChecked: user.Role !== 'SuperAdmin' && checked,
            }));
            setuser(checkvalueAll);
        } else {
            if (userRole !== 'SuperAdmin') {
                const checkedValueOne = users.map((user) => (
                    user.id === id ? { ...user, isChecked: checked } : user
                ));
                setuser(checkedValueOne);
            }
        }
    };

    const handleRemoveAll = async () => {
        const checkedUserIds = users
            .filter((users) => users.isChecked)
            .map((users) => users.id)

        if (checkedUserIds.length === 0) {
            setmsg('Please select at least one User to delete!');
            return;
        }
        const remove = await AlertBox.Remove();
        if (remove.isConfirmed) {
            try {
                const res = await axios.delete(`http://localhost/ugame_project/ugamerphp/user/Deletemuitpleuser.php`,
                    { data: { checkedUserIds } } //sent requess array to request body
                );
                if (res.data.ok) {
                    setmsg(res.data.ok);
                    setuser((prevuser) =>
                        prevuser.filter(
                            (users) => !checkedUserIds.includes(users.id)
                        )
                    );
                    AlertBox.save();
                    setTimeout(() => {
                        window.location.reload()
                    }, 1500);

                } else {
                    setmsg("An error ocuured wwhile deleting the select User");
                }
            } catch (err) {
                setError("An error ocuured wwhile deleting the select User");
                AlertBox.error();
            }
        } else if (remove.isDenied) {
            AlertBox.unsave();
        }
    }
    const handserach = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setQuery(searchValue);

        if (searchValue.length > 0) {
            const searchResults = searchData.filter(
                (user) =>
                    user.id.toLowerCase().includes(searchValue) ||
                    user.Name.toLowerCase().includes(searchValue) ||
                    user.Username.toLowerCase().includes(searchValue) ||
                    user.Role.toLowerCase().includes(searchValue)
            );
            setuser(searchResults);
        } else {
            setuser(searchData); // Reset to all users when the search query is empty
        }
    };

    return (
        <>
            <div className='flex justify-between items-center pt-2 mx-[8.5rem]'>
                <input type="text" value={Query} onChange={(e) => handserach(e)} placeholder='Name or ID....' className='border p-2 mx-4 dark:bg-[#3f4042] shadow-md font-bold text-gray-600 dark:text-white' />
                <div className='flex items-center gap-3 mr-3'>
                    <Link to={"/adduser"}><button className='bg-[#2980b9] md:w-[90px] md:h-[40px] sm:w-[90px] text-sm rounded-md text-white hover:opacity-70 shadow-md '>Add User</button></Link>
                </div>
            </div>
            <div className='flex flex-col justify-center items-center px-4 mb-[0.9rem] py-2'>

                <p className='text-red-500 text-center '>{msg}</p>
                <div className='lg:max-w-[80%] md:w-full sm:max-w-full h-[67vh] border dark:bg-[#06080F] bg-white shadow-lg overflow-y-auto overflow-x-hidden'>

                    <table className='w-full border-y'>
                        <thead>
                            <tr className='dark:bg-[#3f4042] bg-slate-500 grid grid-cols-8  max-md:text-sm justify-center items-center'>
                                <th className='text-white m-3'></th>
                                <th className='text-white m-3'>Id</th>
                                <th className='text-white m-3'>Name</th>
                                <th className='text-white m-3'>Username</th>
                                <th className='text-white m-3'>Role</th>
                                <th className='text-white m-3'>Password</th>
                                <th className='text-white m-3'>Image</th>
                                <th className='text-white m-3'></th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>

                            {error ? (
                                <tr>
                                    <td className='text-red-600'>Something went wrong!</td>
                                </tr>
                            ) : isLoading ? (
                                <tr>
                                    <td className='text-green-600'>Loading....</td>
                                </tr>
                            ) :
                                users.length === 0 || (users.length === 1 && users[0].Role === 'SuperAdmin' && userRole !== 'SuperAdmin') ? (
                                    <tr>
                                        <td><p className=' text-orange-500'>No data available</p></td>
                                    </tr>
                                ) :

                                    (
                                        users
                                            .filter((userData) => userRole === 'SuperAdmin' || userData.Role !== 'SuperAdmin')
                                            .map((userData) => (

                                                <tr className='dark:bg-[#3f4042] lg:mx-w-full md:text-xl sm:text-sm grid grid-cols-8 items-center justify-center border overscroll-y-auto'
                                                    key={userData.id}
                                                >
                                                    <td><input type="checkbox" id={userData.id}
                                                        onChange={handleChecked}
                                                        checked={userData.isChecked || false}
                                                        hidden={userData.Role=== 'SuperAdmin'}
                                                    /></td>
                                                    <td className='m-2 flex items-center justify-center'>{userData.id}</td>
                                                    <td className='m-2 flex items-center justify-center'>{userData.Name}</td>
                                                    <td className='m-2 flex items-center justify-center md:pr-9 sm:pr-5'>{userData.Role === 'SuperAdmin' ? '*******' : userData.Username}</td>

                                                    <td className='m-2 flex items-center justify-center md:pl-8 sm:pl-3'>{userData.Role}</td>
                                                    <td className='m-2 flex items-center justify-center sm:pr-5'> {userData.id ? '*******' : userData.Password}</td>
                                                    {/* {Image?(
                                                <td><img src={`http://localhost/ugame_project/ugamerphp/UploadUserPictureFolder/${userData.img}`} className="w-[50px] h-[50px] border border-gray-500 shadow-black object-cover"
                                                    alt={userData.Username} /></td>
                                               ):<td><img src={defaultProfileImage} className="w-[50px] h-[50px] border border-gray-500 shadow-black object-cover"
                                               alt={userData.Username} /></td>} */}
                                                    {
                                                        userData.img ? (
                                                            <td>
                                                                <img
                                                                    src={`http://localhost/ugame_project/ugamerphp/UploadUserPictureFolder/${userData.img}`}
                                                                    className="w-[50px] h-[50px] border border-gray-500 shadow-black object-cover"
                                                                    alt={userData.Username}
                                                                />
                                                            </td>
                                                        ) : (
                                                            <td>
                                                                <img
                                                                    src={defaultProfileImage}
                                                                    className="w-[50px] h-[50px] border border-gray-500 shadow-black object-cover"
                                                                    alt={userData.Username}
                                                                />
                                                            </td>
                                                        )
                                                    }

                                                    <td className='m-2 flex items-center justify-center'>

                                                        <div className='flex justify-center items-center gap-2 pr-12'>
                                                            <Link to={'/edituser/' + userData.id}> <button
                                                                style={{
                                                                    backgroundColor: openUpdate ? 'orange' : 'green',
                                                                }}
                                                                className='w-[60px] rounded h-[30px] flex items-center justify-center px-9 text-white bg-green-500 hover:opacity-70'
                                                            >
                                                                Edit
                                                            </button>
                                                                {openUpdate && (
                                                                    <Edituser
                                                                        setOpenUpdate={setOpenUpdate}
                                                                    />
                                                                )}
                                                            </Link>
                                                            <button onClick={() => deleteHandle(userData.id)} className='w-[60px] rounded h-[30px] flex items-center justify-center px-8 text-white bg-red-600 hover:opacity-70'>Delete</button>
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
            <div className='flex items-center gap-3 ml-[9.7rem]'>
                < label>
                    <input type="checkbox" id="allSelected" checked={Array.isArray(users) && !users.some((user) => !user.isChecked)}
                        onChange={handleChecked}
                    />
                    ✔️ Check all</label>

                <span onClick={() => handleRemoveAll()} className='hover:text-red-600 cursor-pointer'>⛔ Delete</span>

            </div>
        </>

    )
}

export default User