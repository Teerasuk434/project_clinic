import { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import { Form ,Button} from 'react-bootstrap';
import {useNavigate, useParams } from 'react-router-dom';
import { API_GET, API_POST } from '../../api';
import { ShowPaymentModal,ConfirmModal } from '../Modal';
import Top from '../Top';

export default function FormReqAppoint() {
    let pages = 2;
    let params = useParams();
    let navigate = useNavigate();

    const [appoint_id,setAppointId] = useState(0);
    const [cust_fname,setCustFname] = useState("");
    const [cust_lname,setCustLname] = useState("");
    const [cust_tel,setCustTel] = useState("");
    const [cust_email,setCustEmail] = useState("");

    const [pet_name,setPetName] = useState("");
    const [pet_type,setPetType] = useState("");
    const [pet_species,setPetSpecies] = useState("");
    const [pet_gender,setPetGender] = useState("");
    const [pet_age_year,setPetAgeYear] = useState(0);
    const [pet_age_month,setPetAgeMonth] = useState(0);
    const [symtoms,setSymtoms] = useState("");

    const [appoint_status,setAppointStatus] = useState(0);
    const [status, setStatus] = useState([]);
    const [appoint_time,setAppointTime] = useState("");
    const [appoint_time_end ,setAppointTimeEnd] = useState("");
    const [appoint_date,setAppointDate] = useState("");
    const [service_name,setServiceName] = useState("");
    const [appoint_note ,setAppointNote] = useState("");

    const [room_id, setRoomId] = useState(0);
    const [roomName, setRoomName] = useState("");
    const [cost_deposit, setCostDeposit] = useState("");

    const [paymentImage, setPaymentImage] = useState("");

    const [showImageModal, setShowImageModal] = useState(false);
    const [paymentTitleModal, setPaymentTitleModal] = useState("");
    const [paymentImageModal, setPaymentImageModal] = useState("");

    const [employee, setEmployee] = useState([]);
    const [emp_id, setEmpId] = useState(0);

    const [validated,setValidated] = useState(false);   

    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalMessage, setConfirmModalMessage] = useState("");

    useEffect(() => {
        async function fetchData(appoint_id) {
            let json = await API_GET("req_appointment");
            let data
            
            if(json.result){
                json.data.map(item=>{
                    if(item.appoint_id === appoint_id){
                        data = item
                    }
                })
            }

            setAppointId(data.appoint_id);
            setCustFname(data.cust_fname);
            setCustLname(data.cust_lname);
            setCustTel(data.cust_tel);
            setCustEmail(data.email);

            setPetAgeYear(data.pet_age_year);
            setPetAgeMonth(data.pet_age_month);
            setPetName(data.pet_name);
            setPetType(data.pet_type);
            setPetGender(data.pet_gender);
            setPetSpecies(data.pet_species);
            setServiceName(data.service_name);
            setSymtoms(data.symtoms);

            setAppointTime(data.time);
            setAppointTimeEnd(data.time_end)
            setAppointDate(data.date);

            setAppointStatus(data.status_id);
            setRoomId(data.room_id)
            setRoomName(data.room_name);
            setCostDeposit(data.cost_deposit);
            setPaymentImage(data.payment_image);

            let json2 = await API_POST("schedules/emp_available",{
                date:data.date,
                time:data.time,
                time_end:data.time_end,
                status:"add"
            })
            setEmployee(json2.data)

            let json3 = await API_GET("schedules")
            
            if(json3.result){
                let schedules_data = json3.data;
                schedules_data.map(item => {
                    if(item.appoint_id === data.appoint_id){
                        setEmpId(item.emp_id)
                    }
                })
            }

            let json4 = await API_GET("appoint_status")
            let appoint_status_temp = [];

            json4.data.map(item=>{
                if(item.status_id !== 4 && item.status_id !== 5){
                    appoint_status_temp.push(item);
                }
            })
            setStatus(appoint_status_temp);

        }
        fetchData([params.appoint_id]);
    },[params.appoint_id])

    const onClickShow = () => {
        setPaymentImageModal(paymentImage);
        setPaymentTitleModal("รูปภาพการชำระเงิน");
        setShowImageModal(true);
    }

    const onCloseImageModal = () => {
        setShowImageModal(false);
    }

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

    const createSchedule = async () => {
            let json = await API_POST("schedules/add",{
                emp_id:emp_id,
                appoint_id:appoint_id,
                room_id:room_id,
                appoint_date:appoint_date,
                appoint_time:appoint_time,
                appoint_time_end:appoint_time_end,
                appoint_status:appoint_status,
                appoint_note:appoint_note
            })
    
            if(json.result){
                if(json.result) {
                    navigate("/request-appoint", { replace: true });
                }
            }
    }

    const updateAppointment = async () => {
        let json = await API_POST("req_appointment/update",{
            appoint_status:appoint_status,
            appoint_id:appoint_id,
            appoint_note:appoint_note
        })

        if(json.result){
            if(json.result) {
                navigate("/request-appoint", { replace: true });

            }
        }
    }

    const onConfirm = async () => {
        setConfirmModalTitle("ยืนยันการแก้ไขข้อมูล");
        setConfirmModalMessage("คุณต้องการแก้ไขสถานะคำขอนัดหมายใช่หรือไม่");
        setConfirmModal(true);
        
    }

    const onClickConfirm = async () => {
        if(appoint_status === 2){
            createSchedule();
        }else{
            updateAppointment();
        }
    }

    const onClose = () => {
        setConfirmModal(false);
    }

    const getNote = () =>{
        if(appoint_status === 2 || appoint_status === 3 || appoint_status === 6){

            let required_boolean;
            if(appoint_status === 3){
                required_boolean = true;
            }else{
                required_boolean = false;
            }



            return (
                <Form.Group controlId="validateEmp">
                    <Form.Label><b>หมายเหตุ :</b></Form.Label>
                        <Form.Control
                        required={required_boolean}
                        type="text"
                        placeholder="หมายเหตุ"
                        value={appoint_note}
                        onChange={(e) => setAppointNote(e.target.value)}
                        ></Form.Control>
                    
                </Form.Group>
            )
        }
    }


    return (
        <>
            <div className="container-fluid">
                <div className='row'>
                    <div className='p-0 col-12 col-lg-2'>
                        <div className='sidebar'>
                            <Sidebar pages={pages}/>
                        </div>
                    </div>
                    
                    <div className='p-0 m-0 col-12 col-lg-10'>
                        <div className="content m-auto">
                            <Top />
                            <div className="container m-auto">

                                <div className='req-form-details my-5 mx-5 shadow'>
                                    <div className='req-appoint-label p-3'>
                                        <p>รายละเอียดคำขอนัดหมาย</p>
                                    </div>

                                    <div className="form-header">
                                        <p>ข้อมูลเจ้าของสัตว์</p>
                                    </div>

                                    <div className="row">
                                        <div className="col-3 box-label">
                                            <h6>ชื่อผู้นัดหมาย :</h6>
                                            <h6>เบอร์โทรศัพท์ :</h6>
                                            <h6>อีเมล :</h6>
                                        </div>

                                        <div className="col-9 box-details">
                                            <h6>{cust_fname} {cust_lname}</h6>
                                            <h6>{cust_tel}</h6>
                                            <h6>{cust_email}</h6>
                                        </div>
                                    </div>

                                    <div className="form-header">
                                        <p>ข้อมูลสัตว์</p>
                                    </div>

                                    <div className="row">
                                        <div className="col-3 box-label">
                                            <h6>ชื่อสัตว์เลี้ยง :</h6>
                                            <h6>ประเภทสัตว์เลี้ยง :</h6>
                                            <h6>สายพันธุ์ :</h6>
                                            <h6>เพศ :</h6>
                                            <h6>อายุ :</h6>
                                            <h6>อาการเบื้องต้น :</h6>
                                        </div>

                                        <div className="col-9 box-details">
                                            <h6>{pet_name}</h6>
                                            <h6>{pet_type}</h6>
                                            <h6>{pet_species}</h6>
                                            <h6>{pet_gender}</h6>
                                            <h6>{pet_age_year} ปี {pet_age_month} เดือน</h6>
                                            <h6>{symtoms}</h6>
                                        </div>
                                    </div>

                                    <div className="form-header">
                                        <p>รายละเอียดการนัดหมาย</p>
                                    </div>
                                        <div className="row">
                                            <div className="col-3 box-label">
                                                <h6>บริการ :</h6>
                                                <h6>ค่ามัดจำ :</h6>
                                                <h6>วันที่ :</h6>
                                                <h6>เวลา :</h6>
                                                <h6>ห้องที่ใช้ :</h6>
                                                <h6>หลักฐานการชำระเงิน :</h6>
                                            </div>

                                            <div className="col-9 box-details mb-2">
                                                <h6>{service_name}</h6>
                                                <h6>{cost_deposit}</h6>
                                                <h6>{new Date(appoint_date).toLocaleDateString()}</h6>
                                                <h6>{appoint_time} - {appoint_time_end}</h6>
                                                <h6>{roomName}</h6>

                                                <div className="col-3">
                                                    <button className="btn btn-success" onClick={onClickShow}>{<i className="fa-solid fa-eye me-2"></i>}ข้อมูลการชำระเงิน</button>
                                                 </div>
                                                
                                            </div>
                                        </div>

                                        <div className="end">
                                            {/*  */}
                                        </div>

                                    <Form noValidate validated={validated} onSubmit={onSave}>
                                        <div className="row p-3">
                                        
                                            <div className="col-4">
                                                <Form.Group controlId="validateStatus">
                                                    <Form.Label><b>สถานะคำขอ :</b></Form.Label>
                                                    <Form.Select 
                                                    value={appoint_status}
                                                    required
                                                    onChange={(e) => setAppointStatus(e.target.value)}
                                                    >
                                                        <option label="กรุณาเลือกสถานะ"></option> 
                                                        {
                                                            status.map(item => (
                                                                <option key={item.status_id} value={item.status_id}> {item.status_name} </option>
                                                            ))
                                                        }
                                                    </Form.Select>
                                                    <Form.Control.Feedback type="invalid">
                                                        กรุณาเลือกสถานะคำขอ
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </div>

                                            <div className="col-4">
                                                {appoint_status === 2 &&
                                                    <Form.Group controlId="validateEmp">
                                                        <Form.Label><b>ผู้รับหน้าที่ :</b></Form.Label>
                                                        <Form.Select
                                                            value={emp_id}
                                                            onChange={(e) => setEmpId(e.target.value)}
                                                            required>
                                                            <option label="เลือกผู้รับหน้าที่"></option>
                                                            {employee != null &&
                                                                employee.map(item => (
                                                                    <option key={item.emp_id} value={item.emp_id}>
                                                                        {item.emp_fname}   {item.emp_lname}
                                                                    </option>
                                                                ))
                                                            }
                                                        </Form.Select>
                                                        <Form.Control.Feedback type="invalid">
                                                            กรุณาเลือกผู้รับหน้าที่
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                }
                                            </div>

                                            <div className="col-4">
                                                {
                                                    getNote()
                                                }
                                            </div>
                                        </div>
                                        
                                        <div className="text-center p-3">
                                            <Button variant="success" as="input" type="submit" value="บันทึกข้อมูล"/>
                                        </div>
                                    </Form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ShowPaymentModal
                show={showImageModal}
                title={paymentTitleModal}
                paymentImage={paymentImageModal}
                onClose={onCloseImageModal}/>


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