import { Button, Form, Row, Col } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_GET, API_POST } from '../../api';

import Sidebar from './Sidebar';
import Top from '../Top';

export default function FormRole() {

    let params = useParams();
    let pages = 3;
    let date = new Date().toLocaleDateString();


    const [role_id, setRoleId] = useState(0);
    const [role_name, setRoleName] = useState("");

    const [roles, setRoles] = useState([]);

    const [validated, setValidated] = useState(false);


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

            let json = await response.json();
            setRoles(json.data);
        }

        fetchData();
    },[]);

    useEffect(() => {
        async function fetchData(role_id) {
            let json = await API_GET("role/" + role_id);
            var data = json.data[0];
            setRoleId(data.role_id);
            setRoleName(data.role_name);
        }

        if (params.role_id != "add") {
            fetchData([params.role_id]);
        }
    },[params.role_id])
    
    const onSave = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if (params.role_id === "add") {
                doCreateRole();
            } else {
                doUpdateRole();

            }
        }
        setValidated(true);
    }

    const doCreateRole = async (res) => {
        const response = await fetch(
            "http://localhost:8080/api/role/add",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + localStorage.getItem("access_token")
                },
                body: JSON.stringify({
                    role_name:role_name
                })
            }
        );
        let json = await response.json();
        if(json.result) {
            window.location = "/roles";
        }

    }

    const doUpdateRole = async () => {
        const json = await API_POST("role/update", {
            role_id: role_id,
            role_name: role_name
        });

        if (json.result) {
            window.location = "/roles";
        }
    }


    return (
        <>
            <div className="container-fluid">

                <div className='row'>

                    <Top />
                        <div className='row'>
                            <div className='p-0 col-12 col-lg-2 bg-primary'>
                                <div className='sidebar'>
                                    <Sidebar pages={pages}/>
                                </div>
                            </div>

                            <div className='p-0 m-0 col-12 col-lg-10'>
                                <div className="content p-5">
                                    <div className='container m-auto'>

                                    <h4 className='text-center'>เพิ่มประเภทผู้ใช้งาน</h4>

                                        <Form noValidate validated={validated} onSubmit={onSave}>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="validateUserName">
                                                    <Form.Label>ชื่อประเภทผู้ใช้งาน</Form.Label>
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        value={role_name}
                                                        placeholder="ชื่อประเภทผู้ใช้งาน"
                                                        onChange={(e) => setRoleName(e.target.value)}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        กรุณากรอก ประเภทผู้ใช้งาน
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Row>

                                            <Row className="mb-3">
                                                <Button variant="primary" as="input" type="submit" value="SAVE"/>
                                            </Row>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    )
}