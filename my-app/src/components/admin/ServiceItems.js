import { Link } from "react-router-dom";

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
                <td><img src={`http://localhost:8080/images/${props.data.service_image}`} width={50}/></td>
                <td><p>{props.data.room_type_name}</p></td>
                <td colSpan={2}>
                    <div className="d-inline-block me-2">
                        <Link to={`/service/${props.data.service_id}`} className="btn btn-warning me-3">{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Link>
                    </div>

                    <div className="d-inline-block">
                        <button type="button" className="btn btn-danger" onClick={onDelete}>{<i className="fa-solid fa-trash-can me-2"></i>}ลบ</button>
                    </div>

                </td>
            </tr>
        </>
    )
}