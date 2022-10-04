import 'bootstrap/dist/css/bootstrap.min.css';
import { API_GET, API_POST } from '../../api';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Table } from 'react-bootstrap'

import Sidebar from './Sidebar'
import Top from '../Top';
import RolesItem from './RolesItem';

export default function Admin() {

    let date = new Date().toLocaleDateString();

    let pages = 3;

    const [search, setSearch] = useState("");
    const [roles, setRoles] = useState([]);
    const [listRoles, setListRoles] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(
                "http://localhost:8080/api/roles",
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
            setRoles(json.data);
            setListRoles(json.data);
        }

        fetchData();
    }, []);

    useEffect(() => {
        if(search == ""){
            setRoles(listRoles);
        }

    }, [search]);

    const fetchRoles = async () => {
        let json = await API_GET("roles");
        setRoles(json.data);
        setListRoles(json.data)
    }

    const onDelete = async (data) => {
        let json = await API_POST("role/delete", {
            role_id: data.role_id
        });

        if (json.result) {
            fetchRoles();
        }
    }

    const onSearch = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if(search != ""){
                let searchRoles = [];
                listRoles.filter(role => role.role_name.includes(search)).map(item => {
                    searchRoles.push(item);
                })
    
                setRoles(searchRoles);
            }
        }
     }
     
    return (
        <>
            <div className="container-fluid">
                <div className='row'>
                    <div className='p-0 col-12 col-lg-2'>
                        <div className='sidebar'>
                            <Sidebar pages={pages}/>
                        </div>
                    </div>

                    <div className='p-0 col-12 col-lg-10'>
                        <div className="content">
                            <Top />

                            <div className="container m-auto">
                                <div className="row">
                                    <div className="col">
                                        <div className="my-5">
                                            <h2 className="header-content text-center text-white p-2">ข้อมูลประเภทผู้ใช้งาน</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-2">
                                        <Link to={"/role/add"} className="btn btn-success ms-3">{<i className="fa-solid fa-plus me-2"></i>}เพิ่มข้อมูล</Link>
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
                                                <th>รหัสประเภทผู้ใช้งาน</th>
                                                <th>ชื่อประเภทผู้ใช้งาน</th>
                                                <th>action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    roles.map(item => (
                                                        <RolesItem
                                                        key={item.role_id}
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