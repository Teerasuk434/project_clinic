    import { Link } from "react-router-dom";
    import { ShowAppointmentDetails,ShowAppointmentForm } from "../Modal";
    import { useState,useEffect } from "react";
    import { Button } from "react-bootstrap";
    import { API_POST } from "../../api";
    import Moment from 'moment';
    import { extendMoment } from 'moment-range';


    export default function AppointmentItem(props) {

    let appoint_status = props.data.status_id
    const moment = extendMoment(Moment);
    let time_end = moment(`${props.data.date} ${props.data.time}`).add(props.data.time_spent, 'm').format("HH:mm");


    const [showAppointmentModal, setAppointmentModal] = useState(false);
    const [showAppointmentForm, setAppointmentForm] = useState(false);
    const [appointModalTitle, setAppointModalTitle] = useState("");
    const [AppointmentDetails, setAppointmentDetails] = useState({});


    const [listpets, setListPets] = useState([]);

    let user_id = localStorage.getItem("user_id");

    useEffect(()=>{
        async function fetchData(user_id){
            let json = await API_POST("listpets/" + user_id);
            setListPets(json.data);
        }
        fetchData(user_id);
                   
    },[])


    const onShowAppointment = () =>{
        setAppointmentModal(true);
        setAppointModalTitle("รายละเอียดการนัดหมาย")
        setAppointmentDetails(props.data);
    }

    const onShowAppointmentForm = () => {
        setAppointmentForm(true);
        setAppointmentDetails(props.data);
        setAppointModalTitle("แก้ไขการนัดหมาย");
    }

    const onClose = () =>{
        setAppointmentModal(false);
        setAppointmentForm(false);
    }

    return (
        <>
            <tr>
                <td><p>{props.data.appoint_id}</p></td>
                <td><p>{props.data.pet_name}</p></td>
                <td><p>{props.data.service_name}</p></td>
                <td><p>{moment(props.data.date).format("DD-MM-YYYY")}</p></td>
                <td><p>{props.data.time} - {time_end}</p></td>
                <td><p>{props.data.status_name}</p></td>
                <td colSpan={2}>
                    <div className="row">
                        <div className="col-6">
                            <Button onClick={onShowAppointment} className="btn btn-success">{<i className="fa-regular fa-eye me-1"></i>}รายละเอียด</Button>
                        </div>
                        <div className="col-6">
                            <Button onClick={onShowAppointmentForm} className="btn btn-warning me-3">{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Button>
                        </div>

                    </div>
                </td>
                {/* <td> */}
                    {/* {appoint_status == 3 &&
                    
                        <Button onClick={onShowAppointmentForm} className="btn btn-warning me-3">{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Button>
                        
                    } */}
                {/* </td> */}
            </tr>
            <ShowAppointmentDetails 
            show={showAppointmentModal}
            title={appointModalTitle}
            onClose={onClose}
            data={AppointmentDetails}
            time_end={time_end}
            />

            <ShowAppointmentForm 
            show={showAppointmentForm}
            title={appointModalTitle}
            onClose={onClose}
            data={AppointmentDetails}
            pets={listpets}
            />
        </>
    )
}