import Navigation from './components/Navigation';
import BoxTop from './components/Box-top';
import Footer from './components/Footer';
import './style.css'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function Homepage(){

    const [services, setServices] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(
                "http://localhost:8080/api/service",
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        'Content-Type': 'application/json'
                    }
                }
            );

            let json = await response.json();
            setServices(json.data);
        }

        fetchData();
    }, []);

    return (
        <>  
            <BoxTop />

            <div className="sticky-top">
                <Navigation />
            </div>
            
            <div className="container">
                <div className='homepage-picture py-5 px-3 '>
                    <img src={`http://localhost:8080/images/Appointment1.png`} width={"100%"} alt=""/>
                    <Link className="btn btn-appointment" to="/appointment">นัดหมายบริการ</Link>
                </div>

                <div className="Services px-5 py-3">
                    <h1 className="Text-title">บริการของคลินิก</h1>
                    <div className="row my-4 text-center">
                        {
                            services.map(item => (
                                <div className="col-6 col-md-3 mt-4 box-service-name"  key={item.service_id}>
                                    <div>
                                        <div className="pt-3">
                                            <img className="img-service" src={`http://localhost:8080/images/${item.service_image}`} alt=""/>

                                        </div>
                                        <h6 className='mt-3 fs-4'>{item.service_name}</h6>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="text-center my-3">
                        <Link to="/service  " className='btn btn-service-dt btn-lg'>ดูข้อมูลเพิ่มเติม</Link>
                    </div>
                </div>
            </div>

            <Footer/>
        </>
    )
}