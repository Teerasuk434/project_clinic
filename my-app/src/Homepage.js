import Navigation from './components/Navigation';
import Footer from './components/Footer';
import './Homepage.css';
import { useEffect, useState } from 'react';

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
                        'Content-Type': 'application/json',
                        Authorization: "Bearer " + localStorage.getItem("access_token")
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
            <Navigation />
            
            <div className="container">
                <div className='homepage-picture'>
                    <img src={`http://localhost:8080/images/Appointment.png`} width={"100%"}/>
                    <button className='btn btn-appointment'>นัดหมายบริการ</button>
                </div>

                <div className="Services text-center p-5">
                    <h1 className="Text-title">บริการของคลินิก</h1>
                    <div className="Services-Items">
                        {
                            services.map(item => (
                                <div className="items d-inline-block mx-5 text-center">
                                    <img src={`http://localhost:8080/images/${item.service_image}`}/>
                                    <h6 className='mt-2 fs-4'>{item.service_name}</h6>
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