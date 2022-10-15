import { Link } from "react-router-dom"
import { Button } from "react-bootstrap"

export default function RoomTypesItem(props){


    const onDelete = async (data) => {

        props.onDelete(props.data)
    }

    return(
        <>
        <tr>
            <td><p>{props.data.room_type_id}</p></td>
            <td><p>{props.data.room_type_name}</p></td>
            <td>
                <Link to={`/roomtype/${props.data.room_type_id}`} className="btn btn-warning me-3 btn-sm">{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Link>

                <Button variant="danger" size="sm" onClick={onDelete}>{<i className="fa-solid fa-trash-can me-2 btn-sm"></i>}ลบ</Button>
                
            </td>
        </tr>
    </>
    )
}