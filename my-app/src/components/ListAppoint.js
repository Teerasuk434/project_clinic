import { useEffect, useState } from 'react';
import Sidebar from './employee/Sidebar'
import { Table,Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { API_GET } from '../api';

export default function ListAppoint(){

    let date = new Date().toLocaleDateString();
    let pages = 3;

    const [appointment, setAppointment] = useState([]);

    useEffect(() => {

        async function fetchData(){
            let json = await API_GET("appointment");
            if(json.result){
                setAppointment(json.data);
                console.log(json.data)
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
                                            <h2 className="header-content text-center text-white p-2">คำขอนัดหมาย</h2>
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
                                                <th colSpan={2}>action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {appointment != null &&
                                                    appointment.map(item => (
                                                        <tr key={item.appoint_id}>
                                                            <td><p>{item.appoint_id}</p></td>
                                                            <td><p>{item.cust_fname} {item.cust_lname}</p></td>
                                                            <td><p>{item.pet_name}</p></td>
                                                            <td><p>{item.service_name}</p></td>
                                                            <td><p>{new Date(item.date).toLocaleDateString()}</p></td>
                                                            <td><p>{item.time}</p></td>
                                                            <td><p>{item.appoint_status}</p></td>
                                                            <td>
                                                                <div>
                                                                    <Button  className="btn btn-success">{<i className="fa-regular fa-eye me-2"></i>}รายละเอียด</Button>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    <Link to={`${item.appoint_id}`} className="btn btn-warning">{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Link>
                                                                </div>
                                                            </td>
                                                        </tr>
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