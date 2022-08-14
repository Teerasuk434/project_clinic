import { useEffect, useState } from "react"

export default function EmployeeTypes(){

    const [emp_types,setEmpTypes] = useState([]);


    useEffect( () => {
        async function fetchData(){
            const response = await fetch(
                "http://localhost:8080/api/emp_types",
                {
                    method: "GET",
                    headers:{
                        Accept:"application/json",
                        'Content-Type': 'application/json',
                    }
                }
            );

            let json = await response.json();
            setEmpTypes(json.data);
            // console.log

        }
        fetchData();
    },[]);

    return(
        <>
        <div>
            <h1>ประเภทพนักงาน</h1>
            {
                emp_types.map(item => (
                <div>
                    <h1>{item.emp_position_id}</h1>
                    <h1>{item.emp_position_name}</h1>
                </div>
                )
                )
            }
        </div>
        </>
    )
}