
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'
import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
import Swal from 'sweetalert2';
import { Darkmodes } from '../Darkmode';
import Profile from '../profile/Profile';
import defaultProfileImage from '../Aseset/boy.png';


const Navbar = () => {
  const [clickmenu, setclickmenu] = useState(false);
  const { toggle, darkMode } = useContext(Darkmodes);
  const [img,setimg] = useState("")
  const [msg,setmsg] = useState("")
  const [error,setError] = useState("")
  const [isloading, setloading] = useState(null)
  const navigate = useNavigate();

  const clickmenuhandle = () => {
    setclickmenu(!clickmenu);
  }

  const [userRole, setUserRole] = useState('');
  useEffect(() => {
    // Simulate fetching user role from your authentication system
    const role = localStorage.getItem('UserRole');
    setUserRole(role);
  }, []);

  const getNavItems = () => {
    if (userRole === 'SuperAdmin') {
      return [
        // { label: 'Home', path: '/home' },
        // { label: 'Register', path: '/register' },
        { label: 'User', path: '/user' },
        { label: 'Employee', path: '/Employee' },

        { label: 'Category', path: '/category' },
        { label: 'Product', path: '/showproduct' },
        { label: 'Customer', path: '/showcustomer' },
        { label: 'ViewProduct', path: '/vproduct' },
        { label: 'Invoice', path: '/invoice' },
        { label: 'Supplier', path: '/supplier' },
        { label: 'Purchase', path: '/purchaseorder' },
        { label: 'Report', path: '/report' },
      ]
    }
    else if (userRole === 'HR') {
      return [
        { label: 'Employee', path: '/Employee' },
        { label: 'User', path: '/user' },
        // { label: 'Category', path: '/category' },
        // { label: 'Product', path: '/showproduct' },
        // { label: 'Supplier', path: '/supplier' },
        { label: 'Report', path: '/report' },
      ];
    } else if (userRole === 'Seller') {
      return [
        { label: 'ViewProduct', path: '/vproduct' },
        { label: 'Product', path: '/showproduct' },
        { label: 'Customer', path: '/showcustomer' },
        { label: 'Invoice', path: '/invoice' },
        { label: 'ReportInvoice', path: '/report_invoice' },
       
      ];
    } else if (userRole === 'Stock') {
      return [
        { label: 'Product', path: '/showproduct' },
        { label: 'Purchase', path: '/purchaseorder' },
        { label: 'Supplier', path: '/supplier' },
        { label: 'ReportPurchase', path: '/report_purchase' },
        { label: 'ReportProduct', path: '/report_product' },

      ];
    } else {
      return []
    }

  }
  useEffect(() => {
    // Simulate fetching user role from your authentication system
    const role = localStorage.getItem('UserRole');
    const username = localStorage.getItem('Name');
    setUserRole(role);
    if (role === null||username==null) {
        navigate('*');
        setTimeout(() => {
          localStorage.clear()
          navigate("/")
        }, 2000);
    }
}, []);


  const naviget = useNavigate();

  const ComfirmLogut = () => {
    Swal.fire({
      title: 'You Have Been Logout!',
      icon: 'success',
      color: localStorage.getItem('darkMode') === 'true' ? 'white' : '',
      background: localStorage.getItem('darkMode') === 'true' ? '#555555' : '#fff',
    });
  }
  const logout = async () => {
    const CFR = await Swal.fire({
      title: 'Are you sure?',
      text: "Logout Your Account",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout',
      color: localStorage.getItem('darkMode') === 'true' ? 'white' : '',
      background: localStorage.getItem('darkMode') === 'true' ? '#555555' : '#fff',

    });
    if (CFR.isConfirmed) {
      localStorage.setItem("Login", false); // Update login status
      localStorage.removeItem('Login');
      localStorage.removeItem('UserRole');
      localStorage.removeItem('Name');
      localStorage.removeItem('imageURL');
      setTimeout(() => {
        ComfirmLogut()
        localStorage.setItem("loginStatue", "logout is succeeful"); // Corrected spelling
        naviget("/");
      }, 1500);
    } else {

    }
  }

  const [profile, setprofile] = useState(false);
  const handleopen = () => {
    setprofile(!profile)
  }


  useEffect(() => {
    const storedImageURL = localStorage.getItem('imageURL');
    if (storedImageURL) {
      setimg(storedImageURL);
    } else {
      fetch('http://localhost/ugame_project/ugamerphp/user/login.php')
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0 && data[0].img) {
          
            setimg(data[0].img);
            localStorage.setItem('imageURL', data[0].img);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);



  return (

    <div className='dark:z-[99] z-[99] dark:bg-black dark:text-white dark:duration-1000 duration-1000 ease-out  w-full h-[80px] p-8 border-b shadow-md bg-[#2980b9] flex items-center justify-between gap-2 text-white px-6 print:hidden'>
      <div className='flex items-center justify-center gap-4'>
        <h1 className=' w-full text-3xl font-bold text-[#ffff]'>UGamer.</h1>
        <button className='' onClick={toggle}>
          {darkMode ? (
            <span>
              <WbSunnyTwoToneIcon size={20} /> LightMode
            </span>
          ) : (
            <span>
              <DarkModeTwoToneIcon size={20} /> DarkMode
            </span>
          )}

        </button>
      </div>
      <div className='flex  gap-4'>
        <ul className="hidden md:flex">
          {getNavItems().map((listitem, i) => (
            <li
              className="font-bold p-4 cursor-pointer hover:animate-[wiggle_1s_ease-in-out_infinite] duration-500 rounded hover:underline"
              key={i}
            >
              <Link className=' focus:underline focus:text-[#FF3232] dark:focus:text-green-400' to={listitem.path}>{listitem.label}</Link>
            </li>
          ))}
          {/* <button onClick={logout} className=' flex items-center justify-center bg-[#ff3434] w-[50%] rounded-md font-medium px-2 text-white hover:opacity-70 ml-3'>Logout</button> */}
          
        </ul>
        <div className=' flex items-center justify-center md:ml-0 sm:ml-[16rem] rounded-md font-medium px-2 text-white '>
          {img ? ( 
          <img onClick={() => handleopen()} className='object-cover shadow rounded-full md:w-[60px]  h-[60px]' src={`http://localhost/ugame_project/ugamerphp/UploadUserPictureFolder/${img}`} alt="User Profile" />
        ):<img onClick={() => handleopen()} className='object-cover  rounded w-[60px] h-[60px]'src={defaultProfileImage} alt='Non profile'/>}
            {profile ? <Profile handleopen={handleopen} /> : null}
          </div>
      </div>
      <div onClick={clickmenuhandle} className=' block md:hidden '>
        {clickmenu ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <div className={clickmenu ? 'fixed left-0 top-0 xl:w-[25%] md:w-[45%] sm:w-[50%] h-full border-r border-r-gray-900 dark:bg-[#3f4042] bg-[#2980b9] ease-out duration-500' : 'fixed left-[-100%]'}>
        <div className='flex items-center'>

          <h1 className=' w-full text-3xl font-bold  text-[#ffffff] m-4'>UGamer.</h1>
          <button className='mx-7 mt-2' onClick={toggle} >
            {darkMode ? (
              <span>
                <WbSunnyTwoToneIcon size={20} /> LightMode
              </span>
            ) : (
              <span>
                <DarkModeTwoToneIcon size={20} /> DarkMode
              </span>
            )}

          </button>
          <button onClick={clickmenuhandle} className='md:block hidden border bg-red-500 rounded p-2 mx-3'>
            {clickmenu ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
          </button>

        </div>
        <div className='dark:bg-[#3f4042]'>
          
          <ul className='uppercase p-4 mx-6  '>

            {getNavItems().map((listitem, i) => (
              <li className='hover:bg-red-500 rounded my-6 border-b' key={i}>
                <Link to={listitem.path}>{listitem.label}</Link>
              </li>
            )
            )}

          </ul>
        </div>
        <button onClick={logout} className=' flex items-center justify-center bg-[#ff0000] w-[90%] rounded-md font-medium py-2 text-white hover:opacity-70 ml-3'>Logout</button>
      </div>

    </div>
  );
}

export default Navbar;







// import React, { useContext, useEffect, useState } from 'react';
// import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
// import { Link, useNavigate } from 'react-router-dom'
// import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'
// import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';
// import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
// import Swal from 'sweetalert2';
// import { Darkmodes } from '../Darkmode';
// import Profile from '../profile/Profile';
// import defaultProfileImage from '../Aseset/boy.png';

// const Navbar = () => {
//   const [clickmenu, setclickmenu] = useState(false);
//   const { toggle, darkMode } = useContext(Darkmodes);
//   const [img,setimg] = useState("")
//   const [msg,setmsg] = useState("")
//   const [error,setError] = useState("")
//   const [isloading, setloading] = useState(null)


//   const clickmenuhandle = () => {
//     setclickmenu(!clickmenu);
//   }

//   const [userRole, setUserRole] = useState('');
//   useEffect(() => {
//     // Simulate fetching user role from your authentication system
//     const role = localStorage.getItem('UserRole');
//     setUserRole(role);
//   }, []);

//   const getNavItems = () => {
//     if (userRole === 'SuperAdmin') {
//       return [
//         // { label: 'Home', path: '/home' },
//         // { label: 'Register', path: '/register' },
//         { label: 'User', path: '/user' },
//         { label: 'Employee', path: '/Employee' },

//         { label: 'Category', path: '/category' },
//         { label: 'Product', path: '/showproduct' },
//         { label: 'Customer', path: '/showcustomer' },
//         { label: 'ViewProduct', path: '/vproduct' },
//         { label: 'Invoice', path: '/invoice' },
//         { label: 'Supplier', path: '/supplier' },
//         { label: 'Purchase', path: '/purchaseorder' },
//         { label: 'Report', path: '/report' },
//       ]
//     }
//     else if (userRole === 'Admin') {
//       return [
//         { label: 'User', path: '/user' },
//         { label: 'Employee', path: '/Employee' },
//         { label: 'Category', path: '/category' },
//         { label: 'Product', path: '/showproduct' },
//         { label: 'Report', path: '/report' },
//       ];
//     } else if (userRole === 'Seller') {
//       return [
//         { label: 'ViewProduct', path: '/vproduct' },
//         { label: 'Customer', path: '/showcustomer' },
//         { label: 'Invoice', path: '/invoice' },
//         // { label: 'Purchase', path: '/purchaseorder' },
//         // { label: 'Supplier', path: '/supplier' },
//       ];
//     } else if (userRole === 'Stock') {
//       return [
//         { label: 'Purchase', path: '/purchaseorder' },
//         { label: 'Supplier', path: '/supplier' },

//       ];
//     } else {
//       return []
//     }

//   }
//   const naviget = useNavigate();



//   const ComfirmLogut = () => {
//     Swal.fire({
//       title: 'You Have Been Logout!',
//       icon: 'success',
//       color: localStorage.getItem('darkMode') === 'true' ? 'white' : '',
//       background: localStorage.getItem('darkMode') === 'true' ? '#555555' : '#fff',
//     });
//   }
//   const logout = async () => {
//     const CFR = await Swal.fire({
//       title: 'Are you sure?',
//       text: "Logout Your Account",
//       icon: 'info',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Yes, Logout',
//       color: localStorage.getItem('darkMode') === 'true' ? 'white' : '',
//       background: localStorage.getItem('darkMode') === 'true' ? '#555555' : '#fff',

//     });
//     if (CFR.isConfirmed) {
//       localStorage.setItem("Login", false); // Update login status
//       localStorage.removeItem('Login');
//       localStorage.removeItem('UserRole');
//       localStorage.removeItem('Name');
//       localStorage.removeItem('imageURL');
//       setTimeout(() => {
//         ComfirmLogut()
//         localStorage.setItem("loginStatue", "logout is succeeful"); // Corrected spelling
//         naviget("/");
//       }, 1500);
//     } else {

//     }
//   }

//   const [profile, setprofile] = useState(false);
//   const handleopen = () => {
//     setprofile(!profile)
//   }


//   useEffect(() => {
//     const storedImageURL = localStorage.getItem('imageURL');
//     if (storedImageURL) {
//       setimg(storedImageURL);
//     } else {
//       fetch('http://localhost/ugame_project/ugamerphp/user/login.php')
//         .then((response) => response.json())
//         .then((data) => {
//           if (data.length > 0 && data[0].img) {
          
//             setimg(data[0].img);
//             localStorage.setItem('imageURL', data[0].img);
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   }, []);



//   return (

//     <div className=' dark:bg-black dark:text-white dark:duration-1000 duration-1000 ease-out sticky top-0 w-full h-[80px] p-8 border-b shadow-md bg-[#2980b9] flex  justify-between items-center  gap-2 text-white px-6 print:hidden'>
//       <div className='flex items-center justify-between gap-4'>
//         <h1 className=' w-full text-3xl font-bold text-[#ffff]'>UGamer.</h1>
       
//       </div>
     
//         <div className='flex items-center justify-center gap-7'>
//         <div onClick={clickmenuhandle} className=' block '>
//        {clickmenu ? <AiOutlineClose size={28} /> : <AiOutlineMenu size={28} />}
//         </div>

//         <button className='' onClick={toggle}>
//           {darkMode ? (
//             <span>
//               <WbSunnyTwoToneIcon size={20} />  Light Mode
//             </span>
//           ) : (
//             <span>
//               <DarkModeTwoToneIcon size={20} />  Dark Mode
//             </span>
//           )}

//         </button>
//         {img ? ( 
//           <img onClick={() => handleopen()} className='object-cover shadow rounded-full w-[60px] h-[60px]' src={`http://localhost/ugame_project/ugamerphp/UploadUserPictureFolder/${img}`} alt="User Profile" />
//         ):<img onClick={() => handleopen()} className='object-cover rounded w-[60px] h-[60px]'src={defaultProfileImage} alt='Non profile'/>}
//             {profile ? <Profile handleopen={handleopen} /> : null}
         
//             </div>
//       <div className={clickmenu ? 'fixed left-0 top-0 xl:w-[25%] md:w-[45%] sm:w-[50%] h-full border-r border-r-gray-900 dark:bg-[#3f4042] bg-[#2980b9] ease-out duration-500' : 'fixed left-[-100%]'}>
//         <div className='flex items-center'>

//           <h1 className=' w-full text-3xl font-bold  text-[#ffffff] m-4'>UGamer.</h1>
//           {/* <button className='mx-7 mt-2' onClick={toggle} >
//             {darkMode ? (
//               <span>
//                 <WbSunnyTwoToneIcon size={20} />LightMode
//               </span>
//             ) : (
//               <span>
//                 <DarkModeTwoToneIcon size={20} />DarkMode
//               </span>
//             )}

//           </button>
//           <button onClick={clickmenuhandle} className='md:block hidden border bg-red-500 rounded p-2 mx-3'>
//             {clickmenu ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
//           </button> */}
//         </div>
//         <div className=''>
//           <ul className='uppercase p-4 mx-6  '>
//             {getNavItems().map((listitem, i) => (
//               <li className='hover:bg-red-500 rounded my-6 border-b' key={i}>
//                 <Link to={listitem.path}>{listitem.label}</Link>
//               </li>
//             )
//             )}
//  <button onClick={logout} className=' flex items-center justify-center bg-[#ff0000] w-[100%] rounded-md font-medium py-2 text-white hover:opacity-70'>Logout</button>
//           </ul>
//         </div>
       
//       </div>

//     </div>
//   );
// }

// export default Navbar;
