import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Table,Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { API_GET , API_POST} from '../../api';
import { ShowAppointmentDetails } from '../Modal';
import HistoryItem from './HistoryItem';

export default function HistoryAppoint(){

    let date = new Date().toLocaleDateString();
    let pages = 4;

    const [appointments, setAppointment] = useState([]);
    const [appoint_id, setAppointId] = useState(0);


     // confirmModal
     const [confirmModal, setConfirmModal] = useState(false);
     const [confirmModalTitle, setConfirmModalTitle] = useState("");
     const [confirmModalMessage, setConfirmModalMessage] = useState("");

     const [pet_name, setPetName] = useState("");
     const [symtoms, setSymtoms] = useState("");
     const [service_name, setServiceName] = useState("");
    //  const [Date, setDate] = useState(new Date);
    //  const [time, setTime] = useState(time);
     const [room_name, setRoomName] = useState([]);
     const [status_name, setStatusName] = useState([]);


    useEffect(() => {

        async function fetchData(){
            let json = await API_GET("history_appoint");
            if(json.result){
                setAppointment(json.data);
                console.log(json.data)
            }
        }
        fetchData();
    }, []);

    const onDetail = async (data) => {

        setAppointId(data.appoint_id);

        setConfirmModalTitle("รายละเอียด");
        setConfirmModalMessage(pet_name, 
                                symtoms, 
                                service_name, 
                                room_name,
                                status_name);
        setConfirmModal(true);
}

const onConfirmDelete = async () => {
    setConfirmModal(false);
    let json = await API_POST("history_appoint", {
        appoint_id: appoint_id
    });

    if (json.result) {
        // setRoomType();
        fetchData();
    }
}

const onCancelDelete = () => {
    setConfirmModal(false);

}

const fetchData = async () => {
    let json = await API_GET("appointment");
    setAppointment(json.data);
}


    return (
        <>
            <div className="container-fluid">
                <div className='top row'>
                    <div className='col'>
                        <p>สถานะ : พนักงาน</p>
                    </div>
                </div>

                <div className='row'>
                    <div className='p-0 col-12 col-lg-2'>
                        <div className='sidebar'>
                            <Sidebar pages={pages}/>
                        </div>
                    </div>
                    
                    <div className='p-0 m-0 col-12 col-lg-10'>
                        <div className="content">
                            <div className="container m-auto">
                                <div className="row">
                                    <div className="col">
                                        <div className="my-5">
                                            <h2 className="header-content text-center text-white p-2">ประวัติการนัดหมาย</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col text-center'>
                                        <Table striped>
                                            <thead>
                                                <tr>
                                                <th>รหัสนัดหมาย</th>
                                                <th>ชื่อเจ้าของ</th>
                                                <th>ชื่อสัตว์</th>
                                                <th>บริการ</th>
                                                <th>วันที่</th>
                                                <th>เวลา</th>
                                                <th>สถานะ</th>
                                                <th>action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {appointments != null &&
                                                    appointments.map(item => (
                                                        <HistoryItem
                                                        data = {item} 
                                                        />
                                                    ))
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">              
                    <div className='bottom'>
                        <div>
                            <p>วันที่ : {date}</p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}