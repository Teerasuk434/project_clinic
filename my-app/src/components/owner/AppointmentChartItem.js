import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function AppointmentChartItem(props) {

    const onShowAppointment = () =>{

    }

    return (
        <>
            <div className="row border rounded shadow-lg mt-3 mx-1 text-center p-2">
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
                    <p>{props.data.status_name}</p>
                </div>

                <div className="col-2">
                    <Button  onClick={onShowAppointment} className="btn btn-success">รายละเอียด</Button>
                </div>
            </div>
        </>
    )
}