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
    const timeStart = Moment().set('hour',13).set('minute',0).format('HH:mm');
    const timeEnd = Moment().set('hour',19).set('minute',0).format('HH:mm');


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
    const [symptoms,setSymptoms] = useState("");

    const [listPets,setListPets] = useState([]);
    const [listServices,setListServices] = useState([]);
    const [appointments,setAppointments] = useState([]);

    const [service,setService] = useState('');
    const [validated,setValidated] = useState(false);
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
            const range = moment.range(`2022-09-01 13:00`, `2022-09-01 18:45`);
            let timeSlot = [];
            let stepSlot = listServices[service-1].time_spent
            const hours = Array.from(range.by('minute',{step:stepSlot}));
            let index = 0;
            // hours.map(item => timeSlot.push({"id":index++,"time":item.format('HH:mm')}))
            hours.map(time => 
                {
                    timeSlot.push(
                        {
                            "id":index++,
                            "time":(time.format('HH:mm').toString())
                        }
                    )
                }
                
            )
            setTimeSlot(timeSlot)
        }

    },[service])


    const onSave = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
           console.log("บันทีกข้อมูล");
        }
        setValidated(true);
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

                        <div className="form-pet-content p-3">
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
                                        <Form.Select
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            required>
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
                                            value={symptoms}
                                            onChange={(e) => setSymptoms(e.target.value)}
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
                                    <input className="form-control" type="file" id="formFile" required/>
                                </div>

                                <Row className="mx-1 mt-2">
                                    <Button variant="primary" as="input" type="submit" value="นัดหมาย"/>
                                </Row>

                        </div>

                    </div>

                    </Form>
                </div>

            <Footer/>
        </>
    )
}