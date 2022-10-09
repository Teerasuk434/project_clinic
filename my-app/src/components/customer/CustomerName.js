import { useState,useEffect } from "react";
import { API_GET } from "../../api";

export default function CustName() {

    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    
    useEffect(()=>{

        let user_id = localStorage.getItem("user_id")
    
        async function fetchData(){
            let json = await API_GET("customer/" + user_id);
            setFirstName(json.data[0].cust_fname);
            setLastName(json.data[0].cust_lname);
        }
        fetchData();

    },[])
    
    return (
        <h5 className="text-center mt-3">{firstName} {lastName}</h5>
    )
}