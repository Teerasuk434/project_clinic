import { Button } from "react-bootstrap";
import Moment from 'moment';
import { useState } from "react";
import { ShowAppointmentDetails } from "../Modal";
import { extendMoment } from "moment-range";


export default function HistoryItem(props) {

let appoint_status = props.data.status_id
const moment = extendMoment(Moment);
let time_end = moment(`${props.data.date} ${props.data.time}`).add(props.data.time_spent, 'm').format("HH:mm");


const [showAppointmentModal, setAppointmentModal] = useState(false);
const [appointModalTitle, setAppointModalTitle] = useState("");
const [AppointmentDetails, setAppointmentDetails] = useState({});


let appoint_id = localStorage.getItem("appoint_id");


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
            <td><p>{props.data.service_name}</p></td>
            <td><p>{new Date(props.data.date).toLocaleDateString()}</p></td>
            <td><p>{props.data.time} - {moment(`${props.data.date} ${props.data.time}`).add(props.data.time_spent, 'm').format("HH:mm")}</p></td>
            <td><p>{props.data.employee_fullname}</p></td>
            <td><p>{props.data.status_name}</p></td>
            <td className="align-middle">
                <Button  onClick={onShowAppointment} className="btn btn-primary" size="sm">{<i className="fa-regular fa-eye me-2"></i>}รายละเอียด</Button>
            </td>
        </tr>

        <ShowAppointmentDetails
                show={showAppointmentModal}
                title={appointModalTitle}
                data={AppointmentDetails}
                onClose={onClose}
                time_end={time_end}/>


    </>
)
}