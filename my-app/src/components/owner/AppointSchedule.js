import { useEffect, useState } from "react";
import { Form, Col, Row, Table, Button} from "react-bootstrap";

export default function AppointSchedule() {

    let date = new Date().toLocaleDateString();
    let pages = 2;

    const [schedules, setSchedules] = useState([]);
    const [schedule_id, setScheduleId] = useState(0);
    const [emp_id, setEmpId] = useState(0);
    const [appoint_id, setAppointId] = useState(0);
    const [room_id, setRoomId] = useState(0);


   

    return (
        <>

        </>
    )
}