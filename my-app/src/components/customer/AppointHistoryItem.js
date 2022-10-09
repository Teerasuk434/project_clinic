import { Link } from "react-router-dom";
import { ShowAppointmentDetails,ShowAppointmentForm } from "../Modal";
import { useState,useEffect } from "react";
import { Button } from "react-bootstrap";
import { API_POST } from "../../api";
import Moment from 'moment';
import { extendMoment } from 'moment-range';


    export default function AppointHistoryItem(props) {

    let appoint_status = props.data.status_id
    const moment = extendMoment(Moment);
    let time_end = moment(`${props.data.date} ${props.data.time}`).add(props.data.time_spent, 'm').format("HH:mm");

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

    const onClose = () => {
        setAppointmentModal(false);
    }


    return (
        <>
            <tr>
                <td><p>{props.data.appoint_id}</p></td>
                <td><p>{props.data.pet_name}</p></td>
                <td><p>{props.data.service_name}</p></td>
                <td><p>{moment(props.data.date).format("DD-MM-YYYY")}</p></td>
                <td><p>{props.data.time} - {time_end}</p></td>
                <td><p>{props.data.status_name}</p></td>
                <td>
                    <Button onClick={onShowAppointment} className="btn btn-success" size="sm">{<i className="fa-regular fa-eye me-2"></i>}แสดง</Button>
                </td>
            </tr>

            <ShowAppointmentDetails 
            show={showAppointmentModal}
            title={appointModalTitle}
            onClose={onClose}
            data={AppointmentDetails}
            time_end={time_end}
            />
        </>
    )
}