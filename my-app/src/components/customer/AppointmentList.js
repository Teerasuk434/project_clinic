import BoxTop from "../Box-top";
import Footer from "../Footer";
import Navigation from "../Navigation"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { ShowAppointmentDetails,ShowAppointmentForm } from "../Modal";
import { API_POST } from "../../api";

import AppointmentItem from "./AppointmentItem";


export default function AppointmentList(){

    const [Appointments, setAppointment] = useState([]);
    const [listpets, setListPets] = useState([]);
    
    const [showAppointmentModal, setAppointmentModal] = useState(false);
    const [showAppointmentForm, setAppointmentForm] = useState(false);
    const [appointModalTitle, setAppointModalTitle] = useState("");
    const [AppointmentDetails, setAppointmentDetails] = useState({});


    useEffect(()=>{
        let user_id = localStorage.getItem("user_id");
        fetchData(user_id);
        fetchPets(user_id);
    },[])

    const fetchData = async (user_id) =>{
        let json = await API_POST("account/appointments/" + user_id);
        setAppointment(json.data);

    }

    const fetchPets = async (user_id) =>{
        let json = await API_POST("listpets/" + user_id);   
        setListPets(json.data);
    }


    const onShowAppointment = (data) =>{
        setAppointModalTitle("รายละเอียดการนัดหมาย")
        setAppointmentDetails(data);
        setAppointmentModal(true);

    }

    const onShowAppointmentForm = (data) => {
        setAppointModalTitle("แก้ไขการนัดหมาย");
        setAppointmentDetails(data);
        setAppointmentForm(true);

    }

    const onClose = () =>{
        setAppointmentModal(false);
        setAppointmentForm(false);
    }


    return(
        <>
            <BoxTop/>
                <div className="sticky-top">
                    <Navigation />
                </div>

                <div className="container profile">
                    <div className="row p-4">
                        <div className="col-2 profile-left me-3 ms-5 shadow-sm ">
                            <div className="Profile-Name text-center">
                                <img src={`http://localhost:8080/images/service1-1.png`} alt="" style={{width:"150px"}}/>
                                <h5 className="text-center mt-3">ธีรศักดิ์ เทียนชัย</h5>
                            </div>
                            <div className="border border-bottom-5 mx-2 mb-3"></div>

                            <div className="profile-sidebar">
                                <div>
                                    <Link to="/account/profile">ข้อมูลบัญชี</Link>
                                    <Link to="/account/pets">ข้อมูลสัตว์เลี้ยง</Link>
                                    <Link className="active" to="/account/appointments">ข้อมูลการนัดหมาย</Link>
                                    <Link to="/account/history-appoint">ประวัติการนัดหมาย</Link>
                                    <Link to="#">ตั้งค่ารหัสผ่าน</Link>
                                    <Link to="/">ออกจากระบบ</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-9 profile-right p-0">
                            <div className="profile-right-header p-2 text-center">
                                <h4>ข้อมูลการนัดหมาย</h4>
                            </div>

                            <div className="profile-details">
                                <div className="row mx-3 mt-5 mb-3">
                                    <div className="col m-auto text-center">
                                    {Appointments.length > 0 &&
                                    <>
                                        <Table size="sm" responsive bordered hover variant="light" className='text-center'>
                                            <thead>
                                                <tr>
                                                <th>รหัสการนัดหมาย</th>
                                                <th>ชื่อสัตว์เลี้ยง</th>
                                                <th>บริการ</th>
                                                <th>วันที่นัด</th>
                                                <th>เวลา</th>
                                                <th>สถานะ</th>
                                                <th colSpan={2}><p></p></th>
                                                </tr>
                                            </thead>
                                            <tbody className='table-group-divider align-middle'>
                                                {
                                                    Appointments.map(item => (
                                                        <AppointmentItem
                                                        key={item.appoint_id}
                                                        data={item}
                                                        onShow={onShowAppointment}
                                                        onEdit={onShowAppointmentForm}
                                                        />
                                                    ))
                                                }
                                            </tbody>
                                        </Table>
                                    </>
                                    }   
                                    {Appointments.length < 1 &&
                                        <div className="text-center d-block mt-4 ms-5">
                                            <h6 className="">ไม่พบข้อมูลการนัดหมาย</h6>
                                        </div>
                                    }   
                                    </div>

                                </div>
                                
                            </div>

                        </div>
                        <div className="col-1">

                        </div>
                    </div>
                </div>
            <Footer/>

            <ShowAppointmentDetails 
            show={showAppointmentModal}
            title={appointModalTitle}
            onClose={onClose}
            data={AppointmentDetails}
            />  

            <ShowAppointmentForm 
            show={showAppointmentForm}
            title={appointModalTitle}
            onClose={onClose}
            onShow={onShowAppointmentForm}
            data={AppointmentDetails}
            pets={listpets}
            fetch={fetchData}
            />
        </>
    )
}