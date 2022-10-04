import { Button, Form, Row, Col } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import { useParams,Link } from 'react-router-dom';
import { API_GET, API_POST } from '../../api';

import Sidebar from './Sidebar';
import Top from '../Top';

export default function FormUser() {

    let params = useParams();
    let pages = 2;
    let date = new Date().toLocaleDateString();

    const [userId, setUserId] = useState(0);
    const [username, setUserName] = useState("");
    const [newpassword, setNewPassword] = useState("");
    const [password,setPassword] = useState("");
    const [role_id, setRoleId] = useState(0);
    const [role_name, setRoleName] = useState("");

    const [roles, setRoles] = useState([]);

    const [validated, setValidated] = useState(false);

    let statusPassword = false;

    useEffect(() => {
        fetchRoles();
    },[]);

    const fetchRoles = async () => {
        let json = await API_GET("roles");

        if(json.result){
            let role_temp = []

            json.data.map(item =>{
                if(item.role_id != 1){
                    role_temp.push(item);
                }
            })

            setRoles(role_temp);
        }

    }

    useEffect(() => {
        async function fetchData(user_id) {
            let json = await API_GET("user/" + user_id);
            var data = json.data[0];
            setUserId(data.user_id);
            setUserName(data.username);
            setPassword(data.password);
            setRoleId(data.role_id);
            setRoleName(data.role_name)
        }

        if (params.user_id != "add") {
            fetchData([params.user_id]);
        }
    },[params.user_id])
    
    const onSave = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if (params.user_id === "add") {
                await setPassword(newpassword);
                doCreateUser();

            } else {
                if(newpassword === ""){
                    statusPassword = false;
                    doUpdateUser();
                }else{
                    statusPassword = true;
                    setPassword(newpassword);
                    doUpdateUser();

                }
            }
        }
        setValidated(true);
    }

    const doCreateUser = async (res) => {
        const response = await fetch(
            "http://localhost:8080/api/user/add",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + localStorage.getItem("access_token")
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    role_id: role_id
                })
            }
        );
        let json = await response.json();
        if(json.result) {
            window.location = "/users";
        }

    }

    const doUpdateUser = async () => {
        const json = await API_POST("user/update", {
            user_id: userId,
            username: username,
            password: password,
            role_id: role_id,
            status: statusPassword
        });

        if (json.result) {
            window.location = "/users";
        }
    }


    return (
    <>

            <div className="container-fluid">

                <div className='row'>

                        <div className='p-0 col-12 col-lg-2 bg-primary'>
                            <div className='sidebar'>
                                <Sidebar pages={pages}/>
                            </div>
                        </div>

                        <div className='p-0 m-0 col-12 col-lg-10'>
                        <Top />
                            <div className="content p-5">
                                <div className='shadow bg-light p-5 rounded'>

                                    <h4 className='text-center'>เพิ่มข้อมูลผู้ใช้งาน</h4>

                                    <div className='container m-auto px-5 py-3 mt-3 border-top border-secondary'>

                                        <Form className="w-50 m-auto" noValidate validated={validated} onSubmit={onSave}>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="validateUserName">
                                                    <Form.Label>ชื่อผู้ใช้งาน</Form.Label>
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        value={username}
                                                        placeholder="ชื่อผู้ใช้งาน"
                                                        onChange={(e) => setUserName(e.target.value)}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        กรุณากรอก ชื่อผู้ใช้งาน
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Row>

                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="validatePassword">
                                                    <Form.Label>รหัสผ่าน</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        value={newpassword}
                                                        placeholder="รหัสผ่าน"
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        กรุณากรอก รหัสผ่าน
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Row>

                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="validateRoleType">
                                                    <Form.Label>ประเภทผู้ใช้งาน</Form.Label>
                                                    <Form.Select
                                                        value={role_id}
                                                        onChange={(e) => setRoleId(e.target.value)}
                                                        required>
                                                        <option label="กรุณาเลือกประเภทผู้ใช้งาน"></option> 
                                                        {
                                                        roles.map(item => (
                                                            <option key={item.role_id} value={item.role_id}> 
                                                            {item.role_name} </option>
                                                        ))
                                                        }
                                                    </Form.Select>
                                                        <Form.Control.Feedback type="invalid">
                                                            กรุณาเลือก ประเภทผู้ใช้งาน
                                                        </Form.Control.Feedback>
                                                </Form.Group>
                                            </Row>

                                            <Row className="mt-3">
                                                <div className="text-end">
                                                    <Button variant="success" as="input" type="submit" value="บันทึก"/>
                                                    <Link to="/users" className="btn btn-warning ms-2">ยกเลิก</Link>
                                                </div>
                                            </Row>
                                        </Form>
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
                </div>
            
        </>
    )
}