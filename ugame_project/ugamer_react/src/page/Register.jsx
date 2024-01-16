import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
const Register = () => {
  const [Name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setrole] = useState("");
  const [pass, setPass] = useState("");
  const [compass, setCompass] = useState("");
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");


  const handleinputchange = (e, type) => {
    switch (type) {
      case "Name":
        setError("");
        setName(e.target.value);
        if (e.target.value === "") {
          setError("Name has been left blank");
        }
        break;
      case "username":
        setError("");
        setUsername(e.target.value);
        if (e.target.value === "") {
          setError("Username has been left blank");
        }
        break;
      case "email":
        setError("");
        setEmail(e.target.value);
        if (e.target.value === "") {
          setError("Email has been left blank");
        }
        break;
      case "role":
        setError("");
        setrole(e.target.value);
        if (e.target.value === "") {
          setError("Role has been left blank");
        }
        break;
      case "pass":
        setError("");
        setPass(e.target.value);
        if (e.target.value === "") {
          setError("Password has been left blank");
        }
        break;
      case "compass":
        setError("");
        setCompass(e.target.value);
        if (e.target.value === "") {
          setError("Confirm password has been left blank");
        } else if (e.target.value !== pass) {
          setError("Confirm password does not match");
        }
        break;
      default:
    }
  };
  useEffect(() => {
    setTimeout(function () {
      setMsg("");
    }, 15000);
  }, [msg])
  function checkP() {
    if (pass.length < 5) {
      setError("password is less than 5");
    }
  }
  
  const handlesubmition = (e) => {
    e.preventDefault()
    if (Name !== "" && username !== "" && email !== "" && role !== "" && pass !== "" && compass !== "") {
      var url = "http://localhost/ugame_project/ugamerphp/user.php"; // Fix the URL here
      var headers = {
        "Accept": "application/json",
        "Content-type": "application/json"
      };
      var Data = {
        Name: Name,
        Username: username,
        email: email,
        role: role,
        pass: pass,
        
      }
      fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(Data),
      }).then((response) => response.json())
        .then((data) => {
          setMsg(data[0].result);
        }).catch((err) => {
          setError(err);
          console.log(err);
        });

      setName("");
      setUsername("");
      setEmail("");
      setrole("");
      setPass("");
      setCompass("");
    
    } else {
      setError("All Fields are valid");
    }
  }
  // ////////////////////////////
  const checkuser = () => {
    var url = "http://localhost/ugame_project/ugamerphp/checkuser.php";
    var headers = {
      "Accept": "application/json",
      "Content-type": "application/json"
    };
    var Data = {
    Username:username,
    }
    fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(Data),
    }).then((response) => response.json())
      .then((response) => {
        setMsg(response[0].result);
      }).catch((err) => {
        setError(err);
        console.log(err);
      });


  }
  //////////////////////////////
  // ////////////////////////////
  const checkEmail = () => {
    var url = "http://localhost/ugame_project/ugamerphp/checkemail.php";
    var headers = {
      "Accept": "application/json",
      "Content-type": "application/json"
    };
    var Data = {
      email:email,
    }
    fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(Data),
    }).then((response) => response.json())
      .then((response) => {
        setError(response[0].result);
      }).catch((err) => {
        setError(err); // Log the error message from the API response
        console.log(err);
      });


  }
  //////////////////////////////
  return (
    <div className=' dark:bg-black border bg-white  text-center fixed mt-6  w-[380px] h-[85vh] top-[10%] left-0 right-0 bottom-0 m-auto rounded '> 

      <h1 className='dark:bg-[#3f4042] text-[22px] text-white text-center font-bold py-6 bg-[#2980b9] '>Register form</h1>

      <form className='dark:text-black py-4 h-[480px] rounded '>
        <p className='text-red-600'>
          {
            msg !== "" ?
              <span className='text-green-600'>{msg}</span> :
              <span>{error}</span>
          }
        </p>
        <div className='dark:text-[#fff] flex justify-center items-center flex-col gap-1 '>
          <input className='dark:bg-[#3f4042] w-[300px] border-2 border-black p-2' value={Name} onChange={(e) => handleinputchange(e, "Name")} type="text" placeholder="Name" name="name" />
          <input className='dark:bg-[#3f4042] w-[300px] border-2 border-black p-2' value={username} onBlur={checkuser} onChange={(e) => handleinputchange(e, "username")} type="text" placeholder="Username" name="username" />
          <input className='dark:bg-[#3f4042] w-[300px] border-2 border-black p-2' value={email} onBlur={checkEmail} onChange={(e) => handleinputchange(e, "email")} type="Email" placeholder="Email" name="Email" />
          <input className='dark:bg-[#3f4042] w-[300px] border-2 border-black p-2' value={role} onChange={(e) => handleinputchange(e, "role")} type="text" placeholder="role" name="role" />
          <input className='dark:bg-[#3f4042] w-[300px] border-2 border-black p-2' value={pass} onBlur={checkP} onChange={(e) => handleinputchange(e, "pass")} type="password" placeholder="Password" name="Password" />
          <input className='dark:bg-[#3f4042] w-[300px] border-2 border-black p-2' value={compass} onBlur={checkP} onChange={(e) => handleinputchange(e, "compass")} type="password" placeholder="Comfrim password" name="Comfrimpassword" />
          {/* <Link to={"/"} className='text-[#00fda3] text-[18px] font-semibold'>Back to login?</Link> */}
          <button onClick={handlesubmition} className='text-white flex items-center justify-center bg-[#ff3e3e] w-[300px] rounded-md font-medium my-2 mx-auto py-3 hover:opacity-70'>Signup</button>
        </div>
      </form>
    </div>
  )
}

export default Register