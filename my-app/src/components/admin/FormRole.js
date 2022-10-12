import { Button, Form, Row, Col } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_GET, API_POST } from '../../api';

import Sidebar from '../Sidebar';
import Top from '../Top';
import { ConfirmModal, MessageModal } from '../Modal';

export default function FormRole() {

    let params = useParams();
    let pages = 3;
    let date = new Date().toLocaleDateString();


    const [role_id, setRoleId] = useState(0);
    const [role_name, setRoleName] = useState("");

    const [validated, setValidated] = useState(false);

  // confirmModal
    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalMessage, setConfirmModalMessage] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

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
           onConfirm();
        }
        setValidated(true);
    }

    const doCreateRole = async () => {
        let json = await API_POST("role/add",{
            role_name:role_name
        })
        
        if(json.result) {
            window.location = "/roles";
        } else {
            setModalTitle("ไม่สามารถเพิ่มข้อมูลประเภทผู้ใช้ได้");
            setModalMessage(json.message);
            setShowModal(true);
        }
    }

    const doUpdateRole = async () => {
        const json = await API_POST("role/update", {
            role_id: role_id,
            role_name: role_name
        });

        if (json.result) {
            window.location = "/roles";
        }else {
            setModalTitle("ไม่สามารถแก้ไขข้อมูลประเภทผู้ใช้ได้");
            setModalMessage(json.message);
            setShowModal(true);
        }
    }
    
    const onConfirm = async (data) => {
        if(params.role_id === "add"){
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

        if(params.role_id === "add"){
            doCreateRole();
            
        }else{
            doUpdateRole();
            
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

                    
                        <div className='row'>
                            <div className='p-0 col-12 col-lg-2 bg-primary'>
                                <div className='sidebar'>
                                    <Sidebar pages={pages}/>
                                </div>
                            </div>
                            
                            <div className='p-0 m-0 col-12 col-lg-10'>
                            <Top/>
                                <div className="content p-5">
                                
                                    <div className='container m-auto'>
                                        
                                        <div className='col-8 bg-white rounded shadow p-3 m-auto'>
                                            {params.role_id == "add" ?
                                                <h4 className='text-center'>เพิ่มประเภทผู้ใช้งาน</h4>
                                            :
                                                <h4 className='text-center'>แก้ไขประเภทผู้ใช้งาน</h4>

                                            }
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

                                                    <Row className="mb-4">
                                                        <div className="text-end">
                                                            <Button className="btn btn-success mb-3 mt-3" as="input" type="submit" value="บันทึก" />
                                                            <Link to="/roles" className="btn btn-danger ms-2">ยกเลิก</Link>
                                                        </div>
                                                    </Row>
                                                </Form>
                                        </div>
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