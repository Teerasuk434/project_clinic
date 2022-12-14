import { useEffect, useState } from "react";
import {Button, Form , Row ,Col} from "react-bootstrap";
import { useNavigate, useParams,Link } from "react-router-dom";
import { API_GET,API_POST } from "../../api";

import Sidebar from "../Sidebar";
import Top from '../Top';
import { ConfirmModal, MessageModal} from "../Modal";


export default function FormRoomtypes(){

    let params = useParams();
    let navigate = useNavigate();
    let pages = 6;

    const [validated,setValidated] = useState(false);

    const [room_type_name,setRoomTypesName] = useState("");
    const [room_type_id, setRoomTypeId] = useState(0);
   
    // confirmModal
    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalMessage, setConfirmModalMessage] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");


    useEffect(() =>{
        async function fetchData(room_type_id){
            let json = await API_GET("room_type/"+room_type_id);
            var data = json.data[0];
            setRoomTypesName(data.room_type_name);
            setRoomTypeId(data.room_type_id);

        }

        if(params.room_type_id != "add"){
            fetchData([params.room_type_id]);
        }
    },[params.room_type_id]);

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

    const doCreateRoomtypes = async() => {
        
        let json = await API_POST("room_type/add",{
            room_type_name: room_type_name
        })
                
        if(json.result){
            navigate("/roomtypes", { replace: true });
        } else {
            setModalTitle("ไม่สามารถเพิ่มข้อมูลประเภทห้องรักษาได้");
            setModalMessage(json.message);
            setShowModal(true);
        }
    }
    
    const doUpdateRoomtypes = async() => {
        let json = await API_POST("room_type/update",{

            room_type_name: room_type_name,
            room_type_id: room_type_id
        })

        if(json.result){
            navigate("/roomtypes", { replace: true });
        }else {
            setModalTitle("ไม่สามารถแก้ไขข้อมูลประเภทห้องรักษาได้");
            setModalMessage(json.message);
            setShowModal(true);
        }
    }

    const onConfirm = async (data) => {     

        if(params.room_type_id === "add"){
            
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

        if(params.room_type_id === "add"){
            doCreateRoomtypes();
            
        }else{
            doUpdateRoomtypes();
            
        }
    }
    const onCancelUpdate = () => {
        setConfirmModal(false);

    }
    const onClose = () => {
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
                            <Top />

                            <div className="shadow bg-light m-5 p-5 rounded">
                                {params.room_type_id == "add" ?
                                            <h4 className="text-center">เพิ่มประเภทห้องรักษา</h4>

                                        :
                                            <h4 className="text-center">แก้ไขประเภทห้องรักษา</h4>

                                        }
                                        
                                <div className="container border-top border-secondary addData">
                                    <Form noValidate validated={validated} onSubmit={onSave}>
                                    
                                        <Form.Group as={Col} controlId="validateRoomTypes" >
                                            <Form.Label>ประเภทห้องรักษา</Form.Label>
                                            <Form.Control
                                                required
                                                type="text"
                                                value={room_type_name}
                                                placeholder="ประเภทห้องรักษา"
                                                onChange={(e) => setRoomTypesName(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณากรอก ชื่อประเภทห้องรักษา
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Row className="mb-3">
                                            <div className="text-end">
                                                <Button className="btn btn-success mb-3 mt-3" as="input" type="submit" value="บันทึก" />
                                                <Link to="/roomtypes" className="btn btn-warning ms-2">ยกเลิก</Link>
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