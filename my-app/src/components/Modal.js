import { Button, Modal,Form,Accordion} from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, useNavigate} from 'react-router-dom';

import { SERVER_URL } from "../app.config";
import { API_POST } from "../api";

export function ShowPaymentModal(props) {
    return (
        <Modal show={props.show} onHide={props.onClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="text-center" >
                    <img src={`http://localhost:8080/images/${props.paymentImage}`} width="70%" height="70%" alt="" />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" size="sm" onClick={props.onClose}>ปิด</Button>
            </Modal.Footer>

        </Modal>
    );
};

export function ShowAppointmentDetails(props) {

    let appoint_status = props.data.status_id;

    return (
        <>
            <Modal show={props.show} onHide={props.onClose} backdrop="static">
                <Modal.Header closeVariant="white" closeButton className="modal-header">
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body className="overflow-auto">
                    <div>
                        <p><b>เจ้าของสัตว์ :</b> {props.data.cust_fname} {props.data.cust_lname}</p>
                        <p><b>ชื่อสัตว์ :</b> {props.data.pet_name}</p>
                        <p><b>อาการเบื้องต้น :</b> {props.data.symtoms}</p>
                        <p><b>บริการ :</b> {props.data.service_name}</p>
                        <p><b>วันที่ :</b> {new Date(props.data.date).toLocaleDateString()}</p>
                        <p><b>เวลา :</b> {props.data.time} - {props.data.time_end}</p>
                        <p><b>ห้อง :</b> {props.data.room_name}</p>
                        <p><b>ผู้รับหน้าที่ :</b> {props.data.employee_fullname}</p>
                        <p><b>สถานะ :</b> {props.data.status_name}</p>
                        <p><b>หมายเหตุ :</b> {props.data.note}</p>
                        {appoint_status == 3 &&
                        <>
                            <p className="d-inline-block"><b>หมายเหตุ :</b></p> <p className="text-danger d-inline-block">{props.data.note}</p>
                        </>                        
                        }

                    <div className="mt-2 p-2">
                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>ข้อมูลการชำระเงิน</Accordion.Header>
                                <Accordion.Body>
                                    <img src={`http://localhost:8080/images/${props.data.payment_image}`} width="100%" height="100%" alt="" />
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>

                    </div>

                </Modal.Body>
                <Modal.Footer>

                    <Button variant="danger" size="sm" onClick={props.onClose}>ปิด</Button>

                </Modal.Footer>

            </Modal>
        </>
    );
};

export function ShowAppointmentForm(props) {

    let appoint_status = props.data.status_id;
    let navigate = useNavigate();

    const onClose = () =>{
        props.onClose();
    }

    return (
        <>
            <Modal show={props.show} onHide={props.onClose} backdrop="static">
                <Modal.Header closeVariant="white" closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header> 

                <Form noValidate validated={props.validated} onSubmit={props.onSave}>

                <Modal.Body>
                    <div>
                            <p ><b>สัตว์เลี้ยง :</b> </p>
                        <Form.Group controlId="validatePets" >
                            <Form.Select
                                value={props.pet_id}
                                onChange={(e) => props.setPetId(e.target.value)}
                                required>
                                <option label="กรุณาเลือกสัตว์เลี้ยง"></option> 
                                {
                                props.pets.map(item => (
                                    <option key={item.pet_id} value={item.pet_id}> 
                                    {item.pet_name} </option>
                                ))
                                }
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                กรุณาเลือกสัตว์เลี้ยง
                            </Form.Control.Feedback>
                        </Form.Group>
                            <p><b>อาการเบื้องต้น :</b></p>
                                <Form.Group controlId="validateSymtoms" >
                                    <Form.Control
                                        required
                                        type="text"
                                        value={props.symtoms}
                                        placeholder="กรอกอาการเบื้องต้น"
                                        onChange={(e) => props.setSymtoms(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        กรุณากรอกอาการเบื้องต้น
                                    </Form.Control.Feedback>
                                </Form.Group>
                            <p><b>บริการ :</b> {props.data.service_name}</p>
                            <p><b>วันที่ :</b> {new Date(props.data.date).toLocaleDateString()}</p>
                            <p><b>เวลา :</b> {props.data.time} - {props.data.time_end}</p>
                            <p><b>ห้อง :</b> {props.data.room_name}</p>
                            {appoint_status == 3 &&
                            <>
                                <p className="d-inline-block"><b>หมายเหตุ :</b></p> <p className="text-danger d-inline-block">{props.data.note}</p>
                            </>                        
                            }

                            
                            <div className="mt-2 p-2">
                                <Accordion>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>ข้อมูลการชำระเงิน</Accordion.Header>
                                        <Accordion.Body>
                                            <img src={`http://localhost:8080/images/${props.data.payment_image}`} width="100%" height="100%" alt="" />
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </div>

                            <p className="border-top border-secondary mt-2"><b>อัพโหลดภาพการชำระเงินใหม่ : </b></p>

                            <Form.Group controlId="formFile">

                                <Form.Control
                                    type="file"
                                    name="file"
                                    onChange={props.onFileSelected} />
                            </Form.Group>
                            {props.imageUrl != "" &&
                                <div className="shadow rounded mt-3 text-center">
                                    <img src={`${SERVER_URL}images/${props.imageUrl}`} width="80%" alt="Upload Image"/>
                                </div>
                            }
                </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button size="sm" variant="success" as="input" type="submit" value="บันทึกข้อมูล"/>

                    <Button variant="danger" size="sm" onClick={props.onClose}>ปิด</Button>

                </Modal.Footer>

                </Form>


            </Modal>
        </>
    );
};

export function ConfirmModal(props) {

    return (
        <Modal show={props.show} onHide={props.onClose} backdrop="static">
            <Modal.Header closeButton closeVariant="white">
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>{props.message}</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" size="sm" onClick={props.onConfirm}>ตกลง</Button>
                <Button variant="danger" size="sm" onClick={props.onClose}>ยกเลิก</Button>
            </Modal.Footer>
        </Modal>
    );
};

export function MessageModal(props) {

    return (
        <Modal show={props.show} onHide={props.onClose} backdrop="static">
            <Modal.Header closeVariant="white" closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="text-center">{props.message}</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" size="sm" onClick={props.onClose}>ตกลง</Button>
            </Modal.Footer>
        </Modal>
    );
};

export function SuccessModal(props) {

    return (
        <Modal show={props.show} onHide={props.onClose} backdrop="static">
            <Modal.Header closeVariant="white" closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="text-center">
                    <img src={`http://localhost:8080/images/success.png`} alt="" width={150}/>
                </div>
                <h4 className="text-center mt-2">{props.message}</h4>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" size="sm" onClick={props.onClose}>ตกลง</Button>
            </Modal.Footer>
        </Modal>
    );
};

export function SuccessAppointmentModal(props) {

    return (
        <Modal show={props.show} onHide={props.onClose} backdrop="static">
            <Modal.Header closeVariant="white" closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="text-center">
                    <img src={`http://localhost:8080/images/success.png`} alt="" width={150}/>
                </div>
                <h4 className="text-center mt-2">{props.message}</h4>
            </Modal.Body>

            <Modal.Footer>
                <Link className="btn btn-primary btn-sm" to="/account/appointments">หน้านัดหมาย</Link>
                <Button variant="danger" size="sm" onClick={props.onClose}>ปิด</Button>
            </Modal.Footer>
        </Modal>
    );
};

export function SuccessRegisterModal(props) {

    return (
        <Modal show={props.show} onHide={props.onClose} backdrop="static">
            <Modal.Header closeVariant="white" closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="text-center">
                    <img src={`http://localhost:8080/images/success.png`} alt="" width={150}/>
                </div>
                <h5 className="text-center mt-2">{props.message}</h5>
            </Modal.Body>

            <Modal.Footer>
                <Link to="/login" className="btn btn-primary btn-sm">เข้าสู่ระบบ</Link>
                <Button variant="danger" onClick={props.onClose} size="sm">ปิด</Button>
            </Modal.Footer>
        </Modal>
    );
};



