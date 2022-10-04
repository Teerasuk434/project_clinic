import { useEffect, useState } from "react";
import {Button, Form , Row ,Col} from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import { API_GET,API_POST } from "../../api";


import Sidebar from "./Sidebar";
import Top from '../Top';

import { ConfirmModal,MessageModal } from "../Modal"; 

export default function FormEmptypes(){

    let params = useParams();
    let navigate = useNavigate();
    let pages = 4;
    let date = new Date().toLocaleDateString();


    const [validated,setValidated] = useState(false);
    const [emp_position_name,setEmpPositionName] = useState("");
    const [emp_position_id,setEmpPositionId] = useState(0);
 
     // confirmModal
     const [confirmModal, setConfirmModal] = useState(false);
     const [confirmModalTitle, setConfirmModalTitle] = useState("");
     const [confirmModalMessage, setConfirmModalMessage] = useState("");
 
     const [showModal, setShowModal] = useState(false);
     const [modalTitle, setModalTitle] = useState("");
     const [modalMessage, setModalMessage] = useState("");
 
 
    useEffect(() =>{
        async function fetchData(emp_position_id){
            let json = await API_GET("emp_types/"+emp_position_id);
            var data = json.data[0];
            
            setEmpPositionName(data.emp_position_name);
            setEmpPositionId(data.emp_position_id);
        }
        if(params.emp_position_name != "add"){
            fetchData([params.emp_position_id]);
        }
    },[params.emp_position_id]);

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

    const doCreateEmptypes = async() => {
        let json = await API_POST("emp_types/add",{
            emp_position_name: emp_position_name
        })
        if(json.result){
            navigate("/emptypes", { replace: true });
        }else {
            setModalTitle("ไม่สามารถเพิ่มข้อมูลประเภทพนักงานได้");
            setModalMessage(json.message);
            setShowModal(true);
        }
    }
    
    const doUpdateEmptypes = async(res) => {
        let json = await API_POST("emp_types/update",{
            emp_position_id: emp_position_id,
            emp_position_name: emp_position_name
        })
        
        if(json.result){
            navigate("/emptypes", { replace: true });
        }else {
            setModalTitle("ไม่สามารถแก้ไขข้อมูลประเภทพนักงานได้");
            setModalMessage(json.message);
            setShowModal(true);
        }
    }

    const onConfirm = async (data) => {

        if(params.emp_position_id === "add"){
            
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

        if(params.emp_position_id === "add"){
            doCreateEmptypes();
            
        }else{
            doUpdateEmptypes();
            
        }
    }
    const onCancelUpdate = () => {
        setConfirmModal(false);

    }

    const onClose = () => {
        setConfirmModal(false);
        setShowModal(false);
    }

    return (
    <>
            <div className="container-fluid">

                <div className='row'>

                    <Top />

                        <div className='p-0 col-12 col-lg-2 bg-primary'>
                            <div className='sidebar'>
                                <Sidebar pages={pages}/>
                            </div>
                        </div>

                            <div className='p-0 m-0 col-12 col-lg-10'>
                                <div className="content p-5">
                                    <div className='container m-auto'>

                                    <div className='col-8 bg-white rounded shadow p-3 m-auto'>
                                        <h4 className='text-center'>เพิ่มประเภทพนักงาน</h4>
                                            <Form noValidate validated={validated} onSubmit={onSave}>
                                                <Form.Group as={Col} controlId="validateEmpTypes" >
                                                    <Form.Label>ประเภทพนักงาน</Form.Label>
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        value={emp_position_name}
                                                        placeholder="ประเภทพนักงาน"
                                                        onChange={(e) => setEmpPositionName(e.target.value)}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        กรุณากรอก ชื่อประเภทพนักงาน
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Row className="mb-2">
                                                    <div className="text-end">
                                                        <Button className="btn btn-success mb-3 mt-3" as="input" type="submit" value="บันทึก" />
                                                        <Link to="/emptypes" className="btn btn-danger ms-2">ยกเลิก</Link>
                                                    </div>
                                                </Row>
                                            </Form>
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