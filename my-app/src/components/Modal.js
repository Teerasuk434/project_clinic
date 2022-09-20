import { Button, Modal,Form,Accordion} from "react-bootstrap";
import { useEffect, useState } from "react";
import './Modal.css'
import { SERVER_URL } from "../app.config";


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

    const [pet_id,setPetId] = useState(0);
    const [appoint_id, setAppointId] = useState(0);
    const [validated,setValidated] = useState(false);
    const [symtoms, setSymtoms] = useState("");

    const [selectedFile, setSelectedFile] = useState([]);
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() =>{
        setPetId(props.data.pet_id);
        setSymtoms(props.data.symtoms)
        setImageUrl(props.data.payment_image)
        setAppointId(props.data.appoint_id)
    },[])

    const onFileSelected = (e) => {
        console.log(e.target.files[0])
        if (e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
        onUploadImage(e.target.files[0])
    }

    const onUploadImage = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        let response = await fetch(
            SERVER_URL + "/api/payment/upload" + appoint_id,
            {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
                body: formData,
            }
        );
        let json = await response.json();
        setImageUrl(json.data);
        console.log(json.data)
    }

    const onSave = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            console.log("update data")
        }
        setValidated(true);
    }


    return (
        <>
            <Modal show={props.show} onHide={props.onClose}>
                <Modal.Header closeVariant="white" closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header> 

                <Form noValidate validated={validated} onSubmit={onSave}>

                <Modal.Body>
                    <div>
                            <p ><b>สัตว์เลี้ยง :</b> </p>
                        <Form.Group controlId="validatePets" >
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
                            <Form.Control.Feedback type="invalid">
                                กรุณาเลือกสัตว์เลี้ยง
                            </Form.Control.Feedback>
                        </Form.Group>
                            <p><b>อาการเบื้องต้น :</b></p>
                                <Form.Group controlId="validateSymtoms" >
                                    <Form.Control
                                        required
                                        type="text"
                                        value={symtoms}
                                        placeholder="กรอกอาการเบื้องต้น"
                                        onChange={(e) => setSymtoms(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        กรุณากรอกอาการเบื้องต้น
                                    </Form.Control.Feedback>
                                </Form.Group>
                            <p><b>บริการ :</b> {props.data.service_name}</p>
                            <p><b>วันที่ :</b> {new Date(props.data.date).toLocaleDateString()}</p>
                            <p><b>เวลา :</b> {props.data.time}</p>
                            <p><b>ห้อง :</b> {props.data.room_name}</p>
                            <p><b>หมายเหตุ :</b> {props.data.note}</p>
                            {appoint_status == "รอแก้ไข" &&
                            <>
                                <p className="d-inline-block"><b>หมายเหตุ :</b></p> <p className="text-danger d-inline-block">{props.data.note}</p>
                            </>                        
                            }
                            <p><b>อัพโหลดภาพการชำระเงิน : </b></p>

                            <Form.Group controlId="formFile">

                                <Form.Control
                                    required
                                    type="file"
                                    name="file"
                                    onChange={onFileSelected} />
                            </Form.Group>
                </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button style={{width:"100%"}} variant="success" as="input" type="submit" value="บันทึกข้อมูล"/>

                    <Button variant="danger" onClick={props.onClose}>ปิด</Button>

                </Modal.Footer>

                </Form>


            </Modal>
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