import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function UsersItem(props) {

    const onDelete = async () => {
        props.onDelete(props.data)
    }

    return (
        <>
            <tr>
                <td><p className="m-2">{props.data.role_id}</p></td>
                <td><p className="m-2">{props.data.role_name}</p></td>
                <td>
                    <div className="row">
                        <div className="col-6">
                            <div className="d-grid gap-2">
                                <Link to={`/user/${props.data.role_id}`} className="btn btn-warning me-3">{<i class="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Link>
                            </div>
                        </div>

                        <div className="col-6">
                            <button type="button" className="btn btn-danger btn-md" onClick={onDelete}>{<i class="fa-solid fa-trash-can me-2"></i>}ลบ</button>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    )
}