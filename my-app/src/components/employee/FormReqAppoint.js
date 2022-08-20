import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import './employee.css';
import { Form } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { API_GET } from '../../api';

export default function FormReqAppoint() {
    let date = new Date().toLocaleDateString();
    let pages = 2;
    let params = useParams();

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

    const [appoint_status,setAppointStatus] = useState('');
    const [appoint_time,setAppointTime] = useState("");
    const [appoint_date,setAppointDate] = useState("");
    const [service_name,setServiceName] = useState("");
    const [roomName, setRoomName] = useState("");
    const [cost_deposit, setCostDeposit] = useState("");

    const [appointments, setAppointments] = useState([]);

    console.log(appoint_status);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(
                "http://localhost:8080/api/appointment",
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
            setAppointments(json.data);
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData(appoint_id) {
            let json = await API_GET("appointment");
            var data = json.data[appoint_id-1];

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
            setAppointDate(data.date);
            setAppointStatus(data.appoint_status);
            setRoomName(data.room_name);
            setCostDeposit(data.cost_deposit);
        }

        if (params.appoint_id != "add") {
            fetchData([params.appoint_id]);
        }
    },[params.appoint_id])

    return (
        <>
            <div className="container-fluid">
                <div className='top row'>
                    <div className='col'>
                        <p>สถานะ : พนักงาน</p>
                    </div>
                </div>

                <div className='row'>
                    <div className='p-0 col-12 col-lg-2'>
                        <div className='sidebar'>
                            <Sidebar pages={pages}/>
                        </div>
                    </div>
                    
                    <div className='p-0 m-0 col-12 col-lg-10'>
                        <div className="content" style={{height:"100%"}}>
                            <div className="container m-auto">

                                <div className='req-form-details mt-5 shadow'>
                                    <div className='req-appoint-label p-3'>
                                        <p>รายละเอียดการนัดหมาย</p>
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
                                            <h6 className='mt-3'>ผู้รับหน้าที่ดูแล :</h6>
                                        </div>

                                        <div className="col-9 box-details mb-2">
                                            <h6>{service_name}</h6>
                                            <h6>{cost_deposit}</h6>
                                            <h6>{new Date(appoint_date).toLocaleDateString()}</h6>
                                            <h6>{appoint_time}</h6>
                                            <h6>{roomName}</h6>
                                            <h6>
                                                <Form.Select>
                                                    <option label='เลือกผู้รับหน้าที่'></option>
                                                    <option value="1">สพ.ญ.ณัฐิยา ไชยสุวรรณ</option>
                                                    <option value="2">น.สพ.สาโรช ไชยสุวรรณ</option>
                                                </Form.Select>
                                            </h6>
                                        </div>
                                    </div>

                                    <div className="end">
                                        {/*  */}
                                    </div>

                                    <div className="row p-3">
                                        
                                        <div className="col-3">
                                            <Form.Select 
                                            value={appoint_status}
                                            required
                                            onChange={(e) => setAppointStatus(e.target.value)}
                                            >
                                                <option label="Action"></option>
                                                <option value="1">รออนุมัติ</option>
                                                <option value="2">รอแก้ไข</option>
                                                <option value="3">ยกเลิก</option>
                                            </Form.Select>
                                        </div>

                                        <div className="col-6">
                                            {appoint_status >1 &&
                                            <>
                                                <Form.Control
                                                type="text"
                                                placeholder="หมายเหตุ"
                                                required>
                                                </Form.Control>
                                            </>}

                                        </div>


                                        <div className="col-3">
                                            <button className="btn btn-success">{<i className="fa-solid fa-eye me-2"></i>}ข้อมูลการชำระเงิน</button>
                                        </div>
                                        
                                    </div>
                                    
        

                                    <div className="text-center p-3">
                                        <button className='btn btn-success' style={{width:"10%"}}>บันทึกข้อมูล</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">              
                    <div className='bottom'>
                        <div>
                            <p>วันที่ : {date}</p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}