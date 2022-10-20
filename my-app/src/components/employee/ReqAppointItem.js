import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function ReqAppointItem(props) {
    console.log(props)
    const onShowAppointment = async () =>{
        props.onShowAppointment(props.data);
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
                <td><p>{props.data.status_name}</p></td>
                <td>
                    <Button onClick={onShowAppointment} variant="primary" size="sm">{<i className="fa-regular fa-eye me-2"></i>}รายละเอียด</Button>
                    <Link to={`${props.data.appoint_id}`} className="btn btn-warning btn-sm ms-2">{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Link>
                </td>
            </tr>



        </>
    )
}