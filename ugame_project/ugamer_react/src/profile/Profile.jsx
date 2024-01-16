import React, { useContext, useEffect, useState } from 'react'
import img from '../Aseset/boy.png'
import { AlertContext } from '../alertmesengebox/alert'
import { useNavigate } from 'react-router';
import defaultProfileImage from '../Aseset/boy.png';
const Profile = ({handleopen}) => {
const Alertbox = useContext(AlertContext);
const naviget = useNavigate();
const userRole = localStorage.getItem("UserRole")
const userName = localStorage.getItem("Name")
const [img,setimg] = useState("")
const [msg,setmsg] = useState("")
const [error,setError] = useState("")
const [isloading, setloading] = useState(null)


const ConfirmLogout = async () => {
    const dailbox = await Alertbox.logoutmsg();
    if (dailbox.isConfirmed) {
        localStorage.setItem("Login", false); // Update login status
      localStorage.removeItem('Login');
      localStorage.removeItem('UserRole');
      localStorage.removeItem('Name');
      localStorage.removeItem('imageURL');
      setTimeout(() => {
        localStorage.setItem("loginStatue", "logout is succeeful"); 
        Alertbox.logoutsuccess()
        naviget("/");
      }, 1500);
    }
    // You can handle the case where the user cancels the logout if needed
  };
  
    

useEffect(() => {
    const storedImageURL = localStorage.getItem('imageURL');

    if (storedImageURL) {
      // If the image URL is found in localStorage, use it to display the image.
      setimg(storedImageURL);
    } else {
      fetch('http://localhost/ugame_project/ugamerphp/user/login.php')
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0 && data[0].img) {
            // Check if the response contains image data
            setimg(data[0].img);
            // Store the image URL in localStorage for future use
            localStorage.setItem('imageURL', data[0].img);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
// useEffect(() => {
//     const storedImageURL = localStorage.getItem('imageURL');

//     if (storedImageURL) {
//       setimg(storedImageURL);
//     } else {
//       setloading(true);
//       fetch('http://localhost/ugame_project/ugamerphp/user/login.php')
//         .then((response) => response.json())
//         .then((data) => {
//           setloading(false);
//           if (data.length > 0 && data[0].img) {
//             setimg(data[0].img);
//             localStorage.setItem('imageURL', data[0].img);
//           } else {
//             setimg(defaultProfileImage);
//           }
//         })
//         .catch((err) => {
//           setloading(false);
//           setError(err);
//           console.log(err);
//         });
//     }
//   }, []);


  return (
    <div onClick={handleopen} className=' dark:bg-black  fixed top-[9%] right-0 bottom-0 border rounded w-[30vh] h-[40vh] bg-white shadow mx-2 py-2'>
        <div className=' text-black dark:text-white flex items-center flex-col'>
        {img ? ( // Check if img is available
          <img className='object-cover shadow rounded-full w-[60px] h-[60px]' src={`http://localhost/ugame_project/ugamerphp/UploadUserPictureFolder/${img}`} alt="User Profile" />
        ):<img className='object-cover rounded-full w-[60px] h-[60px]' src={defaultProfileImage} alt='Non profile'/>}          
        {/* {isloading ? (
          <div>Loading...</div>
        ) : (
          <img className='object-cover rounded-full w-[60px] h-[60px]' src={img} alt="User Profile" />
        )} */}
                <ul className=' text-center flex justify-center items-center flex-col'>
                    <li className='p-2'> Name:<span className=' text-green-500'> {userName}</span></li>
                    <li className='p-2'>Role: <span className=' text-green-500'> {userRole}</span></li>
                    <button onClick={ConfirmLogout}  className=' flex items-center justify-center bg-[#ff0000] px-6 rounded-md font-medium py-2 text-white hover:opacity-70 '>Logout</button>
                </ul>
                  
            </div>
        </div>
  )
}


export default Profile