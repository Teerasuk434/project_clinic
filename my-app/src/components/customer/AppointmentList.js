import BoxTop from "../Box-top";
import Footer from "../Footer";
import Navigation from "../Navigation"
import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { ShowAppointmentDetails,ShowAppointmentForm } from "../Modal";
import { API_POST } from "../../api";
import AppointmentItem from "./AppointmentItem";
import ProfileSidebar from "./ProfileSidebar";
import { SERVER_URL } from "../../app.config";



export default function AppointmentList(){

    let user_id = localStorage.getItem("user_id");


    const [Appointments, setAppointment] = useState([]);
    const [listpets, setListPets] = useState([]);
    
    const [showAppointmentModal, setAppointmentModal] = useState(false);
    const [showAppointmentForm, setAppointmentForm] = useState(false);
    const [appointModalTitle, setAppointModalTitle] = useState("");
    const [AppointmentDetails, setAppointmentDetails] = useState({});

    const [appoint_id,setAppointId] = useState(0);
    const [payment_image, setPaymentImage] = useState("");
    const [pet_id,setPetId] = useState(0);
    const [validated,setValidated] = useState(false);
    const [symtoms, setSymtoms] = useState("");

    const [selectedFile, setSelectedFile] = useState([]);
    const [imageUrl, setImageUrl] = useState("");
    
    let pages = 3;

    useEffect(()=>{
        fetchData();
        fetchPets();
    },[])

    const fetchData = async () =>{
        let json = await API_POST("account/appointments/" + user_id);
        setAppointment(json.data);
        console.log(json)
    }
    
    const fetchPets = async () =>{
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

    const onFileSelected = (e) => {
        if (e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
        onUploadImage(e.target.files[0])
    }

    const onUploadImage = async (selectedFile) => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        let response = await fetch(
            SERVER_URL + "api/payment/upload/" + appoint_id,
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

    const onSave = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            let image_url

            if(imageUrl === ""){
                image_url = payment_image;
            }else{
                image_url = imageUrl;
            }

            let json = await API_POST("account/edit-appointment",{
                pet_id:pet_id,
                symtoms:symtoms,
                payment_image:image_url,
                status_id:1,
                appoint_id:appoint_id
            })

            if(json.result){
                onClose();
                fetchData();
            }
        }
        setValidated(true);
    }

    return(
        <>
            <BoxTop/>
                <div className="sticky-top">
                    <Navigation />
                </div>

                <div className="container profile">
                    <div className="row">
                        
                        <div className="col-12 col-md-2 profile-left">
                            <ProfileSidebar pages={pages}/>
                        </div>
                        
                        <div className="col-12 col-md-10 profile-right">
                            <div className="profile-right-content">
                                <div className="profile-right-header p-2 text-center">
                                    <h4>ข้อมูลการนัดหมาย</h4>
                                </div>

                                <div className="profile-details">
                                    <div className="row mx-3 mt-5 mb-3">
                                        <div className="col m-auto text-center">
                                        {Appointments.length > 0 &&
                                        
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
                                                            setPetId={setPetId}
                                                            setSymtoms={setSymtoms}
                                                            setAppointId={setAppointId}
                                                            setPaymentImage={setPaymentImage}
                                                            />
                                                        ))
                                                    }
                                                </tbody>
                                            </Table>
                                        
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
            pet_id={pet_id}
            setPetId={setPetId}
            symtoms={symtoms}
            setSymtoms={setSymtoms}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            validated={validated}
            onSave={onSave}
            onFileSelected={onFileSelected}

            />
        </>
    )
}