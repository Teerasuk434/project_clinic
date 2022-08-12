import { Button, Form, Row, Col } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_GET, API_POST } from '../../api';
import { SERVER_URL } from "../../app.config";

export default function FormService() {

    let params = useParams();

    const [serviceId, setServiceId] = useState(0);
    const [service_name, setServiceName] = useState("");
    const [cost_service, setCostService] = useState("");
    const [cost_deposit, setCostDeposit] = useState(0);
    const [time_spent, setTimeSpent] = useState("");
    const [room_type_id, setRoomTypeId] = useState(0);
    const [imageUrl, setImageUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState([]);

    const [services, setServices] = useState([]);

    const [validated, setValidated] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(
                "http://localhost:8080/api/service",
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        'Content-Type': 'application/json',
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                }
            );

            let json = await response.json();
            setServices(json.data);
        }

        fetchData();
    },[]);

    useEffect(() => {
        async function fetchData(service_id) {
            let json = await API_GET("service/" + service_id);
            var data = json.data[0];
            setServiceId(data.service_id);
            setServiceName(data.service_name);
            setCostService(data.cost_service);
            setCostDeposit(data.cost_deposit);
            setTimeSpent(data.time_spent);
            setRoomTypeId(data.room_type_id);
            setImageUrl(data.service_image);
        }

        if (params.service_id != "add") {
            fetchData([params.service_id]);
        }
    },[params.service_id])
    
    const onSave = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if (params.service_id === "add") {
                doCreateService();

            } else {
                    doUpdateService();
            }
        }
        setValidated(true);
    }

    const doCreateService = async (res) => {
        const response = await fetch(
            "http://localhost:8080/api/service/add",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + localStorage.getItem("access_token")
                },
                body: JSON.stringify({
                    service_name: service_name,
                    cost_service: cost_service,
                    cost_deposit: cost_deposit,
                    time_spent: time_spent,
                    room_type_id: room_type_id
                })
            }
        );
        let json = await response.json();
        if(json.result) {
            window.location = "/services";
        }

    }

    const doUpdateService = async () => {
        const json = await API_POST("service/update", {
            service_id: serviceId,
            service_name: service_name,
            cost_service: cost_service,
            cost_deposit: cost_deposit,
            time_spent: time_spent,
            room_type_id: room_type_id
        });

        if (json.result) {
            window.location = "/services";
        }
    }

    const onFileSelected = (e) => {
        if (e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    }

    const onUploadImage = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        let response = await fetch(
            SERVER_URL + "api/service/upload/" + serviceId,
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
    }

    const getImageComponent = () => {
        return (
            <div className="container m-auto">
                
                <Form>
                    <Row>
                        <Form.Group as={Col} md="3" controlId="formImage" className="mb-3">
                            <img src={`${SERVER_URL}images/${imageUrl}`} width={150} alt="Upload status"/>
                        </Form.Group>
                        <Form.Group as={Col} md="9" controlId="formFile" className="mb-3">
                            <Form.Label>เลือกรูปภาพ</Form.Label>
                            <Form.Control
                                type="file"
                                name="file"
                                onChange={onFileSelected} />
                            <Button
                                type="button"
                                className="mt-3"
                                onClick={onUploadImage}
                            >upload</Button>
                        </Form.Group>
                    </Row>
                </Form>
            </div>
        );
    }


    return (
        <>
            {
                (params.serviceId != "add") ? 
                getImageComponent() : <></>
            }
            <div className='container m-auto'>
                <Form noValidate validated={validated} onSubmit={onSave}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="validateServiceName">
                            <Form.Label>ชื่อบริการ</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={service_name}
                                placeholder="ชื่อบริการ"
                                onChange={(e) => setServiceName(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                กรุณากรอก ชื่อบริการ
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="validateCostService">
                            <Form.Label>ค่าบริการ</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={cost_service}
                                placeholder="ค่าบริการ"
                                onChange={(e) => setCostService(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                กรุณากรอก ค่าบริการ
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="validateCostDeposit">
                            <Form.Label>ค่ามัดจำ</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={cost_deposit}
                                placeholder="ค่ามัดจำ"
                                onChange={(e) => setCostDeposit(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                กรุณากรอก ค่ามัดจำ
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="validateTimeSpent">
                            <Form.Label>เวลาที่ใช้ (นาที) </Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    value={time_spent}
                                    placeholder="เวลาที่ใช้"
                                    onChange={(e) => setTimeSpent(e.target.value)}
                            />
                                <Form.Control.Feedback type="invalid">
                                    กรุณากรอก เวลาที่ใช้
                                </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="validateRoomUse">
                            <Form.Label>ห้องที่ใช้</Form.Label>
                                <Form.Control
                                    required
                                    type="text"
                                    value={room_type_id}
                                    placeholder="ห้องที่ใช้"
                                    onChange={(e) => setRoomTypeId(e.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    กรุณากรอก ห้องที่ใช้
                                </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Button variant="primary" as="input" type="submit" value="SAVE"/>
                    </Row>
                </Form>
            </div>
        </>
    )
}