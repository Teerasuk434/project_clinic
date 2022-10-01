import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AppointmentChartItem(props) {

    const onShowAppointment = async () =>{
        props.onShow(props.data);
    }

    console.log(props)

    return (
        <>
            <div className="row border rounded shadow-lg mt-2 mx-0 text-center p-1">
                <div className="col-1">
                    <p>{props.data.appoint_id}</p>
                </div>

                <div className="col-2">
                    <p>{props.data.cust_fname} {props.data.cust_lname}</p>
                </div>

                <div className="col-2">
                    <p>{props.data.service_name}</p>
                </div>

                <div className="col-1">
                    <p>{new Date(props.data.date).toLocaleDateString()}</p>
                </div>

                <div className="col-2">
                    <p>{props.data.time} - {props.data.time_end}</p>
                </div>

                <div className="col-2">
                    <p>{props.data.employee_fullname}</p>
                </div>

                <div className="col-2 m-auto">
                    <Button  onClick={onShowAppointment} className="btn btn-success" size="sm">รายละเอียด</Button>
                </div>
            </div>
        </>
    )
}