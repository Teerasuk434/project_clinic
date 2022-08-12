import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Table } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Users.css';
import UsersItem from './UsersItem';
import { API_GET, API_POST } from '../../api';

export default function Users(){
    
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(
                "http://localhost:8080/api/users",
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
            setUsers(json.data);
        }

        fetchData();
    }, []);

    const fetchUsers = async () => {
        let json = await API_GET("users");
        setUsers(json.data);
    }

    const onDelete = async (data) => {
        let json = await API_POST("user/delete", {
            user_id: data.user_id
        });

        if (json.result) {
            fetchUsers();
        }
    }

    const doSearch = async (data) => {
        let json = await API_GET("user/search/" + data);
            setUsers(json.data);

    }

    const onSearch = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
                if(search === ""){
                    fetchUsers();
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
                            <h2 className="header text-center text-white p-2">ข้อมูลผู้ใช้งาน</h2>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-2">
                        <Link to={"/user/add"} className="btn btn-success ms-3">{<i class="fa-solid fa-plus me-3"></i>}เพิ่มผู้ใช้งาน</Link>
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
                                <th>รหัสผู้ใช้งาน</th>
                                <th>ชื่อผู้ใช้งาน</th>
                                <th>ประเภทผู้ใช้งาน</th>
                                <th>action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    users.map(item => (
                                        <UsersItem
                                        key={item.user_id}
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