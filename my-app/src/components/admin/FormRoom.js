import { useEffect, useState } from "react";
import {Button, Form , Row ,Col} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { API_GET,API_POST } from "../../api";

import Sidebar from "./Sidebar";
import Top from "./Top";
import { UpdateModal } from "../Modal"; 


export default function FormRoom(){

    let params = useParams();
    let navigate = useNavigate();
    let pages = 7;

    const [validated,setValidated] = useState(false);

    const [room_type_id, setRoomTypeId] = useState(0);

    const [room_name,setRoomName] = useState("");
    const [room_id,setRoomId] = useState("");
    const [room, setRoom] = useState([]);

    // confirmModal
    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalMessage, setConfirmModalMessage] = useState("");

    useEffect(() =>{
        async function fetchData(room_id){
            let json = await API_GET("room/"+room_id);
            var data = json.data[0];
            
            setRoomName(data.room_name);
            setRoomId(data.room_id);

        }
        if(params.room_name != "add"){
            fetchData([params.room_id]);
        }

    },[]);

    useEffect(() =>{
        async function fetchData(){
            let json = await API_GET("room");
            setRoom(json.data);
        }
        fetchData();

    },[]);

    // show modal
    const onSave = async(event) =>{
        const form = event.currentTarget;
        event.preventDefault();

        if(form.checkValidity()=== false){
            event.stopPropagation();
        }else{

            // onDelete();
            onConfirm();
        }
    }

    const doCreateRoom = async(res) => {
        const response = await fetch(
            "http://localhost:8080/api/room/add",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: "Bearer "+ localStorage.getItem("access_token")
                },
                body: JSON.stringify({
                    room_name: room_name,
                    room_type_id:room_type_id
                })
            }
        )
        let json = await response.json();

        if(json.result){
            navigate("/rooms", { replace: true });
        }
    }
    
    const doUpdateRoom = async(res) => {
        console.log(room_name)
        const response = await fetch(
            "http://localhost:8080/api/room/update",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: "Bearer "+ localStorage.getItem("access_token")
                },
                body: JSON.stringify({
                    room_id: room_id,
                    room_name: room_name,
                    room_type_id: room_type_id
                })
            }
        )
        let json = await response.json();

        if(json.result){
            console.log("อัปเดตสำเร็จ");
        }
    }

    const onConfirm = async (data) => {
        
        

        if(params.room_id === "add"){
            
            setConfirmModalTitle("ยืนยันการเพิ่มข้อมูล");
            setConfirmModalMessage("คุณยืนยันการเพิ่มข้อมูลใช่หรือไม่");
            setConfirmModal(true);
        }else{

            setConfirmModalTitle("ยืนยันการแก้ไขข้อมูล");
            setConfirmModalMessage("คุณยืนยันการแก้ไขข้อมูลใช่หรือไม่");
            setConfirmModal(true);
            
        }
        
    }

    const onConfirmUpdate = async () => {
        setConfirmModal(false);

        if(params.room_id === "add"){
            doCreateRoom();
            
        }else{
            doUpdateRoom();
            
        }
    }
    const onCancelUpdate = () => {
        setConfirmModal(false);

    }
    return(
        <>
            <div className="container-fluid">
                <div className="row">
                    <Top/>
            
                            <div className="row">
                                <div className="p-0 col-12 col-lg-2 bg-primary">
                                    <div className="sidebar">
                                        <Sidebar pages={pages}/>
                                    </div>
                                </div>

                            <div className="p-0 m-0 col-12 col-lg-10">
                                <div className="content p-5">
                                    <div className="container m-auto">

                                    <h4 className="text-center">เพิ่มข้อมูลห้องรักษา</h4>
                                    <Form noValidate validated={validated} onSubmit={onSave}>
                                        <Form.Group as={Col} controlId="validateRoom" >
                                            <Form.Label>ข้อมูลห้องรักษา</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                value={room_name}
                                                placeholder="ข้อมูลห้องรักษา"
                                                onChange={(e) => setRoomName(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณากรอก ชื่อข้อมูลห้องรักษา
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="validateRoomType">
                                            <Form.Label>ประเภทห้องรักษา</Form.Label>
                                            <Form.Select
                                                value={room_type_id}
                                                onChange={(e) => setRoomTypeId(e.target.value)}
                                                required>
                                                <option label="ประเภทห้องรักษา"></option> 
                                                {
                                                room.map(item => (
                                                    <option key={item.room_type_id} value={item.room_type_id}> 
                                                    {item.room_name} </option>
                                                ))
                                                }
                                            </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    กรุณาเลือก ประเภทห้องรักษา
                                                </Form.Control.Feedback>
                                        </Form.Group>
                                        
                                        <Row className="my-4">
                                            <Button variant="primary" as="input" type="submit" value="SAVE" onClick={onSave}/>
                                        </Row>
                                        <UpdateModal
                                            show={confirmModal}
                                            title={confirmModalTitle}
                                            message={confirmModalMessage}
                                            onConfirm={onConfirmUpdate}
                                            onClose={onCancelUpdate}/>
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