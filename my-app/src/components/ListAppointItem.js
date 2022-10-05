import { Link } from "react-router-dom";
import { ShowAppointmentDetails } from "./Modal";
import { useState,useEffect } from "react";
import { Button } from "react-bootstrap";
import Moment from 'moment';
import { extendMoment } from 'moment-range';


export default function ListAppointItem(props) {

let appoint_status = props.data.status_id
const moment = extendMoment(Moment);
let time_end = moment(`${props.data.date} ${props.data.time}`).add(props.data.time_spent, 'm').format("HH:mm");


const [showAppointmentModal, setAppointmentModal] = useState(false);
const [appointModalTitle, setAppointModalTitle] = useState("");
const [AppointmentDetails, setAppointmentDetails] = useState({});

let user_id = localStorage.getItem("user_id");


const onShowAppointment = () =>{
    setAppointmentModal(true);
    setAppointModalTitle("รายละเอียดการนัดหมาย")
    setAppointmentDetails(props.data);
}


const onClose = () =>{
    setAppointmentModal(false);
}

return (
    <>
       <tr>
            <td><p>{props.data.appoint_id}</p></td>
            <td><p>{props.data.cust_fname} {props.data.cust_lname}</p></td>
            <td><p>{props.data.pet_name}</p></td>
            <td><p>{props.data.service_name}</p></td>
            <td><p>{new Date(props.data.date).toLocaleDateString()}</p></td>
            <td><p>{props.data.time} - {props.data.time_end}</p></td>
            <td><p>{props.data.emp_name}</p></td>
            <td><p>{props.data.status_name}</p></td>
            <td>
                <div>
                    <Button  onClick={onShowAppointment} className="btn btn-success btn-sm">{<i className="fa-regular fa-eye me-2"></i>}รายละเอียด</Button>
                </div>
            </td>
            <td>
                <div>
                    <Link to={`${props.data.appoint_id}`} className="btn btn-warning btn-sm">{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Link>
                </div>
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