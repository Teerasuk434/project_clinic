    import { Link } from "react-router-dom";
    import { ShowAppointmentDetails,ShowAppointmentForm } from "../Modal";
    import { useState,useEffect } from "react";
    import { Button } from "react-bootstrap";
    import { API_POST } from "../../api";

    export default function AppointmentItem(props) {

    let appoint_status = props.data.appoint_status;

    const [showAppointmentModal, setAppointmentModal] = useState(false);
    const [showAppointmentForm, setAppointmentForm] = useState(false);
    const [appointModalTitle, setAppointModalTitle] = useState("");
    const [AppointmentDetails, setAppointmentDetails] = useState({});


    const [listpets, setListPets] = useState([]);

    let user_id = localStorage.getItem("user_id");

    useEffect(()=>{
        async function fetchData(user_id){
            let json = await API_POST("listpets/" + user_id);
            setListPets(json.data);
        }
        fetchData(user_id);
                   
    },[])


    const onShowAppointment = () =>{
        setAppointmentModal(true);
        setAppointModalTitle("รายละเอียดการนัดหมาย")
        setAppointmentDetails(props.data);
    }

    const onShowAppointmentForm = () => {
        setAppointmentForm(true);
        setAppointmentDetails(props.data);
        setAppointModalTitle("แก้ไขการนัดหมาย");
    }

    const onClose = () =>{
        setAppointmentModal(false);
        setAppointmentForm(false);
    }

    return (
        <>
            <tr>
                <td><p>{props.data.appoint_id}</p></td>
                <td><p>{props.data.pet_name}</p></td>
                <td><p>{props.data.service_name}</p></td>
                <td><p>{props.data.date}</p></td>
                <td><p>{props.data.time}</p></td>
                <td><p>{props.data.status_name}</p></td>
                <td>
                    <div>
                        <Button onClick={onShowAppointment} className="btn btn-success me-3">{<i className="fa-regular fa-eye me-2"></i>}รายละเอียด</Button>
                    </div>
                </td>
                <td>
                    {appoint_status == "รอแก้ไข" &&
                        <div>
                            <Button onClick={onShowAppointmentForm} className="btn btn-warning me-3">{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Button>
                        </div>
                    }
                </td>
            </tr>
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
            data={AppointmentDetails}
            pets={listpets}
            />
        </>
    )
}