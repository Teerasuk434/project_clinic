import MainOwner from './components/owner/MainOwner';
import MainEmployee from './components/employee/MainEmployee';
import MainAdmin from './components/admin/MainAdmin';
import { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';

export default function Home() {             

    let [role_id, setRoleId] = useState(0);
    let username = localStorage.getItem("username")

    let navigate = useNavigate();

    useEffect(() =>{
        async function fetchData() {
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

            if(data.result == false){
                navigate("/login", { replace: true });
            }else {
                setRoleId(data.data);
                checkRole(data.data);
                console.log(data.data);
            }

        }
        fetchData();
    },[]);

    const checkRole = (id)=>{
        if (id === 1){
            navigate("/", { replace: true });
        }
    }

    return (
        <>  
            {role_id === 2 && (<MainOwner />)}
            {role_id === 3 && (<MainEmployee />)}
            {role_id === 4 && (<MainAdmin />)}
            
        </>
    );    
}