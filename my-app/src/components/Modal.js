import { Button, Modal,Form,Accordion} from "react-bootstrap";
import { useState } from "react";
import './Modal.css'


export function ShowPaymentModal(props) {
    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="text-center" >
                    <img src={`http://localhost:8080/images/${props.paymentImage}`} width="70%" height="70%" alt="" />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.onClose}>ปิด</Button>
            </Modal.Footer>

        </Modal>
    );
};

export function ShowAppointmentDetails(props) {

    let appoint_status = props.data.appoint_status;

    return (
        <>
            <Modal show={props.show} onHide={props.onClose}>
                <Modal.Header closeVariant="white" closeButton className="modal-header">
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div>
                        <p><b>สัตว์เลี้ยง :</b> {props.data.pet_name}</p>
                        <p><b>อาการเบื้องต้น :</b> {props.data.symtoms}</p>
                        <p><b>บริการ :</b> {props.data.service_name}</p>
                        <p><b>วันที่ :</b> {new Date(props.data.date).toLocaleDateString()}</p>
                        <p><b>เวลา :</b> {props.data.time} - {props.time_end}</p>
                        <p><b>ห้อง :</b> {props.data.room_name}</p>
                        {appoint_status == "รอแก้ไข" &&
                        <>
                            <p className="d-inline-block"><b>หมายเหตุ :</b></p> <p className="text-danger d-inline-block">{props.data.note}</p>
                        </>                        
                        }

                    <Accordion className="mt-2">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>ข้อมูลการชำระเงิน</Accordion.Header>
                            <Accordion.Body>
                                <img src={`http://localhost:8080/images/${props.data.payment_image}`} width="100%" height="100%" alt="" />
                            </Accordion.Body>
                        </Accordion.Item>
                        </Accordion>

                    </div>

                </Modal.Body>
                <Modal.Footer>

                    <Button variant="danger" onClick={props.onClose}>ปิด</Button>

                </Modal.Footer>

            </Modal>
        </>
    );
};

export function ShowAppointmentForm(props) {

    let appoint_status = props.data.appoint_status;

    const [showImageModal, setShowImageModal] = useState(false);
    const [paymentTitleModal, setPaymentTitleModal] = useState("");
    const [paymentImageModal, setPaymentImageModal] = useState("");
    const [pet_id,setPetId] = useState(0);

    const onClickShow = () => {
        setShowImageModal(true);
        setPaymentImageModal(props.data.payment_image);
        setPaymentTitleModal("รูปภาพการชำระเงิน");
    }

    const onCloseImageModal = () => {
        setShowImageModal(false);
    }

    return (
        <>
            <Modal show={props.show} onHide={props.onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div>
                        <p className="d-inline-block"><b>สัตว์เลี้ยง :</b> </p>
                        <p className="d-inline-block">
                            <Form.Select
                                value={pet_id}
                                onChange={(e) => setPetId(e.target.value)}
                                required>
                                <option label="กรุณาเลือกสัตว์เลี้ยง"></option> 
                                {
                                props.pets.map(item => (
                                    <option key={item.pet_id} value={item.pet_id}> 
                                    {item.pet_name} </option>
                                ))
                                }
                            </Form.Select>
                        </p>
                        <p><b>อาการเบื้องต้น :</b> {props.data.symtoms}</p>
                        <p><b>บริการ :</b> {props.data.service_name}</p>
                        <p><b>วันที่ :</b> {new Date(props.data.date).toLocaleDateString()}</p>
                        <p><b>เวลา :</b> {props.data.time}</p>
                        <p><b>ห้อง :</b> {props.data.room_name}</p>
                        {appoint_status == "รอแก้ไข" &&
                        <>
                            <p className="d-inline-block"><b>หมายเหตุ :</b></p> <p className="text-danger d-inline-block">{props.data.note}</p>
                        </>                        
                        }
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={onClickShow}>ข้อมูลการชำระค่ามัดจำ</Button>

                    <Button variant="danger" onClick={props.onClose}>ปิด</Button>

                </Modal.Footer>

            </Modal>
            <ShowPaymentModal 
            show={showImageModal}
            onClose={onCloseImageModal}
            title={paymentTitleModal}
            paymentImage={paymentImageModal}
            />
        </>
    );
};

export function ConfirmModal(props) {

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>{props.message}</p>
            </Modal.Body>

            <Modal.Footer>
                <Button className="btn-success" onClick={props.onConfirm}>ตกลง</Button>
                <Button className="btn-danger" onClick={props.onClose}>ยกเลิก</Button>
            </Modal.Footer>
        </Modal>
    );
};

export function UpdateModal(props) {

    return (
        <Modal show={props.show} onHide={props.onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <h6>{props.message}</h6>
            </Modal.Body>

            <Modal.Footer>
                <Button className="btn-success" onClick={props.onConfirm}>ตกลง</Button>
                <Button className="btn-danger" onClick={props.onClose}>ยกเลิก</Button>
            </Modal.Footer>
        </Modal>
    );
};