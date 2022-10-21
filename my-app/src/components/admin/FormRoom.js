import { useEffect, useState  } from "react";
import {Button, Form , Row ,Col} from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import { API_GET,API_POST } from "../../api";

import Sidebar from "../Sidebar";
import Top from '../Top';
import { MessageModal, ConfirmModal } from "../Modal"; 


export default function FormRoom(){

    let params = useParams();
    let navigate = useNavigate();
    let pages = 7;

    const [validated,setValidated] = useState(false);

    const [room_type_id, setRoomTypeId] = useState(0);
    const [room_type, setRoomType] = useState([]);

    const [room_name,setRoomName] = useState("");
    const [room_id,setRoomId] = useState("");
    const [room, setRoom] = useState([]);

    // confirmModal
    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalMessage, setConfirmModalMessage] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        async function fetchData(room_id){
            let json = await API_GET("room/"+room_id);
            var data = json.data[0];

            setRoomName(data.room_name);
            setRoomId(data.room_id);
            setRoomTypeId(data.room_type_id);
        }
        if(params.room_id != "add"){
            fetchData([params.room_id]);

        }
    },[params.room_id])

    useEffect(() =>{ 
        async function fetchData(){
            let json = await API_GET("room");
            let json2 = await API_GET("room_type");
            setRoom(json.data);
            setRoomType(json2.data);
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

            onConfirm();
        }
        setValidated(true);
    }

    const doCreateRoom = async () => {

        let json = await API_POST("room/add",{
            room_name: room_name,
            room_type_id:room_type_id
        })

        if(json.result) {
            navigate("/rooms", { replace: false });
        } else {
            setModalTitle("ไม่สามารถเพิ่มข้อมูลห้องรักษาได้");
            setModalMessage(json.message);
            setShowModal(true);
        }
    }

    const doUpdateRoom = async () => {
        let json = await API_POST("room/update",{
            room_id: room_id,
            room_name: room_name,
            room_type_id: room_type_id
        })

        if(json.result) {
            navigate("/rooms", { replace: false });
        } else {
            setModalTitle("ไม่สามารถแก้ไขข้อมูลห้องรักษาได้");
            setModalMessage(json.message);
            setShowModal(true);
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

    const onClose = () => {
        setConfirmModal(false);
        setShowModal(false);
    }
    return(
        <>
            <div className="container-fluid">

                <div className="row">

                    <div className="p-0 col-12 col-lg-2 bg-primary">
                        <div className="sidebar">
                            <Sidebar pages={pages}/>
                        </div>
                    </div>

                        <div className="p-0 m-0 col-12 col-lg-10">
                            <div className="content">
                                <Top/> 

                                <div className="shadow bg-light m-5 p-5 rounded">
                                    {params.room_id == "add" ?
                                        <h4 className="text-center mt-3">เพิ่มข้อมูลห้องรักษา</h4>
                                    
                                    :
                                        <h4 className="text-center mt-3">แก้ไขข้อมูลห้องรักษา</h4>

                                    }
                                    
                                        <div className="container border-top border-secondary addData">
                                            <Form noValidate validated={validated} onSubmit={onSave}>
                                                <Row className="mb-3">
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
                                                </Row>
                                                <Row className="mb-3">
                                                    <Form.Group as={Col} controlId="validateRoomType">
                                                        <Form.Label>ประเภทห้องรักษา</Form.Label>
                                                        <Form.Select
                                                            value={room_type_id}
                                                            onChange={(e) => setRoomTypeId(e.target.value)}
                                                            required>
                                                            <option label="ประเภทห้องรักษา"></option> 
                                                            {
                                                            room_type.map(item => (
                                                                <option key={item.room_type_id} value={item.room_type_id}> 
                                                                {item.room_type_name} </option>
                                                            ))
                                                            }
                                                        </Form.Select>
                                                            <Form.Control.Feedback type="invalid">
                                                                กรุณาเลือก ประเภทห้องรักษา
                                                            </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Row>    
                                                <Row className="mb-5">
                                                    <div className="text-end">
                                                        <Button className="btn btn-success mb-3 mt-3" as="input" type="submit" value="บันทึก" />
                                                        <Link to="/rooms" className="btn btn-warning ms-2">ยกเลิก</Link>
                                                    </div>
                                                </Row>
                                            </Form>
                                        </div>
                                </div>
                            </div>                    
                        </div>
                </div>    
            </div>

            <ConfirmModal
                show={confirmModal}
                title={confirmModalTitle}
                message={confirmModalMessage}
                onConfirm={onConfirmUpdate}
                onClose={onCancelUpdate}/>
        

            <MessageModal
                show={showModal}
                title={modalTitle}
                message={modalMessage}
                onClose={onClose}/>
        </>
    )
}