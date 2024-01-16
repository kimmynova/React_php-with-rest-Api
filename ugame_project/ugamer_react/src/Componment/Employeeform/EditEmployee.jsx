import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AlertContext } from '../../alertmesengebox/alert';

const EditEmployee = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [formvalue, setFormvalue] = useState({ id: '', empName: '', Gender: '', dob: '', role: '', address: '' });
  const [msg, setmsg] = useState('');
  const Alertbox = useContext(AlertContext);

  const handleInput = (e) => {
    setFormvalue({ ...formvalue, [e.target.name]: e.target.value });
  }
  useEffect(() => {
    const userRowdata = async () => {
      const getempdata = await fetch("http://localhost/ugame_project/ugamerphp/Employee/Employee.php/" + id);
      const resemployeedata = await getempdata.json();
      setFormvalue(resemployeedata);

    }
    userRowdata();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const dialogbox = await Alertbox.msgbox()
    if (dialogbox.isConfirmed) {

      const formData = {
        empUpdate: {
          id: id,
          empName: formvalue.empName,
          Gender: formvalue.Gender,
          dob: formvalue.dob,
          role: formvalue.role,
          address: formvalue.address
        }
      };

      try {
        const res = await axios.put("http://localhost/ugame_project/ugamerphp/Employee/Employee.php/" + id, formData);
        if (res.data.success) {
          setmsg(res.data.success);
          Alertbox.save();
          setTimeout(() => {
            navigate('/employee');
          }, 2000);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    } else if (dialogbox.isDenied) {
      setTimeout(() => {
        Alertbox.unsave();
        navigate('/employee');
      }, 500);
    }
  }
  return (
    <div className='absolute z-[999] inset-0 flex items-center justify-center'>
      <Link to={'/employee'}> <div className='fixed top-0 left-0 w-screen h-screen bg-black opacity-80'>

      </div> </Link>
      <div className='md:absolute border border-gray-500 dark:bg-[#06080F]  bg-white max-w-md h-[90vh] top-4 right-0 left-0 bottom-0 m-auto relative '>
        <Link to={'/employee'} ><button className='bg-red-600  w-[55px] h-[56px] rounded text-white hover:bg-green-600 absolute top-0 right-0'>X</button></Link>
        <div className='dark:bg-[#06080F] flex items-center justify-center'>
          <form className='w-[60%] mx-5 flex items-center justify-center flex-col  gap-1 '>
            <h3 className='dark:bg-[#3f4042] bg-[#2980b9] text-white w-[450px] h-[9vh] text-center pt-3 text-2xl'>Edit</h3>
            {/* {error && <div className="text-red-500 pt-3">{error}</div>} */}
            {msg && <div className="text-green-500 pt-3">{msg}</div>}

            {/* <label className='text-left '>id: <input className='dark:bg-[#3f4042] w-[300px] h-[10%] rounded-md border-2 p-2 border-gray-400'
        onChange={handleInput} value={formvalue.id}  /></label> */}
            <label className='text-left '>Name: <input className='dark:bg-[#3f4042] w-[300px] h-[10%] rounded-md border-2 p-2 border-gray-400'
              onChange={handleInput} value={formvalue.empName} name='empName' /></label>
            <label className='text-left '>Gender:
              <select
                className='dark:bg-[#3f4042] w-[300px] h-[10%] rounded-md border-2 p-2 border-gray-400'
                onChange={handleInput} value={formvalue.Gender} name='Gender' >
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
              </select>
            </label>
            <label className='text-left '>Role
              <select className='dark:bg-[#3f4042] w-[300px] h-[10%] rounded-md border-2 p-2 border-gray-400'
                onChange={handleInput} value={formvalue.role} name='role'
              >
                <option value='HR'>HR</option>
                <option value='Seller'>Seller</option>
                <option value='Stock'>Stock</option>
              </select></label>
            <label className='text-left '>Date of brith: <input className='dark:bg-[#3f4042] w-[300px] h-[10%] rounded-md border-2 p-2 border-gray-400'
              onChange={handleInput} value={formvalue.dob} name='dob' type='date' /></label>
            <label className='text-left '>Address: <input className='dark:bg-[#3f4042] w-[300px] h-[10%] rounded-md border-2 p-2 border-gray-400'
              onChange={handleInput} value={formvalue.address} name='address' /></label>
            <button onClick={handleSubmit} className=' flex items-center bg-red-600 px-8 py-1 rounded text-white m-1 hover:bg-green-600'>Update</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditEmployee