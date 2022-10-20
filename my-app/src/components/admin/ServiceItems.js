import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function ServiceItems(props) {

    const onDelete = async () => {
        props.onDelete(props.data)
    }

    return (
        <>
            <tr>
                <td><p >{props.data.service_id}</p></td>
                <td><p >{props.data.service_name}</p></td>
                <td><p >{props.data.cost_service}</p></td>
                <td><p >{props.data.cost_deposit}</p></td>
                <td><p >{props.data.time_spent}</p></td>
                <td><img src={`http://localhost:8080/images/${props.data.service_image}`} width={50} alt={props.data.service_name}/></td>
                <td><p>{props.data.room_type_name}</p></td>
                <td>
                    <Link to={`/service/${props.data.service_id}`} className="btn btn-warning btn-sm me-3">{<i className="fa-solid fa-pen-to-square me-2 btn-sm"></i>}แก้ไข</Link>
                    <Button variant="danger" size="sm" onClick={onDelete}>{<i className="fa-solid fa-trash-can me-2 btn-sm"></i>}ลบ</Button>

                </td>
            </tr>
        </>
    )
}