import Navigation from './components/Navigation';
import BoxTop from './components/Box-top';
import Footer from './components/Footer';
import './Homepage.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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

        <BoxTop/>

        <div className="sticky-top">
            <Navigation />
        </div>
            
            <div className="container" style={{width:"80%"}}>
                <div className='homepage-picture py-5 px-3 '>
                    <img src={`http://localhost:8080/images/Appointment1.png`} width={"100%"} alt=""/>
                    <Link className="btn btn-appointment" to="/appointment">นัดหมายบริการ</Link>
                </div>

                <div className="Services text-center p-5">
                    <h1 className="Text-title">บริการของคลินิก</h1>
                    <div className="row mt-4">
                        {
                            services.map(item => (
                                <div className="col-sm-12 col-lg-3 mt-4" key={item.service_id}>
                                    <div>
                                        <img className="img-service" src={`http://localhost:8080/images/${item.service_image}`} alt=""/>

                                    </div>
                                    <h6 className='mt-3 fs-4'>{item.service_name}</h6>
                                </div>
                            ))
                        }

                    </div>
                </div>
            </div>

            <Footer/>
        </>
    )
}