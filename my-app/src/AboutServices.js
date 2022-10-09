import BoxTop from "./components/Box-top"
import Footer from "./components/Footer"
import { Link } from "react-router-dom" 
import Navigation from "./components/Navigation"
import './style.css'

import { Table } from "react-bootstrap"
import { useState , useEffect } from "react"
import { API_GET } from "./api"
import AboutServicesItems from "./AboutServiceItem"

export default function AboutServices (props){

    const [services, setServices] = useState([]);
    const [service_id, setServiceId] = useState(0);
    const [service_name, setServiceName] = useState("");
    const [listServices, setListServices] = useState([]);


    useEffect(() => {
        async function fetchServices() {
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
            
            <div className="container py-5 px-3 bg-light">
                <div className=" header-service mb-5 " >
                    <h4>บริการของเรา</h4>
                </div>
                
                <div className="mt-2">
                    <Table size="sm" responsive bordered hover className='text-center  '>
                        
                                <div className="row thead-service shadow mb-3">
                                    <b className="col-4 border-0 m-auto " >ชื่อบริการ</b>
                                    <b className=" col-4 border-0 m-auto ">ราคา (บาท)</b>
                                    <b className=" col-4 border-0  m-auto ">เวลาที่ใช้ (นาที)</b>
                                </div>
                            
                    </Table>
                    
                                {
                                    services.map(item => (
                                        <AboutServicesItems
                                        data={item}/>
                                    ))
                                } 
                </div>
            </div>
            
            <Footer/>
        </>
    )
}