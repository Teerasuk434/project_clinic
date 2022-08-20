import BoxTop from "./Box-top"
import Navigation from "./Navigation"
import Footer from "./Footer"
import './Appointment.css'
import { useEffect, useState } from "react";
import {Form,Col,Row,Button} from 'react-bootstrap';
import { Link } from "react-router-dom";
import { API_POST,API_GET} from '../api'
import Moment from 'moment';

export default function Appointment(){

    const nowDate = Moment().format('YYYY-MM-DD')
    const splitDate = nowDate.split("-")

    const dayMin = ((parseInt(splitDate[2]))+2);
    const minDate = (splitDate[0]+"-"+splitDate[1]+"-"+dayMin);

    const dayMax = ((parseInt(splitDate[2]))+9);
    const maxDate = (splitDate[0]+"-"+splitDate[1]+"-"+dayMax);


    const [pet_id,setPetId] = useState(0);
    const [pet_name,setPetName] = useState("");
    const [pet_type,setPetType] = useState("");
    const [pet_species,setPetSpecies] = useState("");
    const [pet_gender,setPetGender] = useState("");
    const [pet_age_year,setPetAgeYear] = useState(0);
    const [pet_age_month,setPetAgeMonth] = useState(0);

    const [date,setDate] = useState(minDate);
    const [time,setTime] = useState("");
    const [symptoms,setSymptoms] = useState("");

    const [listPets,setListPets] = useState([]);
    const [pet,setPet] = useState([]);

    console.log(date);
    const [listServices,setListServices] = useState([]);
    const [service,setService] = useState('');
    const [validated,setValidated] = useState(false);

    let user_id = localStorage.getItem("user_id");

    useEffect(()=>{
        async function fetchData(user_id){
            let json = await API_POST("listpets/" + user_id);
            setListPets(json.data);

            let json2 = await API_GET("service");
            setListServices(json2.data);
        }
        fetchData(user_id);
                   
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
                                            <option value="1">บูบู้</option>
                                            <option value="2">จุ๊กกรู๊</option>
                                            <option value="3">แมว</option>
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
                                                กรุณาเลือกวันที่
                                            </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>

                                <Row className="mx-1 mt-5">
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