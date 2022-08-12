import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Table } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import ServiceItem from './ServiceItem';
import { API_GET, API_POST } from '../../api';

export default function Service(){
    
    const [search, setSearch] = useState("");
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

    const fetchServices = async () => {
        let json = await API_GET("service");
        setServices(json.data);
    }

    const onDelete = async (data) => {
        let json = await API_POST("service/delete", {
            service_id: data.service_id
        });

        if (json.result) {
            fetchServices();
        }
    }

    const doSearch = async (data) => {
        let json = await API_GET("service/search/" + data);
            setServices(json.data);

    }

    const onSearch = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
                if(search === ""){
                    fetchServices();
                }else {
                    doSearch(search);
                }
        }
    }

    return(
        <>
            <div className="container m-auto">
                <div className="row">
                    <div className="col">
                        <div className="my-5">
                            <h2 className="header text-center text-white p-2">ข้อมูลบริการ</h2>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-2">
                        <Link to={"/service/add"} className="btn btn-success ms-3">{<i class="fa-solid fa-plus me-3"></i>}เพิ่มบริการ</Link>
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
                                        <button className="btn btn-success" type="submit" onClick={onSearch}>{<i class="fa-solid fa-magnifying-glass me-2"></i>}ค้นหา</button>
                                    </div>
                                </Form.Group>
                            </Row>
                        </Form>
                    </div>
                </div>

                <div className='row mt-3'>
                    <div className='col text-center'>
                        <Table striped>
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
                                        <ServiceItem
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
        </>
    )
}