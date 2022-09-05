import BoxTop from "../Box-top"
import Navigation from "../Navigation"
import Footer from "../Footer"
import './Appointment.css'
import { useEffect, useState } from "react";
import {Form,Col,Row,Button} from 'react-bootstrap';
import { Link,useNavigate  } from "react-router-dom";
import { API_POST,API_GET} from '../../api'
import Moment from 'moment';
import { extendMoment } from 'moment-range';

export default function Appointment(){

    const nowDate = Moment().format('YYYY-MM-DD');
    const moment = extendMoment(Moment);
    // const splitDate = nowDate.split("-")

    // const dayMin = ((parseInt(splitDate[2]))+2);
    // const minDate = (splitDate[0]+"-"+splitDate[1]+"-"+dayMin);

    // const dayMax = ((parseInt(splitDate[2]))+9);
    // const maxDate = (splitDate[0]+"-"+splitDate[1]+"-"+dayMax);

    const minDate = (Moment().add(2, 'days').format('YYYY-MM-DD'));
    const maxDate = (Moment().add(8, 'days').format('YYYY-MM-DD'));

    const [pet_id,setPetId] = useState(0);
    const [pet_name,setPetName] = useState("");
    const [pet_type,setPetType] = useState("");
    const [pet_species,setPetSpecies] = useState("");
    const [pet_gender,setPetGender] = useState("");
    const [pet_age_year,setPetAgeYear] = useState(0);
    const [pet_age_month,setPetAgeMonth] = useState(0);

    const [date,setDate] = useState(minDate);
    const [time,setTime] = useState("");
    const [timeSlot,setTimeSlot] = useState([]);
    const [symtoms,setSymtoms] = useState("ไม่มี");

    const [rooms, setRooms] = useState([]);

    const [schedules, setSchedules] = useState([]);

    const [listPets,setListPets] = useState([]);
    const [listServices,setListServices] = useState([]);
    const [appointments,setAppointments] = useState([]);

    const [service,setService] = useState('');
    const [validated,setValidated] = useState(false);

    const [isSelectPet, setIsSelectPet] = useState(true);
    const [isSelectService, setIsSelectService] = useState(false);

    let navigate = useNavigate();

    let user_id = localStorage.getItem("user_id");
    let role_id = localStorage.getItem("role_id");
    
    if(user_id == null || role_id != 1){
        navigate("/login", { replace: true});
    }

    useEffect(()=>{
        async function fetchData(user_id){
            let json = await API_POST("listpets/" + user_id);
            setListPets(json.data);

            let json2 = await API_GET("service");
            setListServices(json2.data);

            let json3 = await API_GET("appointment");
            setAppointments(json3.data);

            let json4 = await API_GET("schedules");
            setSchedules(json4.data);
        }
        fetchData(user_id);
        setTime(minDate);
                   
    },[])

    useEffect(()=>{
        if(pet_id != 0){
            setPetName(listPets[0].pet_name);
            setPetType(listPets[0].pet_type);
            setPetSpecies(listPets[0].pet_species);
            setPetGender(listPets[0].pet_gender);
            setPetAgeYear(listPets[0].pet_age_year);
            setPetAgeMonth(listPets[0].pet_age_month);
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
        }

    },[service])

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

        rooms = json.data;
        setRooms(json.data);

        const range = moment.range(`${date} 13:00`, `${date} 18:45`);
        let timeSlot = [];
        let stepSlot = service_time;
        const hours = Array.from(range.by('minute',{step:stepSlot}));
        // hours.map(item => timeSlot.push({"id":index++,"time":item.format('HH:mm')}))
        hours.map(time => 
            {
                count_room = 0;
                appointments.map(item => {
                    if(date == item.date && time.format("HH:mm") == item.time & item.room_type_id == room_type_id){
                        count_room++;
                    }
                })

                
                
                if(count_room< rooms.length){
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

    }

    const onSave = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            doCreateAppointment();
        }
        setValidated(true);
    }

    const doCreateAppointment = async () => {
        // let room_used = [];

        // appointments.map(item =>{
        //     if(item.date == date){
        //         room_used.push(item.room_id);
        //     }
        // })

        // console.log(room_used)
        console.log("date : " +date);
        console.log("time : " +time);
        const json = await API_POST("appointment/add", {
            symtoms:symtoms,
            date:date,
            time:time,
            payment_image:"paymentxxx.png",
            appoint_status:"รอตรวจสอบ",
            note:"ไม่มี",
            pet_id:pet_id,
            service_id:listServices[service-1].service_id,
            room_id:3
        });

        // if (json.result) {
        //     window.location = "/appointment";
        // }
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

                            <h6 className="mt-3 text-center">ยังไม่มีข้อมูลสัตว์เลี้ยง ? <Link to="/pets">เพิ่มข้อมูลสัตว์เลี้ยง</Link></h6>
                        </div>

                    </div>

                    <div className="appoint-form mt-4 row">
                        <div className="form-pet-header">
                            <h6>ข้อมูลสัตว์เลี้ยง</h6>
                        </div>

                        <div className="form-pet-label p-3 col-2">
                            <p>ชื่อสัตว์เลี้ยง :</p>
                            <p>ประเภทสัตว์ :</p>
                            <p>สายพันธุ์ :</p>
                            <p>เพศ :</p>
                            <p>อายุ :</p>
                        </div>

                        <div className="form-pet-details p-3 col-10">
                            {pet_id !=0 &&
                            <>
                                <p>{pet_name}</p>
                                <p>{pet_type}</p>
                                <p>{pet_species}</p>
                                <p>{pet_gender}</p>
                                <p>{`${pet_age_year} ปี ${pet_age_month} เดือน`}</p>
                            </>
                            }
                        </div>
                    </div>
                
                <fieldset disabled={isSelectPet}>
                    <div className="appoint-form mt-4 row">
                        <div className="form-appoint-header">
                            <h6>รายละเอียดการนัดหมาย</h6>
                        </div>

                        <div className="form-appoint-content p-3">
                                <Row className="mb-3">
                                    <Form.Group as={Col}controlId="validateRoleType">
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
                                    <Form.Group as={Col}controlId="validateRoleType">
                                        <Form.Label>วันที่</Form.Label>
                                        <Form.Control
                                            required
                                            type="date"
                                            value={date}
                                            min={minDate}
                                            max={maxDate}
                                            placeholder="เลือกวันที่"
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณาเลือกวันที่
                                            </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group as={Col}controlId="validateRoleType">
                                        <Form.Label>เลือกเวลา</Form.Label>
                                        <Form.Select value={time} onChange={(e) => setTime(e.target.value)}>
                                            <option label="กรุณาเลือกเวลา"></option> 

                                            {
                                            timeSlot.map(item => (
                                                <option key={item.id} value={item.time}> 
                                                {item.time} </option>
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
                                    {service != 0 && <h6><b>ค่ามัดจำ :</b> {listServices[service-1].cost_deposit} บาท</h6>}
                                </div>

                                <div class="mb-3">
                                    <label for="formFile" clasName="form-label">อัพโหลดสลิป</label>
                                    <input className="form-control" type="file" id="formFile"/>
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
        </>
    )
}