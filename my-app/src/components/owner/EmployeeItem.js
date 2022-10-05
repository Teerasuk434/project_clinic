import { Link } from "react-router-dom"

export default function EmployeeItem(props){

    console.log(props)

    const onDelete = async () => {
        props.onDelete(props.data)
        
    }

    return(
        <>
        <tr>
            <td><p>{props.data.emp_id}</p></td>
            <td><p>{props.data.emp_fname} {props.data.emp_lname}</p></td>
            <td><p>{props.data.emp_position_name}</p></td>
            <td>
                <div className="row">
                    <div className="col-12">
                        <div className="d-inline-block me-2">
                            <Link to={`/emp/${props.data.emp_id}`} className="btn btn-warning me-3 btn-sm">{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Link>
                        </div>
                   

                        <div className="d-inline-block">
                            <button type="button" className="btn btn-danger btn-sm" onClick={onDelete}>{<i className="fa-solid fa-trash-can me-2"></i>}ลบ</button>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    </>
    )
}
