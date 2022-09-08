import { useEffect, useState } from "react";
import { Form, Col, Row, Table, Button} from "react-bootstrap";

import Sidebar from "./Sidebar";

export default function AppointSchedule() {

    let date = new Date().toLocaleDateString();
    let pages = 2;

    const [search,setSearch] = useState("");
    const [custappoint,setCustAppoint] = useState([]);
    const [listcustappoint,setListCustAppoint] = useState("");


    // useEffect(() => {
    //     async function fetchData(){
    //         const response = await fetch(
    //             "http://localhost:8080/api/appointment",
    //             {
    //                 method: "GET",
    //                 headers:{
    //                     Accept:"application/json",
    //                     'Content-Type': 'application/json',
    //                     Authorization: "Bearer " + localStorage.getItem("access_token")
    //                 }
    //             }
    //         );

    //         let json = await response.json();
    //         setCustAppoint(json.data);
    //         setListCustAppoint(json.data);
    //     }
    //     fetchData();
    // },[]);

    useEffect(() => {
        if(search == ""){
            setCustAppoint(listcustappoint);
        }
    }, [search]);
    
    const onSearch = async (event) => {
        // const form = event.currentTarget;
        // event.preventDefault();

        // if (form.checkValidity() === false) {
        //     event.stopPropagation();
        // }else {
        //     if(search !== ""){
        //         let searchCustAppoint = [];
        //         listcustappoint.filter(type => type.)
        //     }
        // }
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
                                            <h2 className="header-content text-center text-white p-2">ตารางนัดหมาย</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-2">
                                        {/* <Link to={"/emp/add"} className="btn btn-success ms-3">{<i className="fa-solid fa-plus me-2"></i>}เพิ่มข้อมูล</Link> */}
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
        </>
    )
}