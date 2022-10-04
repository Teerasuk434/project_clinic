import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function UsersItem(props) {

    const onDelete = async () => {
        props.onDelete(props.data)
    }

    return (
        <>
            <tr>
                <td><p>{props.data.user_id}</p></td>
                <td><p>{props.data.username}</p></td>
                <td><p>{props.data.role_name}</p></td>
                <td>
                    <Link to={`/user/${props.data.user_id}`} className="btn btn-warning btn-sm me-3">{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Link>
                    <Button variant="danger" size="sm" onClick={onDelete}>{<i className="fa-solid fa-trash-can me-2"></i>}ลบ</Button>
                </td>
            </tr>
        </>
    )
}