import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";



export default function ListAppointItem(props) {

const onShowAppointment = () =>{
    props.onShow(props.data);
}

return (
    <>
       <tr>
            <td><p>{props.data.appoint_id}</p></td>
            <td><p>{props.data.cust_fname} {props.data.cust_lname}</p></td>
            <td><p>{props.data.service_name}</p></td>
            <td><p>{new Date(props.data.date).toLocaleDateString()}</p></td>
            <td><p>{props.data.time} - {props.data.time_end}</p></td>
            <td><p>{props.data.room_name}</p></td>
            <td><p>{props.data.employee_fullname}</p></td>
            <td><p>{props.data.status_name}</p></td>
            <td>
                <Button  variant="primary" onClick={onShowAppointment} size="sm">{<i className="fa-regular fa-eye me-2"></i>}รายละเอียด</Button>
                <Link to={`${props.data.appoint_id}`} className="btn btn-warning btn-sm ms-3">{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Link>
            </td>
        </tr>

    </>
)
}