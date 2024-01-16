import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MAX_LOGIN_ATTEMPTS = 3;
const LOGIN_TIMEOUT = 78000; // 60 seconds

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(
    JSON.parse(localStorage.getItem('username')) || ''
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const login = localStorage.getItem('Login');
    if (login) {
      navigate('/home');
    }

    const storedUserLoginAttempts = JSON.parse(

      localStorage.getItem(`loginAttempts_${username}`)
    );


    if (storedUserLoginAttempts) {
      const { attempts, timestamp } = storedUserLoginAttempts;
      const currentTime = new Date().getTime();

      const timeDifference = timestamp + LOGIN_TIMEOUT - currentTime;

      if (attempts >= MAX_LOGIN_ATTEMPTS && timeDifference > 0) {
        setRemainingTime(Math.ceil(timeDifference / 1000));
        setError(
          `Login attempts exceeded. Try again in ${Math.ceil(
            timeDifference / 1000
          )} seconds.`
        );
      } else {
        // Reset login attempts if the timeout has expired
        localStorage.removeItem(`loginAttempts_${username}`);
      }
    }
  }, [navigate, username]);

  const handleInputChange = (e, type) => {
    e.preventDefault();
    setError('');
    if (type === 'username') {
      setUsername(e.target.value);
    } else if (type === 'password') {
      setPassword(e.target.value);

    }
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    if (username !== '' && password !== '') {
      const storedUserLoginAttempts = JSON.parse(
        localStorage.getItem(`loginAttempts_${username}`)
      );

      if (storedUserLoginAttempts) {
        const { attempts, timestamp } = storedUserLoginAttempts;
        const currentTime = new Date().getTime();
        const timeDifference = timestamp + LOGIN_TIMEOUT - currentTime;

        if (attempts >= MAX_LOGIN_ATTEMPTS && timeDifference > 0) {
          const remainingTimeInSeconds = Math.ceil(timeDifference / 1000);

          if (remainingTimeInSeconds > 0) {
            const minutes = Math.floor(remainingTimeInSeconds / 60);
            const seconds = remainingTimeInSeconds % 60;
            setError(
              `Login attempts exceeded. Try again in ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.`
            );
            return; // Prevent login when there is remaining time
          }
        }
      }

      const url = 'http://localhost/ugame_project/ugamerphp/user/login.php';
      const headers = {
        Accept: 'application/json',
        'Content-type': 'application/json',
      };
      const data = {
        username: username,
        password: password,
      };

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data),
        });
        const result = await response.json();

        if (result[0].result === 'login successful! redirecting...') {
          // Set the user's role in local storage
          localStorage.setItem('UserRole', result[0].role);
          setMsg(result[0].result);
          localStorage.setItem('Name', result[0].Name);
          localStorage.setItem('imageURL',result[0].img)
          localStorage.setItem('Login', true);

          // Reset login attempts for the user
          localStorage.removeItem(`loginAttempts_${username}`);

          setTimeout(() => {
            navigate('/home');
          }, 3000);
        } else {
          // Update login attempts for the user
          const storedUserLoginAttempts = JSON.parse(
            localStorage.getItem(`loginAttempts_${username}`)
          );
          let updatedUserLoginAttempts = {
            attempts: 1,
            timestamp: new Date().getTime(),
          };

          if (storedUserLoginAttempts) {
            updatedUserLoginAttempts = {
              attempts: storedUserLoginAttempts.attempts + 1,
              timestamp: storedUserLoginAttempts.timestamp,
            };
          }

          localStorage.setItem(
            `loginAttempts_${username}`,
            JSON.stringify(updatedUserLoginAttempts)
          );

          if (updatedUserLoginAttempts.attempts >= MAX_LOGIN_ATTEMPTS) {
            const timeDifference =
              updatedUserLoginAttempts.timestamp +
              LOGIN_TIMEOUT -
              new Date().getTime();
            const remainingTimeInSeconds = Math.ceil(timeDifference / 1000);

            if (remainingTimeInSeconds < 60) {
              setError(
                `Login attempts exceeded. Try again in ${String(remainingTimeInSeconds).padStart(2, '0')} second(s).`
              );
            } else {
              const remainingMinutes = Math.floor(remainingTimeInSeconds / 60);
              const remainingSeconds = remainingTimeInSeconds % 60;

              setError(
                `Login attempts exceeded. Try again in ${String(remainingMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}.`
              );
            }
          } else {
            setError(result[0].result);
          }
        }
      } catch (err) {
        setError(err.message);
        console.log(err);
      }
    } else {
      setError('All Fields are required');
    }
    setPassword("");
  };

  return (
    <div className="text-center shadow dark:text-black bg-white w-[380px] h-[480px] absolute top-0 left-0 right-0 bottom-0 m-auto ]">
      <h1 className="text-[22px] text-white text-center font-bold py-6 bg-[#2980b9]">
        Login form
      </h1>
      <form className="py-14 border h-[400px] rounded">
        <div className="flex justify-center items-center flex-col gap-4">
          <div className="text-red-600 pt-[-6]">
            {error !== '' ? <span>{error}</span> : <span className="text-green-600">{msg}</span>}
          </div>
          <input
            className="w-[300px] border-2 border-black p-2"
            type="text"
            value={username}
            onChange={(e) => handleInputChange(e, 'username')}
            placeholder="Username"
            name="username"
            autoComplete='off'
          />
          <input
            className="w-[300px] border-2 border-black p-2"
            type="password"
            value={password}
            onChange={(e) => handleInputChange(e, 'password')}
            placeholder="Password"
            name="Password"
          />
          {/* <Link className="text-[#00fda3] text-[18px] font-semibold" to="/Register">
            Create New Account
          </Link> */}
        </div>
        <button
          onClick={loginSubmit}
          className="flex items-center justify-center bg-[#2980b9] w-[300px] rounded-md my-6 mx-auto py-3 text-white hover:opacity-70"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
