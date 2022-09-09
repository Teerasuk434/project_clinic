import { Link } from "react-router-dom";

export default function AppointmentItem(props) {

    return (
        <>
            <tr>
                <td><p>{props.data.appoint_id}</p></td>
                <td><p>{props.data.pet_name}</p></td>
                <td><p>{props.data.service_name}</p></td>
                <td><p>{props.data.date}</p></td>
                <td><p>{props.data.time}</p></td>
                <td><p>{props.data.room_name}</p></td>
                <td><p>{props.data.appoint_status}</p></td>
                <td>
                    <div>
                        <Link to={`/pet/${props.data.appoint_id}`} className="btn btn-warning me-3">{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Link>
                    </div>
                </td>
            </tr>
        </>
    )
}