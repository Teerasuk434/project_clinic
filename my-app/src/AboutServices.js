import BoxTop from "./components/Box-top"
import Footer from "./components/Footer"
import { Link } from "react-router-dom" 
import Navigation from "./components/Navigation"
import './style.css'

import { Table } from "react-bootstrap"
import { useState , useEffect } from "react"
import { API_GET } from "./api"
import AboutServicesItems from "./AboutServiceItem"

export default function AboutServices (){

    const [services, setServices] = useState([]);
    const [service_id, setServiceId] = useState(0);
    const [service_name, setServiceName] = useState("");
    const [listServices, setListServices] = useState([]);


    useEffect(() => {
        async function fetchData() {
            const response = await fetch(
                "http://localhost:8080/api/service",
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        'Content-Type': 'application/json',
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                }
            );

            let json = await response.json();
            setServices(json.data);
            setListServices(json.data);
        }
        fetchServices();

    }, [service_name]);

    const fetchServices = async () => {
        let json = await API_GET("service");
        setServices(json.data);
        setListServices(json.data);
    }

    return(
        <>
            <BoxTop />

            <div className="sticky-top">
                <Navigation />
            </div>
            
            <div className="container py-5 px-3 ">
                <div className=" header-service" >
                    <h4>บริการของเรา</h4>
                </div>
                
                <div className="mt-2">
                    <Table size="sm" responsive bordered hover className='text-center mt-5 '>
                        <thead className="thead-service p-5">
                                <tr>
                                <th>ชื่อบริการ</th>
                                <th>ราคา (บาท)</th>
                                <th>เวลาที่ใช้ (นาที)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    services.map(item => (
                                        <AboutServicesItems
                                        key={item.service_name} 
                                        data={item}
                                            />
                                    ))
                                }
                                    

                            </tbody>
                    </Table>
                </div>
            </div>
            
            <Footer/>
        </>
    )
}