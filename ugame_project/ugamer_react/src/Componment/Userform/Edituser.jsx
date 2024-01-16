import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertContext, msgbox } from '../../alertmesengebox/alert';

const Edituser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedproductType, setSelectedproductType] = useState([]);
  const [formvalue, setFormvalue] = useState({
    id: '',
    Name: '',
    Username: '',
    Role: '',
    Password: '',
    compass: '',
    img: null,
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
      setFormvalue({ ...formvalue, [e.target.name]: e.target.value });
    }
  };




  useEffect(() => {
    const productRowData = async () => {
      try {
        const response = await axios.get(`http://localhost/ugame_project/ugamerphp/user/user.php/${id}`);
        if (response.data) {
          setFormvalue({
            id: response.data.id,
            Name: response.data.Name,
            Username: response.data.Username,
            Role: response.data.Role,
            Password: response.data.Password,
            img: response.data.img
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
      formData.append("id", formvalue.id);
      formData.append("Name", formvalue.Name);
      formData.append("Username", formvalue.Username);
      formData.append("Role", formvalue.Role);
      formData.append("Password", formvalue.Password)
      if (formvalue.img !== null) {
        formData.append("img", formvalue.img);
      }

      try {
        const response = await axios.post(
          `http://localhost/ugame_project/ugamerphp/user/updateuser.php/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
            },
          }
        );
        console.log(response);
        if (response.data.success) {
          setmsg("User updated successfully");
          setFormvalue({ ...formvalue, ...response.data.updatedData });
          setTimeout(() => {
            Alertbox.save()
            navigate("/user")
          }, 1500);
        } else {
          setmsg("Error updating user");
        }
      } catch (error) {
        console.error('Error:', error);
        setmsg("Error updating user");
        Alertbox.error();
      }
    } else if (alert.isDenied) {
      Alertbox.unsave();
    }

  };


  // useEffect(() => {
  //     fetch('http://localhost/ugame_project/ugamerphp/user/user.php')
  //         .then(response => response.json())
  //         .then(data => setSelectedproductType(data))
  //         .catch(err => {
  //             setSelectedproductType(err);
  //             console.log(err);
  //         });

  // }, []);

  return (
    <div className='absolute z-[999] inset-0 flex items-center justify-center'>
      <Link to='/user'>
        <div className='fixed top-0 left-0 w-screen h-screen bg-black opacity-80'></div>
      </Link>
      <div className='md:absolute border border-gray-500 dark:bg-[#06080F] bg-white max-w-md h-[90vh] top-4 right-0 left-0 bottom-0 m-auto relative'>
        <Link to='/user'>
          <button className='bg-red-600 w-[55px] h-[56px] rounded text-white hover:bg-green-600 absolute top-0 right-0'>X</button>
        </Link>
        <div className='dark:bg-[#06080F] flex items-center justify-center'>
          <form className='w-[60%] mx-5 flex items-center justify-center flex-col gap-1'>
            <h3 className='dark:bg-[#3f4042] bg-[#2980b9] text-white w-[450px] h-[9vh] text-center pt-3 text-2xl'>Edit</h3>
            {msg && <div className="text-green-500 pt-3">{msg}</div>}
            <label className='text-left'>
              Name:
              <input
                className='dark:bg-[#3f4042] w-[300px] h-[10%] rounded-md border-2 p-2 border-gray-400'
                onChange={handleInput}
                value={formvalue.Name}
                name='Name'
              />
            </label>
            <label className='text-left'>
              Username:
              <input
                className='dark:bg-[#3f4042] w-[300px] h-[10%] rounded-md border-2 p-2 border-gray-400'
                onChange={handleInput}
                value={formvalue.Username}
                name='Username'
              />
            </label>
            <label className='text-left'>
              Role:
              <select
                name='Role'
                onChange={(e) => handleInput(e)}
                value={formvalue.Role}
                className='dark:bg-[#3f4042] w-[300px] h-[10%] rounded-md border-2 p-2 border-gray-400'
              >
                <option value={formvalue.Role}>{formvalue.Role}</option>
                {/* {selectedproductType.map((role) => (
                                    <option key={role.Name} value={role.Role}>
                                        {role.role}
                                    </option>
                                ))} */}
                <option value="HR">HR</option>
                <option value="Seller">Seller</option>
                <option value="Stock">Stock</option>
              </select>
            </label>
            <label className='text-left'>
              Password:
              <input
                type='password'
                className='dark:bg-[#3f4042] w-[300px] h-[10%] rounded-md border-2 p-2 border-gray-400'
                onChange={handleInput}
                value={formvalue.Password}
                name='Password'
              />
            </label>



            <label className='text-left'>
              {previewImages && formvalue.img && (
                <img
                  src={previewImages[0] || `http://localhost/ugame_project/ugamerphp/UploadUserPictureFolder/${formvalue.img}`}
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
}

export default Edituser