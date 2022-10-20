    import { Button } from "react-bootstrap";
    import Moment from 'moment';
    import { extendMoment } from 'moment-range';
    

    export default function AppointmentItem(props) {

    let appoint_status = props.data.status_id
    const moment = extendMoment(Moment);

    const onShowAppointment = async () =>{
        props.onShow(props.data);
    }

    const onShowAppointmentForm = async () =>{
        props.setPetId(props.data.pet_id);
        props.setSymtoms(props.data.symtoms);
        props.setAppointId(props.data.appoint_id);
        props.setPaymentImage(props.data.payment_image);
        props.onEdit(props.data);
    }

    return (
        <>
            <tr>
                <td><p>{props.data.appoint_id}</p></td>
                <td><p>{props.data.pet_name}</p></td>
                <td><p>{props.data.service_name}</p></td>
                <td><p>{moment(props.data.date).format("DD-MM-YYYY")}</p></td>
                <td><p>{props.data.time} - {props.data.time_end}</p></td>
                <td><p>{props.data.status_name}</p></td>
                <td>
                    <Button onClick={onShowAppointment} className="btn btn-primary me-2" size="sm">{<i className="fa-regular fa-eye me-2"></i>}แสดง</Button>

                    {appoint_status == 3 ?
                        <Button onClick={onShowAppointmentForm} className="btn btn-warning" size="sm">{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Button>
                    :
                        <Button disabled onClick={onShowAppointmentForm} className="btn btn-warning" size="sm">{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Button>

                    }
                </td>
            </tr>

        </>
    )
}