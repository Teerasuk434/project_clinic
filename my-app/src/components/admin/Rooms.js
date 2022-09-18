import { useEffect, useState } from "react"
import { Form, Row, Col, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import RoomItem from "./RoomItem";
import { API_GET,API_POST } from "../../api";

import './Admin.css';
import Sidebar from './Sidebar';
import Top from "./Top";
import { ConfirmModal } from "../ModalsAdmin";

export default function Rooms(){

    const [room,setRoom] = useState([]);
    const [search,setSearch] = useState("");
    const [listroom,setListRoom] = useState([]);
    const [room_id, setRoomId] = useState(0);

     // confirmModal
     const [confirmModal, setConfirmModal] = useState(false);
     const [confirmModalTitle, setConfirmModalTitle] = useState("");
     const [confirmModalMessage, setConfirmModalMessage] = useState("");


    let date = new Date().toLocaleDateString();
    let pages = 7;

    useEffect( () => {
        async function fetchData(){
            const response = await fetch(
                "http://localhost:8080/api/room",
                {
                    method: "GET",
                    headers:{
                        Accept:"application/json",
                        'Content-Type': 'application/json',
                    }
                }
            );

            document.body.style.overflow = "hidden";


            let json = await response.json();
            setRoom(json.data);
            setListRoom(json.data);
        }
        fetchData();
    },[]);

    useEffect(() => {
        if(search == ""){
            setRoom(listroom);
        }

    }, [search]);

    const onSearch = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if(search != ""){
                let searchRoom = [];
                listroom.filter(type => type.room_name.includes(search)).map(item => {
                    searchRoom.push(item);
                })
    
                setRoom(searchRoom);
            }
        }
     }


    const onDelete = async (data) => {

                setRoomId(data.room_id);

                setConfirmModalTitle("ยืนยันการลบข้อมูล");
                setConfirmModalMessage("คุณยืนยันการลบข้อมูลใช่หรือไม่");
                setConfirmModal(true);
        }
    
        const onConfirmDelete = async () => {
            setConfirmModal(false);
            let json = await API_POST("room/delete", {
                room_id: room_id
            });
    
            if (json.result) {
                // setRoomType();
                fetchData();
            }
        }
    
        const onCancelDelete = () => {
            setConfirmModal(false);

        }

        const fetchData = async () => {
            let json = await API_GET("room");
            setRoom(json.data);
            setListRoom(json.data);
        }

    return (
        <>
           <div className="container-fluid">
                <div className='row'>

                    <Top />

                    <div className='p-0 col-12 col-lg-2'>
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
                                            <h2 className="header-content text-center text-white p-2">ข้อมูลห้องรักษา</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-2">
                                        <Link to={"/room/add"} className="btn btn-success ms-3">{<i className="fa-solid fa-plus me-2"></i>}เพิ่มข้อมูล</Link>
                                        
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
                                                <th>รหัสห้องรักษา</th>
                                                <th>ชื่อห้องรักษา</th>
                                                <th>action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    room.map(item => (
                                                        <RoomItem
                                                        key={item.room_id}
                                                        data={item}
                                                        onDelete={onDelete} />
                                                    ))
                                                }
                                                <ConfirmModal
                                                show={confirmModal}
                                                title={confirmModalTitle}
                                                message={confirmModalMessage}
                                                onConfirm={onConfirmDelete}
                                                onClose={onCancelDelete}/>
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