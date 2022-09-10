    import { Link } from "react-router-dom";
    import { ShowAppointmentDetails } from "../Modal";
    import { useState } from "react";
import { Button } from "react-bootstrap";

    export default function AppointmentItem(props) {

    let appoint_status = props.data.appoint_status;

    const [showAppointmentModal, setAppointmentModal] = useState(false);
    const [appointModalTitle, setAppointModalTitle] = useState("");
    const [AppointmentDetails, setAppointmentDetails] = useState([]);

    const onClickShow = () =>{
        setAppointmentModal(true);
        setAppointModalTitle("รายละเอียดการนัดหมาย")
        setAppointmentDetails(props.data);
    }

    const onClose = () =>{
        setAppointmentModal(false);
    }

    return (
        <>
            <tr>
                <td><p>{props.data.appoint_id}</p></td>
                <td><p>{props.data.pet_name}</p></td>
                <td><p>{props.data.service_name}</p></td>
                <td><p>{props.data.date}</p></td>
                <td><p>{props.data.time}</p></td>
                <td><p>{props.data.appoint_status}</p></td>
                <td>
                    <div>
                        <Button onClick={onClickShow} className="btn btn-success me-3">{<i className="fa-regular fa-eye me-2"></i>}รายละเอียด</Button>
                    </div>
                </td>
                <td>
                    {appoint_status == "รอแก้ไข" &&
                        <div>
                            <Link to={`/account/appointment/${props.data.appoint_id}`} className="btn btn-warning me-3">{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Link>
                        </div>
                    }
                </td>
            </tr>
            <ShowAppointmentDetails 
            show={showAppointmentModal}
            title={appointModalTitle}
            onClose={onClose}
            data={AppointmentDetails}
            />
        </>
    )
}