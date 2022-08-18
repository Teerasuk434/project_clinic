import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function PetsItems(props) {

    // const onDelete = async () => {
    //     props.onDelete(props.data)
    // }

    return (
        <>
            <tr>
                <td><p>{props.data.pet_name}</p></td>
                <td><p>{props.data.pet_type}</p></td>
                <td><p>{props.data.pet_species}</p></td>
                <td><p>{props.data.pet_gender}</p></td>
                <td><p>{props.data.pet_age_year} ปี {props.data.pet_age_month} เดือน</p></td>
                <td>
                    <div className="row">
                        <div className="col-12">
                            <div className="d-inline-block me-2">
                                <Link to={`/pet/${props.data.pet_id}`} className="btn btn-warning me-3">{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Link>
                            </div>
                       

                            <div className="d-inline-block">
                                <button type="button" className="btn btn-danger btn-md" >{<i className="fa-solid fa-trash-can me-2"></i>}ลบ</button>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    )
}