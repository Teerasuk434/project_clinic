import BoxTop from "../Box-top"
import Navigation from "../Navigation"
import Footer from "../Footer"
import { useEffect, useState } from "react";
import {Form,Col,Row,Button,InputGroup} from 'react-bootstrap';
import { Link,useNavigate  } from "react-router-dom";
import { API_POST,API_GET} from '../../api'
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { SERVER_URL } from "../../app.config";
import { ConfirmModal,SuccessAppointmentModal } from "../Modal";
import Flatpickr from "react-flatpickr";
import 'flatpickr/dist/themes/material_blue.css'
import { FailModal } from "../Modal";

export default function Appointment(){

    const moment = extendMoment(Moment);

    const minDate = (Moment().add(2, 'days').format('YYYY-MM-DD'));

    const [pet_id,setPetId] = useState(0);
    const [pet_name,setPetName] = useState("");
    const [pet_type,setPetType] = useState("");
    const [pet_species,setPetSpecies] = useState("");
    const [pet_gender,setPetGender] = useState("");
    const [pet_age_year,setPetAgeYear] = useState(0);
    const [pet_age_month,setPetAgeMonth] = useState(0);

    const [date,setDate] = useState(new Date());
    const [time,setTime] = useState("");
    const [timeSlot,setTimeSlot] = useState([]);
    const [symtoms,setSymtoms] = useState("");

    const [room_available, setRoomAvailable] = useState([]);

    const [listPets,setListPets] = useState([]);
    const [listServices,setListServices] = useState([]);
    const [appointments,setAppointments] = useState([]);

    const [service,setService] = useState('');
    const [service_timespent, setServiceTimeSpent] = useState(0);
    const [validated,setValidated] = useState(false);

    const [isSelectPet, setIsSelectPet] = useState(true);
    const [isSelectService, setIsSelectService] = useState(false);

    const [selectedFile, setSelectedFile] = useState([]);

    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalMessage, setConfirmModalMessage] = useState("");

    const [successAppoint, setSuccessAppoint] = useState(false);
    const [successAppointTitle, setSuccessAppointTitle] = useState("");
    const [successAppointMessage, setSuccessAppointMessage] = useState("");

    const [failModal, setFailModal] = useState(false);
    const [failModalTitle, setFailModalTitle] = useState("");
    const [failModalMessage, setFailModalMessage] = useState("");

    const [checkScore, setScore] = useState(0);

    let navigate = useNavigate();

    const dateOptions = {
        "disable": [
            function(date) {
                // return true to disable
                return date.getDay() == 6;
    
            }
        ],
        dateFormat: "Y-m-d",
        minDate: new Date().fp_incr(2),
        maxDate: new Date().fp_incr(9)
    }

    let user_id = localStorage.getItem("user_id");
    let role_id = localStorage.getItem("role_id");
    
    if(user_id == null || role_id != 1){
        navigate("/login", { replace: true});
    }

    useEffect(()=>{
        async function fetchData(user_id){
            let json = await API_POST("listpets/" + user_id);
            setListPets(json.data);

            console.log(json)

            if(json.result){
                let data = await API_POST("appoint_score/" + json.cust_id);

                if(data.result){
                    let score = data.data.appoint_score

                    if(score >= 3){
                        setFailModalTitle("ไม่สามารถทำการนัดหมายได้");
                        setFailModalMessage("เนื่องจากท่านมีนัดหมายที่ยกเลิก หรือไม่ได้มาตามนัดครบ 3 ครั้งแล้ว จึงไม่สามารถทำการนัดหมายได้อีก")
                        setFailModal(true);
                    }
                }
            }

            let json2 = await API_GET("service");
            setListServices(json2.data);
            console.log(json2.data)

            let json3 = await API_GET("appointment");
            setAppointments(json3.data);
        }
        fetchData(user_id);
        setTime(minDate);
                   
    },[])

    useEffect(()=>{
        if(pet_id != 0){
            listPets.map(item => {
                if(item.pet_id == pet_id){
                    setPetName(item.pet_name);
                    setPetType(item.pet_type);
                    setPetSpecies(item.pet_species);
                    setPetGender(item.pet_gender);
                    setPetAgeYear(item.pet_age_year);
                    setPetAgeMonth(item.pet_age_month);
                }
            })
        }else{
            setPetName("");
            setPetType("");
            setPetSpecies("");
            setPetGender("");
            setPetAgeYear(0);
            setPetAgeMonth(0);
        }
    },[pet_id])

    useEffect(()=>{
        if(service != [] && time != ""){
            setTimeSlots();
            setServiceTimeSpent(listServices[service-1].time_spent);
        }
    },[service])

    useEffect(() => {
        console.log(date)
        if(pet_id != 0){
            setTimeSlots();
        }
    },[date,time])

    useEffect(()=>{
        if(pet_id != 0 || pet_id != ""){
            setIsSelectPet(false);
            if(service !=""){
                setIsSelectService(false);
            }else{
                setIsSelectService(true);
            }
         }else{
            setIsSelectPet(true);
         }

         
    },[pet_id,service])

    const setTimeSlots = async () => {

        let service_time = listServices[service-1].time_spent;
        let room_type_id = listServices[service-1].room_type_id;
        let index = 0;
        let count_room;
        let rooms = [];

        let json = await API_POST("room/room_types",{
            room_type_id:room_type_id
        });

        if(json.result){
            rooms = json.data;
        }

        const range = moment.range(`${date} 13:00`, `${date} 19:00`);
        let timeSlot = [];
        let stepSlot = service_time;
        const hours = Array.from(range.by('minute',{step:stepSlot}));
        let room_available_temp = [];

        hours.map(time => 
            {
                let room_used = [];
                let check_time_between = false;
                count_room = 0;     

                if(appointments != null){
                    appointments.map(item => {

                        let time_start = moment(`${date} ${item.time}`);
                        let time_end = moment(`${date} ${item.time_end}`);
                        check_time_between = moment(time).isBetween(time_start, time_end);

                        console.log(time.format("HH:mm") + " " + time_start.format("HH:mm") + " " + time_end.format("HH:mm"))

                        if(date == item.date && item.room_type_id == room_type_id){
                            if(time.format("HH:mm") == item.time || check_time_between == true){
                                count_room++;
                                room_used.push(item.room_id);   
                                console.log("count_room = " + count_room)
                            }

                        }
                    })
                }

                console.log(count_room)
                if(count_room == 0){ 
                    console.log("count 0")
                    if(appointments != null){
                        check_time_between = false;
                        for(let i=0;i<appointments.length;i++){
                            // console.log("time slot = " + time.format("HH:mm"));
                            if(date == appointments[i].date && time.format("HH:mm") == appointments[i].time && appointments[i].room_type_id == room_type_id && appointments[i].appoint_status != "ยกเลิก"){
                                count_room++;
                                room_used.push(appointments[i].room_id);    


                                let time_start = moment(`${date} ${appointments[i].time}`);
                                let time_end = moment(`${date} ${appointments[i].time_end}`);
        
                                check_time_between = moment(time).isBetween(time_start, time_end);
                                // console.log("status : " + check_time_between)
                                console.log(time.format("HH:mm") +" " + time_start.format("HH:mm") + " " + time_end.format("HH:mm"))
                                if(check_time_between){
                                    i = appointments.length;
                                }
                                
                            }
                            
                        }
    
                        if(!check_time_between){
                            rooms.map(item =>{
                                console.log("add : " + time.format("HH:mm") )
                                room_available_temp.push({
                                    date:date,
                                    time:time.format("HH:mm"),
                                    room_id:item.room_id })
                            })
                        }
    
                        setRoomAvailable(room_available_temp);
                    }else{
                        rooms.map(item =>{
                            room_available_temp.push({
                                date:date,
                                time:time.format("HH:mm"),
                                room_id:item.room_id })
                        })
                        setRoomAvailable(room_available_temp);

                    }

                }else if(count_room > 0){
                    // console.log("else if")
                    rooms.map(item => {
                        let room_boolean = room_used.find(item2 => {
                            if(item2 === item.room_id){
                                return true
                            }else{
                                return false
                            }
                        });

                        if(!room_boolean){
                            room_available_temp.push({
                                date:date,
                                time:time.format("HH:mm"),
                                room_id:item.room_id })
                        }
                    })

                    setRoomAvailable(room_available_temp)
                    

                }
                
                if(count_room < rooms.length && time.format("HH:mm") != "19:00" ){
                    console.log("add")
                    timeSlot.push(
                        {
                            "id":index++,
                            "time":(time.format('HH:mm').toString())
                        }
                    )
                }
                
            }
            
        )
        setTimeSlot(timeSlot)
        console.log(timeSlot)

    }

    const onSave = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setConfirmModalTitle("ยืนยันการนัดหมาย");
            setConfirmModalMessage("คุณต้องการจะทำการนัดหมายใช่หรือไม่")
            setConfirmModal(true);
        }
        setValidated(true);
    }

    const onConfirm = async () => {
        setConfirmModal(false);
        doCreateAppointment();
    }

    const onCancle = () => {
        setConfirmModal(false);
    }

    const doCreateAppointment = async () => {

        let room_id = [];
        let time_end = moment(`${date} ${time}`).add(service_timespent, 'm').format("HH:mm");
        console.log(time_end)

        room_available.map(item=>{
            if(item.date == date && item.time == time){
                room_id.push(item.room_id)
            }
        })

        const json = await API_POST("appointment/add", {
            symtoms:symtoms,
            date:date,
            time:time,
            time_end:time_end,
            appoint_status:1,
            note:"ไม่มี",
            pet_id:pet_id,
            service_id:listServices[service-1].service_id,
            room_id:room_id[0]
        });

        onUploadImage( json.appoint_id);
    
        if (json.result) {
            setSuccessAppointTitle("นัดหมาย");
            setSuccessAppointMessage("นัดหมายสำเร็จแล้ว");
            setSuccessAppoint(true);
        }
    }

    const onFileSelected = (e) => {
        if (e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    }

    const onUploadImage = async (appoint_new_id) => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        console.log(formData);
        console.log(appoint_new_id)

        let response = await fetch(
            SERVER_URL + "api/appointment/upload/" + appoint_new_id,
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
    }

    const onCloseSuccess = () => {
        setSuccessAppoint(false);
        setFailModal(false);
        navigate("/", {replace: false });

    }

    return (
        <>
            <BoxTop/>
                <div className="sticky-top">
                    <Navigation />
                </div>

                <div className="container appointment p-4">
                    <div className="appoint-header shadow">
                        <h4>นัดหมายบริการ</h4>
                    </div>

                        <Form noValidate validated={validated} onSubmit={onSave}>
                            <div className="appoint-form mt-5">
        
                                <div className="form-title text-center mb-3 border border-2 border-primary p-3">
                                    <h6 className="text-dark">การนัดหมายจะเป็นการนัดหมายล่วงหน้า 2 วัน และมีการเก็บค่ามัดจำขึ้นอยู่กับบริการที่เลือก</h6>
                                    <h6 className="text-danger">* หากนัดหมายแล้วไม่มาตามนัดหรือยกเลิก จะไม่ได้ค่ามัดจำคืน ถ้าหากครบ 3 ครั้งจะไม่สามารถนัดหมายได้ *</h6>
                                </div>
        
                                <div className="form-pet-header">
                                    <h6>เลือกข้อมูลสัตว์เลี้ยง</h6>
                                </div>
        
                                <div className="form-pet-content py-3 ps-5">
                                <Form.Select
                                    value={pet_id}
                                    onChange={(e) => setPetId(e.target.value)}
                                    required>
                                    <option label="กรุณาเลือกสัตว์เลี้ยง"></option> 
                                    {
                                    listPets.map(item => (
                                        <option key={item.pet_id} value={item.pet_id}> 
                                        {item.pet_name} </option>
                                    ))
                                    }
                                </Form.Select>
        
                                    <h6 className="mt-3 text-center">ยังไม่มีข้อมูลสัตว์เลี้ยง ? <Link to="/account/pets">เพิ่มข้อมูลสัตว์เลี้ยง</Link></h6>
                                </div>
        
                            </div>
                            
                            <fieldset disabled={isSelectPet}>
        
                                <div className="appoint-form mt-4 row">
                                    <div className="form-pet-header">
                                        <h6>ข้อมูลสัตว์เลี้ยง</h6>
                                    </div>
        
                                    <div className="form-pet-details p-3">
                                        <div className="row">
                                            <div className="col-5 col-md-2 form-pet-label"><p>ชื่อสัตว์เลี้ยง :</p></div>
                                            <div className="col-7 col-md-10 form-pet-data"><p>{pet_name}</p></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-5 col-md-2 form-pet-label"><p>ประเภทสัตว์ :</p></div>
                                            <div className="col-7 col-md-10 form-pet-data"><p>{pet_type}</p></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-5 col-md-2 form-pet-label"><p>สายพันธุ์ :</p></div>
                                            <div className="col-7 col-md-10 form-pet-data"><p>{pet_species}</p></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-5 col-md-2 form-pet-label "><p>เพศ :</p></div>
                                            <div className="col-7 col-md-10 form-pet-data"><p>{pet_gender}</p></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-5 col-md-2 form-pet-label"><p>อายุ :</p></div>
                                            <div className="col-7 col-md-10 form-pet-data"><p>{`${pet_age_year} ปี ${pet_age_month} เดือน`}</p></div>
                                        </div>
                                    </div>
                                </div>
        
                                <div className="appoint-form mt-4">
                                    <div className="form-appoint-header">
                                        <h6>รายละเอียดการนัดหมาย</h6>
                                    </div>
        
                                    <div className="form-appoint-content py-3 px-3">
                                            <Row className="mb-3">
                                                <Form.Group as={Col} controlId="validateRoleType">
                                                    <Form.Label>บริการ</Form.Label>
                                                    <Form.Select
                                                        value={service}
                                                        onChange={(e) => setService(e.target.value)}
                                                        required>
                                                        <option label="กรุณาเลือกบริการ"></option> 
                                                        {
                                                        listServices.map(item => (
                                                            <option key={item.service_id} value={item.service_id}> 
                                                            {item.service_name} </option>
                                                        ))
                                                        }
                                                    </Form.Select>
                                                        <Form.Control.Feedback type="invalid">
                                                            กรุณาเลือกบริการ
                                                        </Form.Control.Feedback>
                                                </Form.Group>
                                            </Row>
        
                                        <fieldset disabled={isSelectService}>
        
                                            <Row className="mb-3">
                                                <Form.Group as={Col} xs="12" md="6" controlId="validateDate">
                                                    <Form.Label className="d-block">วันที่</Form.Label>
                                                    {/* <Form.Control
                                                        required
                                                        type="date"
                                                        value={date}
                                                        min={minDate}
                                                        max={maxDate}
                                                        placeholder="เลือกวันที่"
                                                        id="date"
                                                        onChange={(e) => setDate(e.target.value)}
                                                    /> */}
                                                        <InputGroup hasValidation>
                                                            <Flatpickr
                                                                type="text"
                                                                className="w-75 rounded border-secondary border-opacity-25 p-1 form-control"
                                                                value={date}
                                                                options={dateOptions}
                                                                onChange={(_, str) => setDate(str)}
                                                                required
                                                                placeholder="เลือกวันที่.."
                                                                />
                                                            <InputGroup.Text id="inputGroupPrepend"><i className="fa-solid fa-calendar-days"></i></InputGroup.Text>
        
                                                        <Form.Control.Feedback type="invalid">
                                                            กรุณาเลือกวันที่
                                                        </Form.Control.Feedback>
                                                    </InputGroup>
                                                    
        
                                                </Form.Group>
        
                                                <Form.Group as={Col} xs="12" md="6" controlId="validateRoleType">
                                                    <Form.Label>เลือกเวลา</Form.Label>
                                                    <Form.Select value={time} onChange={(e) => setTime(e.target.value)}required>
                                                
                                                        <option label="กรุณาเลือกเวลา"></option> 
        
                                                        {service != "" &&
                                                        timeSlot.map(item => (
                                                            <option key={item.id} value={item.time}> 
                                                                {item.time} - {moment(`${date} ${item.time}`).add(listServices[service-1].time_spent, 'm').format("HH:mm")}
                                                            </option>
                                                        ))
                                                        }
                                                    </Form.Select>
                                                        <Form.Control.Feedback type="invalid">
                                                            กรุณาเลือกเวลา
                                                        </Form.Control.Feedback>
                                                </Form.Group>
                                            </Row>
        
                                            <Row className="mb-3">
                                                <Form.Group as={Col}controlId="validateRoleType">
                                                    <Form.Label>อาการเบื้องต้น</Form.Label>
                                                    <Form.Control
                                                        required
                                                        as="textarea"
                                                        value={symtoms}
                                                        onChange={(e) => setSymtoms(e.target.value)}
                                                    />
                                                        <Form.Control.Feedback type="invalid">
                                                            กรุณาระบุอาการเบื้องต้น
                                                        </Form.Control.Feedback>
                                                </Form.Group>
                                            </Row>
                                            
                                            
                                            <div className="mb-3">
                                                {service != 0 && 
                                                    <>
                                                        <h4 className="text-center bg-warning p-1"><b>ค่ามัดจำ :</b> {listServices[service-1].cost_deposit} บาท</h4>

                                                         <div className="text-center mt-3">
                                                            <h5><b>ช่องทางการชำระเงิน</b></h5>
                                                            <img src={`http://localhost:8080/images/qr_code_payment.jpg`} alt="" className="payment-img"/>
                                                         </div>
                                                    </>
                                                
                                                }
                                            </div>
        
                                            <div class="mb-3">
                                                <Form.Group as={Col} controlId="formFile">
                                                    <Form.Label>อัพโหลดภาพการชำระเงิน</Form.Label>
                                                    <Form.Control
                                                        required
                                                        type="file"
                                                        name="file"
                                                        onChange={onFileSelected} />
                                                </Form.Group>
                                            </div>
        
                                        </fieldset> 
        
                                            <Row className="mx-1 mt-2">
                                                <Button variant="primary" as="input" type="submit" value="นัดหมาย"/>
                                            </Row>
        
                                    </div>
                                </div>
        
                            </fieldset>
    
                        </Form>
                </div>

            <Footer/>

            <ConfirmModal
                show={confirmModal}
                title={confirmModalTitle}
                message={confirmModalMessage}
                onConfirm={onConfirm}
                onClose={onCancle}
            />

            <SuccessAppointmentModal
                show={successAppoint}
                title={successAppointTitle}
                message={successAppointMessage}
                onClose={onCloseSuccess}
            />

            <FailModal
                show={failModal}
                title={failModalTitle}
                message={failModalMessage}
                onClose={onCloseSuccess}
            />
        </>
    )
}