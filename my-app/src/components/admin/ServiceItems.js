import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { SERVER_URL } from "../../app.config";


export default function ServiceItems(props) {

    const onDelete = async () => {
        props.onDelete(props.data)
    }

    return (
        <>
            <tr>
                <td><p className="mt-3">{props.data.service_id}</p></td>
                <td><p className="mt-3">{props.data.service_name}</p></td>
                <td><p className="mt-3">{props.data.cost_service}</p></td>
                <td><p className="mt-3">{props.data.cost_deposit}</p></td>
                <td><p className="mt-3">{props.data.time_spent}</p></td>
                <td><p><img src={`http://localhost:8080/images/${props.data.service_image}`} width={60}/></p></td>
                <td><p className="mt-3">{props.data.room_type_name}</p></td>
                <td>
                    <div className="row">
                        <div className="col-12 mt-3">
                            <div className="d-inline-block me-2">
                                <Link to={`/service/${props.data.service_id}`} className="btn btn-warning me-3">{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Link>
                            </div>

                            <div className="d-inline-block">
                                <button type="button" className="btn btn-danger" onClick={onDelete}>{<i className="fa-solid fa-trash-can me-2"></i>}ลบ</button>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    )
}