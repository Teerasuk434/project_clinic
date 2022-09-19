import { useEffect, useState } from "react"
import { Form, Row, Col, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import EmployeeItem from "./EmployeeItem";
import { API_GET,API_POST } from "../../api";


import Sidebar from "./Sidebar";



export default function Employee(){
    let date = new Date().toLocaleDateString();
    let pages = 3;

    const [employee,setEmployee] = useState([]);
    const [search,setSearch] = useState("");
    const [listemployee,setListEmployee] = useState([]);

    useEffect( () => {
        async function fetchData(){
            const response = await fetch(
                "http://localhost:8080/api/emp",
                {
                    method: "GET",
                    headers:{
                        Accept:"application/json",
                        'Content-Type': 'application/json',
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                }
            );

            let json = await response.json();
            setEmployee(json.data);
            setListEmployee(json.data);
        }
        fetchData();
    },[]);

    useEffect(() => {
        if(search == ""){
            setEmployee(listemployee);
        }

    }, [search]);

    const onSearch = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if(search != ""){
                let searchEmployee = [];
                listemployee.filter(type => type.emp_fname.includes(search)).map(item => {
                    searchEmployee.push(item);
                })
    
                setEmployee(searchEmployee);
            }
        }
     }

     const onDelete = async (data) => {
        let json = await API_POST("emp/delete", {
            emp_id: data.emp_id
        });

        if (json.result) {
            fetchEmployee();
        }
    }

    const fetchEmployee = async () => {
        let json = await API_GET("emp");
        setEmployee(json.data);
        setListEmployee(json.data);
    }
    return (
        <>
           <div className="container-fluid">
                <div className='row'>
                    <div className='top d-flex justify-content-between px-3'>
                        <div className="text">
                            <p className="me-2">วันที่ : {date}</p>
                        </div>
                        <div className="text">
                            <p>สถานะ : เจ้าของคลินิก</p>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className='p-0 col-12 col-lg-2 bg-primary'>
                        <div className='sidebar'>
                            <Sidebar pages={pages}/>
                        </div>
                    </div>

                    <div className='p-0 m-0 col-12 col-lg-10'>
                        <div className="content">
                            <div className="container m-auto">
                                <div className="row">
                                    <div className="col">
                                        <div className="my-5">
                                            <h2 className="header-content text-center text-white p-2">ข้อมูลพนักงาน</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-2">
                                        <Link to={"/emp/add"} className="btn btn-success ms-3">{<i className="fa-solid fa-plus me-2"></i>}เพิ่มข้อมูล</Link>
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
                                                <th>รหัสพนักงาน</th>
                                                <th>ชื่อ-สกุล</th>
                                                <th>ตำแหน่ง</th>
                                                <th>action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    employee.map(item => (
                                                        <EmployeeItem
                                                        key={item.emp_id}
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