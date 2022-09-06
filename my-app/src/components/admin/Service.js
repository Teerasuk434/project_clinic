import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Table } from 'react-bootstrap';
import { API_GET, API_POST } from '../../api';

import './Admin.css';
import Sidebar from './Sidebar';
import ServiceItems from './ServiceItems';

export default function Service() {
    let date = new Date().toLocaleDateString();
    let pages = 5;

    const [search, setSearch] = useState("");
    const [services, setServices] = useState([]);
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

            document.body.style.overflow = "hidden";

            let json = await response.json();
            setServices(json.data);
            setListServices(json.data)
        }

        fetchData();
    }, []);

    useEffect(() => {
        if(search == ""){
            setServices(listServices);
        }

    }, [search]);

    const fetchServices = async () => {
        let json = await API_GET("service");
        setServices(json.data);
        setListServices(json.data);
    }

    const onDelete = async (data) => {
        let json = await API_POST("service/delete", {
            service_id: data.service_id
        });

        if (json.result) {
            fetchServices();
        }
    }

    const onSearch = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if(search != ""){
                let searchServices = [];
                listServices.filter(Service => Service.service_name.includes(search)).map(item => {
                    searchServices.push(item);
                })
    
                setServices(searchServices);
            }else {
                setServices(listServices);
            }
        }
     }

    return (
        <>
            <div className="Main container-fluid">

                <div className='row'>

                    <div className='top d-flex justify-content-between px-3'>

                        <div className="text">
                             <p className='me-2'>วันที่ : {date}</p>
                        </div>
                        <div className='text'>
                           <p> สถานะ : แอดมิน</p>
                        </div>

                    </div>

                    <div className='p-0 col-12 col-lg-2 sidebar-height'>
                        <div className='sidebar'>
                            <Sidebar pages={pages}/>
                        </div>
                    </div>

                    <div className='p-0 col-12 col-lg-10'>
                        <div className="content">
                            <div className="container m-auto">
                                <div className="row">
                                    <div className="col">
                                        <div className="my-5">
                                            <h2 className="header-content text-center text-white p-2">ข้อมูลบริการ</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-2">
                                        <Link to={"/service/add"} className="btn btn-success ms-3">{<i className="fa-solid fa-plus me-2"></i>}เพิ่มข้อมูล</Link>
                                    </div>
                                    <div className="col-10">
                                        <Form>
                                            <Row>
                                                <Form.Group as={Col} md="10" className="mb-2" controlId="validateFirstName">
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        value={search}
                                                        placeholder="ค้นหา"
                                                        onChange={(e) => setSearch(e.target.value)}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        กรุณากรอกข้อมูลที่ต้องการค้นหา
                                                    </Form.Control.Feedback>
                                                    </Form.Group>
                                                <Form.Group as={Col} md="2">
                                                    <div className="d-grid gap-2">
                                                        <button className="btn btn-success" type="submit" onClick={onSearch}>{<i className="fa-solid fa-magnifying-glass me-2"></i>}ค้นหา</button>
                                                    </div>
                                                </Form.Group>
                                            </Row>
                                        </Form>
                                    </div>
                                </div>

                                <div className='row mt-3'>
                                    <div className='col text-center'>
                                        <Table striped responsive>
                                            <thead>
                                                <tr>
                                                <th>รหัสบริการ</th>
                                                <th>ชื่อบริการ</th>
                                                <th>ค่าบริการ</th>
                                                <th>ค่ามัดจำ</th>
                                                <th>เวลาที่ใช้</th>
                                                <th>รูปภาพ</th>
                                                <th>ห้องที่ใช้</th>
                                                <th>action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    services.map(item => (
                                                        <ServiceItems
                                                        key={item.service_id}
                                                        data={item}
                                                        onDelete={onDelete} />
                                                    ))
                                                }
                                            </tbody>
                                        </Table>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                
            </div>
        </>
    )
}