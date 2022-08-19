import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Table } from 'react-bootstrap';
import { API_GET, API_POST } from '../../api';

import Sidebar from "./Sidebar";
import './Admin.css';
import EmployeeTypeItems from './EmployeeTypeItems';

export default function EmployeeType(){

    let date = new Date().toLocaleDateString();
    let pages = 4;

    const [search, setSearch] = useState("");
    const [empTypes, setEmpTypes] = useState([]);
    const [listEmpTypes, setListEmpTypes] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(
                "http://localhost:8080/api/emp_types",
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
            setEmpTypes(json.data);
            setListEmpTypes(json.data);
        }
        fetchData();

    }, []);

    useEffect(() => {
        if(search == ""){
            setEmpTypes(listEmpTypes);
        }

    }, [search]);


    const fetchData = async () => {
        let json = await API_GET("emp_types");
        setEmpTypes(json.data);
        setListEmpTypes(json.data);
    }

    const onDelete = async (data) => {
        let json = await API_POST("emp_types/delete", {
            emp_position_id: data.emp_position_id
        });

        if (json.result) {
            fetchData();
        }
    }

    const onSearch = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if(search != ""){
                let searchEmpTypes = [];
                listEmpTypes.filter(empTypes => empTypes.emp_position_name.includes(search)).map(item => {
                    searchEmpTypes.push(item);
                })
    
                setEmpTypes(searchEmpTypes);
            }
        }
     }

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
                        <div className="container m-auto">
                            <div className="row">
                                <div className="col">
                                    <div className="my-5">
                                        <h2 className="header-content text-center text-white p-2">ข้อมูลประเภทพนักงาน</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-2">
                                    <Link to={"/emptypes/add"} className="btn btn-success ms-3">{<i className="fa-solid fa-plus me-2"></i>}เพิ่มข้อมูล</Link>
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
                                    <Table striped>
                                        <thead>
                                            <tr>
                                            <th>รหัสประเภทพนักงาน</th>
                                            <th>ชื่อประเภทพนักงาน</th>
                                            <th>action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                empTypes.map(item => (
                                                    <EmployeeTypeItems
                                                    key={item.emp_position_id}
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