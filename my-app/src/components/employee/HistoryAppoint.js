import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Table,Button , Form , Col, Row } from 'react-bootstrap';
import { API_GET , API_POST} from '../../api';
import HistoryItem from './HistoryItem';
import Fuse from 'fuse.js';

export default function HistoryAppoint(){

    let date = new Date().toLocaleDateString();
    let pages = 4;

    const [appointments, setAppointment] = useState([]);
    const [listappointment ,setListAppointment] = useState([]);

     const [search,setSearch] = useState("");

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

    useEffect( () => {
        async function fetchData(){
            const response = await fetch(
                "http://localhost:8080/api/history_appoint",
                {
                    method: "GET",
                    headers:{
                        Accept:"application/json",
                        'Content-Type': 'application/json',
                    }
                }
            );

            document.body.style.overflow = "hidden";


            let json = await response.json();
            setAppointment(json.data);
            setListAppointment(json.data);
        }
        fetchData();
    },[]);

useEffect(() => {
    if(search == ""){
        setAppointment(listappointment);
    }

}, [search]);

const onSearch = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
        event.stopPropagation();
    } else {
        if(search != ""){
            const fuse = new Fuse(listappointment, {
                keys: ['appoint_id', 'cust_fname', 'cust_lname', 'pet_name']
            })

            let search_result = fuse.search(search)
            let searchAppointment = []  
            
            search_result.map(item => {
                searchAppointment.push(item.item)
            })

            setAppointment(searchAppointment.sort((a,b) => a.appoint_id - b.appoint_id));
        }else {
            setAppointment(listappointment);
        }
    }
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

                                <div className="col-10">
                                        <Form>
                                            <Row>
                                                <Form.Group as={Col} md="10" className="mb-2" controlId="validateFirstName">
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        value={search}
                                                        placeholder="ค้นหา"
                                                        onChange={(e) => setSearch(e.target.value)}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        กรุณากรอกข้อมูลที่ต้องการค้นหา
                                                    </Form.Control.Feedback>
                                                    </Form.Group>
                                                <Form.Group as={Col} md="2">
                                                    <div className="d-grid gap-2">
                                                        <button className="btn btn-success" type="submit" onClick={onSearch}>{<i className="fa-solid fa-magnifying-glass me-2"></i>}ค้นหา</button>
                                                    </div>
                                                </Form.Group>
                                            </Row>
                                        </Form>
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
                                                        key={item.appoint_id}
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