// import { useEffect, useState } from "react";
// import { Navigate, Link } from "react-router-dom";
import Customer from './components/customer/Customer';
import Owner from './components/owner/Owner';
import Employee from './components/employee/Employee';
import Admin from './components/admin/Admin';
import { useEffect, useState } from 'react';


export default function Home() {             

    let [role_id, setRoleId] = useState(0);
    // let role_id = localStorage.getItem("role_id")
    let username = localStorage.getItem("username")

    useEffect(() =>{
        checkRole()
    },[])

    const checkRole = async () => {
        const response = await fetch(
            "http://localhost:8080/home",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username
                })
            }
        );
        const data = await response.json();
        // console.log(data)
        setRoleId(data.data)    
    }

    return (
        <>  
            {role_id == 1 && (<Customer />)}
            {role_id == 2 && (<Owner />)}
            {role_id == 3 && (<Employee />)}
            {role_id == 4 && (<Admin />)}
        </>
    );    
}