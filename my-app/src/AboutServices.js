import BoxTop from "./components/Box-top"
import Footer from "./components/Footer"
import Navigation from "./components/Navigation"
import './style.css'
import { useState , useEffect } from "react"
import { API_GET } from "./api"
import AboutServicesItems from "./AboutServiceItem"

export default function AboutServices (props){

    const [services, setServices] = useState([]);

    useEffect(() => {
       fetchServices();
    }, []);

    const fetchServices = async () => {
        let json = await API_GET("service");
        setServices(json.data);
    }

    return(
        <>
            <BoxTop />

            <div className="sticky-top">
                <Navigation />
            </div>
            
            <div className="container py-5 bg-light">
                <div className=" header-service mb-5 " >
                    <h4>บริการของเรา</h4>
                </div>
                
                <div className="mt-2 text-center">
                        
                    <div className="row thead-service shadow mb-3">
                        <b className="col-4 border-0 m-auto " >ชื่อบริการ</b>
                        <b className=" col-2 border-0 m-auto ">ราคา (บาท)</b>
                        <b className=" col-3 border-0 m-auto ">ค่ามัดจำ (บาท)</b>
                        <b className=" col-3 border-0  m-auto ">เวลาที่ใช้ (นาที)</b>
                    </div>        
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