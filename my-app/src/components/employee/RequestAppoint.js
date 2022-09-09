import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import './employee.css';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

export default function RequestAppoint() {

    
    let date = new Date().toLocaleDateString();
    let pages = 2;

   

    const [appointment, setAppointment] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(
                "http://localhost:8080/api/appointment",
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        'Content-Type': 'application/json',
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                }
            );

            let json = await response.json();
            setAppointment(json.data);
            console.log(json.data);
        }

        fetchData();
    }, []);

    return(
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
                                                <th>action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
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

                                                                <Link to={`${item.appoint_id}`} className="btn btn-warning me-3">{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไข</Link>
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