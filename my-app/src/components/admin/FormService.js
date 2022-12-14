import { Button, Form, Row, Col } from 'react-bootstrap'
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { API_GET, API_POST } from '../../api';
import { ConfirmModal,MessageModal } from '../Modal';
import { SERVER_URL } from "../../app.config";

import Sidebar from '../Sidebar';
import Top from '../Top';

export default function FormService() {

    let params = useParams();
    let pages = 5;

    let navigate = useNavigate();

    const [serviceId, setServiceId] = useState(0);
    const [service_name, setServiceName] = useState("");
    const [cost_service, setCostService] = useState("");
    const [cost_deposit, setCostDeposit] = useState(0);
    const [time_spent, setTimeSpent] = useState("");
    const [room_type_id, setRoomTypeId] = useState(0);
    const [serviceImage, setServiceImage] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const [services, setServices] = useState([]);
    const [room_types, setRoomTypes] = useState([]);

    const [validated, setValidated] = useState(false);

    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalMessage, setConfirmModalMessage] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        fetchService();
        fetchRoomType();
    },[]);

    useEffect(() => {
        async function fetchData(service_id) {
            let json = await API_GET("service/" + service_id);
            var data = json.data[0];
            setServiceId(data.service_id);
            setServiceName(data.service_name);
            setCostService(data.cost_service);
            console.log(data)
            setCostDeposit(data.cost_deposit);
            setTimeSpent(data.time_spent);
            setRoomTypeId(data.room_type_id);
            setServiceImage(data.serviceImage);
            setImageUrl(data.service_image);
        }

        if (params.service_id != "add") {
            fetchData([params.service_id]);
        }
    },[params.service_id])

    const fetchService = async () => {
        let json = await API_GET("service");

        if(json.result){
            setServices(json.data)
        }
    }

    const fetchRoomType = async () =>{
        let json = await API_GET("room_type");

        if(json.result){
            setRoomTypes(json.data);
        }
    }

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

    const doCreateService = async () => {

        let json = await API_POST("service/add",{
            service_name: service_name,
            cost_service: cost_service,
            cost_deposit: cost_deposit,
            time_spent: time_spent,
            room_type_id: room_type_id,
            service_image:imageUrl
        })

        if(json.result) {
            navigate("/services", { replace: false });
        } else {
            setModalTitle("??????????????????????????????????????????????????????????????????????????????");
            setModalMessage(json.message);
            setShowModal(true);
        }

    }

    const doUpdateService = async () => {
        const json = await API_POST("service/update", {
            service_id: serviceId,
            service_name: service_name,
            cost_service: cost_service,
            cost_deposit: cost_deposit,
            time_spent: time_spent,
            room_type_id: room_type_id,
            service_image:imageUrl
        });

        if (json.result) {
            window.location = "/services";
        }else {
            setModalTitle("??????????????????????????????????????????????????????????????????????????????");
            setModalMessage(json.message);
            setShowModal(true);
        }
    }

    const onFileSelected = (e) => {
        if (e.target.files.length > 0) {
            onUploadImage(e.target.files[0])
        }
            
    }

    const onUploadImage = async (selectedFile) => {
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
        console.log(json)
        setImageUrl(json.data);
    }

    const getImageComponent = () => {
        return (
            <div className="container m-auto p-0">
                <Form>
                    <Row>
                        <Form.Group as={Col} md="6" controlId="formFile" className="mb-3">
                            <Form.Label>?????????????????????????????????</Form.Label>
                            <Form.Control
                                type="file"
                                name="file"
                                onChange={onFileSelected} />
                            <Form.Control.Feedback type="invalid">
                                ??????????????????????????????????????????????????????
                            </Form.Control.Feedback>
                        </Form.Group>
                        
                        {imageUrl != "" && 
                            <div className="col-6 text-center">
                                <img src={`${SERVER_URL}images/${imageUrl}`} width={150} alt="Upload status"/>
                            </div>
                        }
                        
                    </Row>
                </Form>
            </div>
        );
    }

    const onConfirm = async () => {
    
        if(params.service_id === "add"){
            setConfirmModalTitle("????????????????????????????????????????????????????????????");
            setConfirmModalMessage("???????????????????????????????????????????????????????????????????????????????????????????????????????????????");
            setConfirmModal(true);
        }else{

            setConfirmModalTitle("????????????????????????????????????????????????????????????");
            setConfirmModalMessage("???????????????????????????????????????????????????????????????????????????????????????????????????????????????");
            setConfirmModal(true);
        }
        
    }

    const onClickConfirm = async () => {
        setConfirmModal(false);

        if(params.service_id === "add"){
            doCreateService();
            
        }else{
            doUpdateService();
            
        }
    }

    const onClose = () => {
        setConfirmModal(false);
        setShowModal(false);
    }


    return (
        <>
            <div className="container-fluid">
                <div className='row'>
                    <div className='p-0 col-12 col-lg-2 bg-primary'>
                        <div className='sidebar'>
                            <Sidebar pages={pages}/>
                        </div>
                    </div>

                    <div className='p-0 m-0 col-12 col-lg-10'>
                    <Top />

                        <div className="content p-5">
                            
                            <div className='shadow bg-light p-5 rounded'>
                                {params.service_id == "add" ?
                                    <h4 className='text-center'>??????????????????????????????????????????????????????????????????????????????</h4>
                                :
                                    <h4 className='text-center'>??????????????????????????????????????????????????????????????????????????????</h4>

                                }

                                <div className='container m-auto px-5 py-3 mt-3 border-top border-secondary'>
                                    <Form noValidate validated={validated} onSubmit={onSave}>
                                        <Row className="mb-3">
                                            <Form.Group as={Col} md="6" controlId="validateServiceName">
                                                <Form.Label>??????????????????????????????</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    value={service_name}
                                                    placeholder="??????????????????????????????"
                                                    onChange={(e) => setServiceName(e.target.value)}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    ??????????????????????????? ??????????????????????????????
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group as={Col} md="6" controlId="validateTimeSpent">
                                                <Form.Label>?????????????????????????????? (????????????) </Form.Label>
                                                    <Form.Control
                                                        required
                                                        type="number"
                                                        min="15"
                                                        step="15"
                                                        value={time_spent}
                                                        placeholder="??????????????????????????????"
                                                        onChange={(e) => setTimeSpent(e.target.value)}
                                                />
                                                    <Form.Control.Feedback type="invalid">
                                                        ??????????????????????????? ??????????????????????????????
                                                    </Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>

                                        <Row className="mb-3">
                                            <Form.Group as={Col} md="6" controlId="validateCostService">
                                                    <Form.Label>???????????????????????????</Form.Label>
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        value={cost_service}
                                                        placeholder="???????????????????????????"
                                                        min={1}
                                                        onChange={(e) => setCostService(e.target.value)}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        ??????????????????????????? ???????????????????????????
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                            <Form.Group as={Col} md="6" controlId="validateCostDeposit">
                                                <Form.Label>????????????????????????</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="number"
                                                    value={cost_deposit}
                                                    placeholder="????????????????????????"
                                                    min={1}
                                                    onChange={(e) => setCostDeposit(e.target.value)}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    ??????????????????????????? ????????????????????????
                                                </Form.Control.Feedback>
                                            </Form.Group>


                                        </Row>

                                        <Row className="mb-3">
                                            <Form.Group as={Col} controlId="validateRoomUse">
                                                <Form.Label>??????????????????????????????</Form.Label>
                                                <Form.Select
                                                    value={room_type_id}
                                                    onChange={(e) => setRoomTypeId(e.target.value)}
                                                    required>
                                                    <option label="????????????????????????????????????????????????????????????"></option> 
                                                    {
                                                    room_types.map(item => (
                                                        <option key={item.room_type_id} value={item.room_type_id}> 
                                                        {item.room_type_name} </option>
                                                    ))
                                                    }
                                                </Form.Select>
                                                    <Form.Control.Feedback type="invalid">
                                                        ??????????????????????????? ??????????????????????????????
                                                    </Form.Control.Feedback>
                                            </Form.Group>
                                        </Row>

                                        {
                                            getImageComponent()
                                        }

                                        <Row className="mt-3">
                                            <div className="text-end">
                                                <Button variant="success" as="input" type="submit" value="??????????????????"/>
                                                <Link to="/services" className="btn btn-warning ms-2">??????????????????</Link>
                                            </div>
                                        </Row>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <MessageModal
                show={showModal}
                title={modalTitle}
                message={modalMessage}
                onClose={onClose}
            />

            <ConfirmModal 
                show={confirmModal}
                title={confirmModalTitle}
                message={confirmModalMessage}
                onConfirm={onClickConfirm}
                onClose={onClose}
            />
        </>
    )
}