import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "./Sidebar";
import AdminContent from "./AdminContent";
import './Admin.css'
import { useEffect, useState } from "react"

export default function EmpTypeMain(){

    const [emp_types,setEmpTypes] = useState([]);
    let date = new Date().toLocaleDateString();

    let pages = 4;


    // useEffect( () => {
    //     async function fetchData(){
    //         const response = await fetch(
    //             "http://localhost:8080/api/emp_types",
    //             {
    //                 method: "GET",
    //                 headers:{
    //                     Accept:"application/json",
    //                     'Content-Type': 'application/json',
    //                 }
    //             }
    //         );

    //         let json = await response.json();
    //         setEmpTypes(json.data);
    //         // console.log

    //     }
    //     fetchData();
    // },[]);

    return(
        <>
            <div className="Main">
                <div className='top row'>
                    <div className='col'>
                        สถานะ : แอดมิน
                    </div>
                </div>

                <div className='row'>
                    <div className='p-0 col-12 col-lg-2 bg-primary'>
                        <div className='sidebar'>
                            <Sidebar pages={pages}/>
                        </div>
                    </div>
                    
                    <div className='p-0 m-0 col-12 col-lg-10'>
                        <div className="content">
                            <AdminContent pages={pages}/>
                        </div>
                    </div>
                </div>

            
                <div className="row">              
                    <div className='bottom'>
                        <div>
                            <p>วันที่ : {date}</p>
                        </div>
                    </div>
                </div>
                    
            </div>
        </>
    )
}