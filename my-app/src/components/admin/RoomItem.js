import { Link } from "react-router-dom"

export default function RoomItem(props){


    const onDelete = async () => {
        props.onDelete(props.data)
        
    }

    return(
        <>
        <tr>
            <td><p>{props.data.room_id}</p></td>
            <td><p>{props.data.room_name}</p></td>
            <td>
                <div className="row">
                    <div className="col-12">
                        <div className="d-inline-block me-2">
                            <Link to={`/room/${props.data.room_id}`} className="btn btn-warning me-3">{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Link>
                        </div>
                   

                        <div className="d-inline-block">
                            <button type="button" className="btn btn-danger btn-md" onClick={onDelete}>{<i className="fa-solid fa-trash-can me-2"></i>}ลบ</button>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    </>
    )
}
