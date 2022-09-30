import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Table,Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { API_GET } from '../../api';
import AppointScheduleItem from './AppointScheduleItem';

export default function AppointSchedule(){

    let date = new Date().toLocaleDateString();
    let pages = 2;

    const [appointments, setAppointments] = useState([]);

    useEffect(() => {

        async function fetchData(){
            let json = await API_GET("appointment/accept");
            let data_temp = [];
            if(json.result){
                json.data.map(item=>{
                    if(item.status_id == 2){
                        data_temp.push(item);
                    }
                })
                setAppointments(data_temp);
            }
        }
        fetchData();
    }, []);

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
                                            <h2 className="header-content text-center text-white p-2">ตารางนัดหมาย</h2>
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
                                                <th>ผู้รับหน้าที่</th>
                                                <th>สถานะ</th>
                                                <th colSpan={2}>action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {appointments != null &&
                                                    appointments.map(item => (
                                                        <AppointScheduleItem
                                                        key={item.appoint_id}
                                                        data={item}
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