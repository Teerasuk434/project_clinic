import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Form ,Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API_GET, API_POST } from '../api';
import { ShowPaymentModal } from './Modal';
import Top from './Top';

import { ConfirmModal  } from './Modal';

export default function FormAppoint() {

    let params = useParams();
    let pages;

    let role_id = localStorage.getItem("role_id")

    if(role_id == 2){
        pages = 2;
    }else if (role_id == 3){
        pages = 3;
    }

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

    const [appointment, setAppointment] = useState({});

    const [appoint_status,setAppointStatus] = useState(0);
    const [status, setStatus] = useState([]);
    const [appoint_time,setAppointTime] = useState("");
    const [appoint_time_end, setAppointTimeEnd] = useState("")
    const [appoint_date,setAppointDate] = useState("");
    const [service_name,setServiceName] = useState("");

    const [schedule_id, setScheduleId] = useState(0);

    const [room_id, setRoomId] = useState(0);
    const [roomName, setRoomName] = useState("");
    const [cost_deposit, setCostDeposit] = useState("");

    const [paymentImage, setPaymentImage] = useState("");

    const [showImageModal, setShowImageModal] = useState(false);
    const [paymentTitleModal, setPaymentTitleModal] = useState("");
    const [paymentImageModal, setPaymentImageModal] = useState("");

    const [emp_id, setEmpId] = useState(0);
    const [emp_id_selected, setEmpIdSelected] = useState(0);
    const [emp_firstname, setEmpFirstName] = useState("");
    const [emp_lastname, setEmpLastName] = useState("");

    const [employees, setEmployees] = useState([]);

    const [validated,setValidated] = useState(false);   

    // confirmModal
    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalMessage, setConfirmModalMessage] = useState("");

    useEffect(() => {
        async function fetchData(appoint_id) {
            let json = await API_GET("appointment");
            let data;
            
            if(json.result){
                json.data.map(item=>{
                    console.log(item)
                    console.log(appoint_id)

                    if(item.appoint_id == appoint_id){
                        data = item
                        setAppointment(item);
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
            setAppointTimeEnd(data.time_end);
            setAppointDate(data.date);

            setAppointStatus(data.status_id);
            setRoomId(data.room_id)
            setRoomName(data.room_name);
            setCostDeposit(data.cost_deposit);
            setPaymentImage(data.payment_image);

            let json2 = await API_GET("schedules")
            
            if(json2.result){
                let schedules_data = json2.data;
                schedules_data.map(item => {
                    if(item.appoint_id == data.appoint_id){
                        setEmpId(item.emp_id)
                        setEmpFirstName(item.emp_fname);
                        setEmpLastName(item.emp_lname);
                        setScheduleId(item.schedule_id);
                        setEmpIdSelected(item.emp_id)
                    }
                })
            }

            console.log(json2)

            let json3 = await API_GET("appoint_status")

            let appoint_status_temp = [];
            json3.data.map(item=>{
                if(item.status_id != 1 && item.status_id != 3){
                    appoint_status_temp.push(item)

                
                }
            })

            setStatus(appoint_status_temp);

            

        }
        fetchData([params.appoint_id]);
    },[params.appoint_id])

    useEffect(() =>{
        if(appointment != null){
            fetchEmployees();
        }
    },[emp_id])

    const fetchEmployees = async () =>{
        let json = await API_POST("schedules/emp_available",{
            date:appointment.date,
            time:appointment.time,
            time_end:appointment.time_end,
            status:"edit",
            emp_id:emp_id
        })

        if(json.result){
            setEmployees(json.data);
        }
    }


    const onClickShow = () => {
        setShowImageModal(true);
        setPaymentImageModal(paymentImage);
        setPaymentTitleModal("???????????????????????????????????????????????????");
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
        let json = await API_POST("schedules/edit",{
            emp_id:emp_id_selected,
            appoint_id:appoint_id,
            room_id:room_id,
            appoint_date:appoint_date,
            appoint_time:appoint_time,
            appoint_time_end:appoint_time_end,
            appoint_status:appoint_status,
            schedule_id: schedule_id
        })

        console.log(json)

        if(json.result){
            if(json.result) {
                window.location = "/list-appoint";
            }
        }
    }

    const onConfirm = async () => {

            setConfirmModalTitle("????????????????????????????????????????????????????????????");
            setConfirmModalMessage("???????????????????????????????????????????????????????????????????????????????????????????????????");
            setConfirmModal(true);
    }

    const onConfirmUpdate = async () => {
        setConfirmModal(false);
        createSchedule();
            
    }

    const onCancelUpdate = () => {
        setConfirmModal(false);

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
                        <div className="content">
                            <Top />
                            <div className="container m-auto">

                                <div className='req-form-details my-5 mx-5 shadow'>
                                    <div className='req-appoint-label p-3'>
                                        <p>????????????????????????????????????????????????????????????</p>
                                    </div>

                                    <div className="form-header">
                                        <p>??????????????????????????????????????????????????????</p>
                                    </div>

                                    <div className="row">
                                        <div className="col-3 box-label">
                                            <h6>?????????????????????????????????????????? :</h6>
                                            <h6>??????????????????????????????????????? :</h6>
                                            <h6>??????????????? :</h6>
                                        </div>

                                        <div className="col-9 box-details">
                                            <h6>{cust_fname} {cust_lname}</h6>
                                            <h6>{cust_tel}</h6>
                                            <h6>{cust_email}</h6>
                                        </div>
                                    </div>

                                    <div className="form-header">
                                        <p>?????????????????????????????????</p>
                                    </div>

                                    <div className="row">
                                        <div className="col-3 box-label">
                                            <h6>????????????????????????????????????????????? :</h6>
                                            <h6>??????????????????????????????????????????????????? :</h6>
                                            <h6>??????????????????????????? :</h6>
                                            <h6>????????? :</h6>
                                            <h6>???????????? :</h6>
                                            <h6>?????????????????????????????????????????? :</h6>
                                        </div>

                                        <div className="col-9 box-details">
                                            <h6>{pet_name}</h6>
                                            <h6>{pet_type}</h6>
                                            <h6>{pet_species}</h6>
                                            <h6>{pet_gender}</h6>
                                            <h6>{pet_age_year} ?????? {pet_age_month} ???????????????</h6>
                                            <h6>{symtoms}</h6>
                                        </div>
                                    </div>

                                    <div className="form-header">
                                        <p>????????????????????????????????????????????????????????????</p>
                                    </div>
                                        
                                        <div className="row my-1">
                                            <div className="col-3 box-label">
                                                <h6>?????????????????? :</h6>
                                                <h6>???????????????????????? :</h6>
                                                <h6>?????????????????? :</h6>
                                                <h6>???????????? :</h6>
                                                <h6>?????????????????????????????? :</h6>
                                                <h6 className='mt-3'>??????????????????????????????????????????????????? :</h6>
                                                <h6>?????????????????????????????????????????????????????? :</h6>
                                            </div>

                                            <div className="col-9 box-details mb-2">
                                                <h6>{service_name}</h6>
                                                <h6>{cost_deposit}</h6>
                                                <h6>{new Date(appoint_date).toLocaleDateString()}</h6>
                                                <h6>{appoint_time} - {appoint_time_end}</h6>
                                                <h6>{roomName}</h6>
                                                <h6>{emp_firstname} {emp_lastname}</h6>

                                                
                                                <div className="col-3">
                                                    <button className="btn btn-success" onClick={onClickShow}>{<i className="fa-solid fa-eye me-2"></i>}???????????????????????????????????????????????????</button>
                                                 </div>

                                            </div>
                                        </div>

                                        <div className="end">-
                                        </div>
                                        
                                    <Form noValidate validated={validated} onSubmit={onSave}>

                                        <div className="row p-3">
                                            
                                            <div className="col-3"> 
                                                <Form.Group controlId="validateStatus">
                                                    <Form.Label><b>???????????????</b></Form.Label>
                                                    <Form.Select 
                                                    value={appoint_status}
                                                    required
                                                    onChange={(e) => setAppointStatus(e.target.value)}
                                                    >
                                                        <option label="?????????????????????????????????????????????"></option> 
                                                        {
                                                            status.map(item => (
                                                                <option key={item.status_id} value={item.status_id}> {item.status_name} </option>
                                                            ))
                                                        }
                                                    </Form.Select>
                                                    <Form.Control.Feedback type="invalid">
                                                        ?????????????????????????????????????????????????????????
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </div>

                                            <div className="col-4">
                                                <Form.Group controlId="validateEmp">
                                                    <Form.Label><b>??????????????????????????????????????? :</b></Form.Label>
                                                    <Form.Select
                                                        value={emp_id_selected}
                                                        onChange={(e) => setEmpIdSelected(e.target.value)}
                                                        required>
                                                        <option label="??????????????????????????????????????????????????????"></option>
                                                        {employees != null &&
                                                            employees.map(item => (
                                                                <option key={item.emp_id} value={item.emp_id}>
                                                                    {item.emp_fname}   {item.emp_lname}
                                                                </option>
                                                            ))
                                                        }
                                                    </Form.Select>
                                                    <Form.Control.Feedback type="invalid">
                                                        ?????????????????????????????????????????????????????????????????????
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            
                                            </div>

                                            <div className="col-5">
                                                {appoint_status >3  &&
                                                <>  
                                                    <Form.Group controlId="validateNote">
                                                        <Form.Label><b>???????????????????????? :</b></Form.Label>
                                                            <Form.Control
                                                            type="text"
                                                            placeholder="????????????????????????"
                                                            >
                                                            </Form.Control>
                                                    </Form.Group>
                                                </>}

                                            </div>

                                        </div>
                                        
                                        <div className="text-center p-3">
                                            <Button variant="success" as="input" type="submit" value="????????????????????????????????????"/>
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
                    onConfirm={onConfirmUpdate}
                    onClose={onCancelUpdate}/>
        </>
    )
}