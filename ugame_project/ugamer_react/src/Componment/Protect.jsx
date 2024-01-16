import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Protected(props) {
    const naviget = useNavigate();
    const { Component } = props; // Use correct spelling 'Component' instead of 'Componet'

   useEffect(() => {
    let login = localStorage.getItem("Login");
    if (!login) {
        localStorage.setItem("loginStatue", "Please login to view dashboard!");
        naviget("/", { replace: true });
       
    }
}, []);

    

    return (
        <Component /> // Render the wrapped component
    );
}

export default Protected;
