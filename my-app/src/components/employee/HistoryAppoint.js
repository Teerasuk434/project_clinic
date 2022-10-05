import { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import { Table, Button , Form , Col, Row, InputGroup} from 'react-bootstrap';
import { API_GET , API_POST} from '../../api';
import HistoryItem from './HistoryItem';
import Fuse from 'fuse.js';
import Top from '../Top';

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
                setListAppointment(json.data);
                console.log(json.data)

            }
        }
        fetchData();
    }, []);

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
                <div className='row'>
                    <div className='p-0 col-12 col-lg-2'>
                        <div className='sidebar'>
                            <Sidebar pages={pages}/>
                        </div>
                    </div>
                    
                    <div className='p-0 m-0 col-12 col-lg-10'>
                        <div className="content m-auto">
                            <Top />
                            {/* <div className="border-bottom border-secondary mb-3">
                                <div>
                                    <h2 className="text-center text-dark p-2">ประวัติการนัดหมาย</h2>
                                </div>
                            </div> */}

                            <div className='m-4 p-4 rounded shadow border bg-light'>
                                <div className="row mb-2">
                                    <div className="col-6">
                                        <h5 className="ms-2">ข้อมูลประวัติการนัดหมาย</h5>
                                        
                                    </div>

                                    <div className="col-6 m-auto">
                                        <div>
                                            <Form noValidate onSubmit={onSearch}>
                                                <InputGroup>
                                                    <Form.Control
                                                        size="sm"
                                                        required
                                                        type="text"
                                                        value={search}
                                                        placeholder="ค้นหา"
                                                        onChange={(e) => setSearch(e.target.value)}
                                                    />
                                                    <Button variant="success" type="submit" size="sm" className="px-3">{<i className="fa-solid fa-magnifying-glass me-2"></i>}ค้นหา</Button>
                                                </InputGroup>
                                            </Form>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <Table size="sm" striped responsive bordered hover variant="light" className='text-center'>
                                        <thead className="border-bottom">
                                            <tr>
                                            <th>#</th>
                                            <th>ชื่อเจ้าของ</th>
                                            <th>บริการ</th>
                                            <th>วันที่</th>
                                            <th>เวลา</th>
                                            <th>ผู้รับหน้าที่</th>
                                            <th>สถานะ</th>
                                            <th></th>
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
        </>
    )
}