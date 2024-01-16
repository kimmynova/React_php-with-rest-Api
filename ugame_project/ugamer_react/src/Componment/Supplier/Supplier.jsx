import React, { useContext, useEffect, useState } from 'react'

import axios from 'axios';
import { Link } from 'react-router-dom';
import { AlertContext } from '../../alertmesengebox/alert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PermPhoneMsgTwoToneIcon from '@mui/icons-material/PermPhoneMsgTwoTone';
import EmailTwoToneIcon from '@mui/icons-material/EmailTwoTone';

const Supplier = () => {
  const [openEmployee, setopenEmployee] = useState(false);

  const [isLoading, setisLoading] = useState(null)
  const [error, setError] = useState("")
  const [msg, setmsg] = useState("")
  const [suppliersData, setsuppliersData] = useState([]);
  const AlertBox = useContext(AlertContext);
  const [serachData, setserachData] = useState([]); //filter
  const [Query, setQuery] = useState("");
  const [numRowsToAdd, setNumRowsToAdd] = useState(1);





  useEffect(() => {
    setisLoading(true);
    fetch('http://localhost/ugame_project/ugamerphp/Supplier/Supplier.php')
        .then(response => response.json())
        .then(data => {
            setTimeout(() => {
                if (data && data.result) {
                    console.log(data)
                    setmsg(data.result);
                } else {
                    setsuppliersData(data);
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
            const res = await axios.delete(`http://localhost/ugame_project/ugamerphp/Supplier/Supplier.php/${id}`);
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
const handserach = (e) => {
    const getsearch = e.target.value.toLowerCase();
    //  console.log(getsearch)
    if (getsearch.length > 0) {
        const searchItemData = suppliersData.filter(
            (item) =>
                item.supName.toLowerCase().includes(getsearch) ||
                item.supid.toLowerCase().includes(getsearch)
                
        );
        setsuppliersData(searchItemData);
    } else {
        setsuppliersData(serachData);
    }
    setQuery(getsearch); // Set Query to the search value
};
/////////////////////removeAllcheck
const handleChecked = (e) => {
    const { id, checked } = e.target;
    if (id === "allSelected") {
        const checkvalueAll = suppliersData.map((supplier) => ({
            ...supplier,
            isChecked: checked,
        }))

        setsuppliersData(checkvalueAll);
        console.log(checkvalueAll);
    } else {
        const checkedValueOne = suppliersData.map((sup) => (
            sup.supid === id ? { ...sup, isChecked: checked } : sup
        ))
        console.log(checkedValueOne);
        setsuppliersData(checkedValueOne);
    }


}
const handleRemoveAll = async (e) => {
    const checkedsupIds = suppliersData
        .filter((supplier) => supplier.isChecked)
        .map((supplier) => supplier.supid)

    if (checkedsupIds.length === 0) {
        setmsg('Please select at least one Employee to delete!');
        return;
    }
    const remove = await AlertBox.Remove();
    if (remove.isConfirmed) {
        try {
            const res = await axios.delete(`http://localhost/ugame_project/ugamerphp/Supplier/DeleteMultipSup.php`,
                { data: { checkedsupIds } } //sent requess array to request body
            );
            if (res.data.ok) {
                setmsg(res.data.ok);
                setsuppliersData((prevsupplier) =>
                    prevsupplier.filter(
                        (supplier) => !checkedsupIds.includes(supplier.supid)
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
    <div className='mt-2 flex items-center justify-between mx-[2.2rem]' >

    <input type="text" value={Query} onChange={(e) => handserach(e)} placeholder='Name or ID....' className='border p-2 dark:bg-gray-500 shadow-md font-bold text-gray-600 dark:text-white' />
    {msg && <div className="text-red-500 pt-3 mr-[8rem]">{msg}</div>}
    <div className='flex items-center gap-3'>
        <Link to={"/addsupplier"}><button className='bg-[#2980b9] md:w-[90px] md:h-[40px] sm:w-[90px] text-sm rounded-md text-white hover:opacity-70 shadow-md '>Add Supplier</button></Link>
    </div>
</div>
<div className='flex justify-center items-center mb-[0.9rem] pt-2  '>
    {/* {openEmployee && <AddEmployee setopenEmployee={setopenEmployee} />} */}

    <div className=' lg:max-w-[95%] md:w-full sm:max-w-full h-[60vh] border bg-white dark:bg-[#06080F] shadow-lg mb-4] overflow-scroll overflow-x-hidden overflow-y-visible'>

        <table className='w-full border-y   '>
            <thead>
                <tr className='dark:bg-[#3f4042] bg-slate-500 grid grid-cols-7 max-md:text-sm justify-center items-center '>
                    <th className='text-white pt-2'></th>
                    <th className='text-white pt-2'>Id</th>
                    <th className='text-white pt-2'>name</th>
                    <th className='text-white pt-2'>Address</th>
                    <th className='text-white pt-2'>Phone</th>
                    <th className='text-white pt-2'>Email</th>
                    <th className='text-white pt-2'>Action</th>
                    <th className='text-white pt-2'></th>
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
                ) : suppliersData.length === 0 ? (
                    <tr><td><p className=' text-orange-500'>No data available</p></td></tr>
                ) :
                    (suppliersData.map((supData) => (
                        <tr className='dark:bg-[#3f4042] lg:mx-w-full md:text-xl sm:text-sm grid grid-cols-7 justify-center items-center border '
                            key={supData.supid}
                        >
                            <td className='flex pt-2 items-center justify-center'>
                                <input type="checkbox" id={supData.supid}
                                    onChange={handleChecked}
                                    checked={supData.isChecked || false}
                                />

                            </td>
                            <td className='flex pt-2 items-center justify-center'>{supData.supid}</td>
                            <td className='flex pt-2 items-center justify-center md:pr-5 sm:pr-5'>{supData.supName}</td>
                            
                            {/* <td className='flex pt-2 items-center justify-center sm:pr-5'>{supData.contact}</td> */}
                            <td className='flex pt-2 items-center justify-center sm:pr-5'>{supData.address}</td>
                            <td><Link to={'/supplierphone/' + supData.supid}><PermPhoneMsgTwoToneIcon /></Link></td>
                            <td><Link to={'/supplieremail/' + supData.supid}><EmailTwoToneIcon /></Link></td>
                            <td className='flex pt-2 items-center justify-center'>
                                <div className='flex justify-center items-center gap-2 mr-8 '>
                                    <Link to={"/editsupplier/" + supData.supid} className='w-[60px] rounded h-[30px] flex items-center justify-center px-9 text-white bg-green-500 hover:opacity-70'>Edit</Link>
                                    <button onClick={() => handleRemove(supData.supid)}
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
<div className='flex items-center gap-3 ml-[5.6rem]'>
    < label>
        <input type="checkbox" id="allSelected" checked={!suppliersData.some((supplier) => !supplier.isChecked)} onChange={handleChecked}
        />
        ✔️ Check all</label>

    <span onClick={() => handleRemoveAll()} className='hover:text-red-600 cursor-pointer'>⛔ Delete</span>

</div>
</>

  )
}

export default Supplier