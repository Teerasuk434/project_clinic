import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function UsersItem(props) {

    const onDelete = async () => {
        props.onDelete(props.data)
    }

    return (
        <>
            <tr>
                <td><p>{props.data.service_id}</p></td>
                <td><p>{props.data.service_name}</p></td>
                <td><p>{props.data.cost_service}</p></td>
                <td><p>{props.data.cost_deposit}</p></td>
                <td><p>{props.data.time_spent}</p></td>
                <td><p><img src={`http://localhost:8080/images/${props.data.sevice_image}`} width={50}/></p></td>
                <td><p>{props.data.room_type_id}</p></td>
                <td>
                    <div className="row">
                        <div className="col-12">
                            <div className="d-inline-block">
                                <Link to={`/service/${props.data.service_id}`} className="btn btn-warning me-3">{<i class="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Link>
                            </div>

                            <div className="d-inline-block">
                                <button type="button" className="btn btn-danger" onClick={onDelete}>{<i class="fa-solid fa-trash-can me-2"></i>}ลบ</button>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    )
}