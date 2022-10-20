import { Button } from "react-bootstrap";

export default function HistoryItem(props) {

    const onShowAppointment = () =>{
        props.onShowAppointment();
    }

    return (
        <>
        <tr>
                <td><p>{props.data.appoint_id}</p></td>
                <td><p>{props.data.cust_fname} {props.data.cust_lname}</p></td>
                <td><p>{props.data.service_name}</p></td>
                <td><p>{new Date(props.data.date).toLocaleDateString()}</p></td>
                <td><p>{props.data.time} - {props.data.time_end}</p></td>
                <td><p>{props.data.employee_fullname}</p></td>
                <td><p>{props.data.status_name}</p></td>
                <td className="align-middle">
                    <Button  onClick={onShowAppointment} className="btn btn-primary" size="sm">{<i className="fa-regular fa-eye me-2"></i>}รายละเอียด</Button>
                </td>
            </tr>

        </>
    )
}