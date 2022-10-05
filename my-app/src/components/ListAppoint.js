import { useEffect, useState } from 'react';
import Sidebar from './employee/Sidebar'
import { Table,Button, InputGroup, Form, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { API_GET } from '../api';
import ListAppointItem from './ListAppointItem';
import Top from './Top';
import Fuse from 'fuse.js';

export default function ListAppoint(){

    let date = new Date().toLocaleDateString();
    let pages = 3;

    const [appointments, setAppointments] = useState([]);
    const [search, setSearch] = useState("");
    
    const [showAppointmentModal, setAppointmentModal] = useState(false);
    const [appointModalTitle, setAppointModalTitle] = useState("");
    const [AppointmentDetails, setAppointmentDetails] = useState({});

    const [listAppoint, setListAppoint] = useState([]);

    var pageCount = 0;
    const [currentPage, setCurrentPage] = useState(0);
    const [numPerPage, setNumPerPage] = useState(10);

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
                setListAppoint(data_temp);
                console.log(data_temp)
            }
        }
        fetchData();
    }, []);

    const onSearch = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if(search != ""){
                const fuse = new Fuse(listAppoint, {
                    keys: ['appoint_id','cust_fname','cust_lname','date','emp_name','service_name','time','time_end']
                })

                let search_result = fuse.search(search)
                let searchAppointment = []  
                
                search_result.map(item => {
                    searchAppointment.push(item.item)
                })

                setAppointments(searchAppointment.sort((a,b) => a.appoint_id - b.appoint_id));
            }else {
                setAppointments(listAppoint);
            }
        }
     }

    const getPagination = () => {
        let items = [];
        pageCount = Math.ceil(listAppoint.length / numPerPage);

        for (let i = 0; i< pageCount; i++) {
            items.push(
                <Pagination.Item key={i}
                    active={currentPage == i}
                    onClick={onPageSelected}>{i + 1}</Pagination.Item>
            )
        }
        return items;
    }

    const onPageSelected = (d) => {
        var selectedPageNo = parseInt(d.target.innerHTML) -1;
        setCurrentPage(selectedPageNo)

        console.log(currentPage * numPerPage + "And" + ((currentPage * numPerPage) + numPerPage))
    }

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    }

    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    }

    const firstPage = () => {
        setCurrentPage(0);
    }

    const lastPage = () => {
        setCurrentPage(pageCount - 1);
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
                            <div className='mx-4 mt-3 pt-2 px-4 rounded shadow border bg-light'>
                                <div className="border-bottom border-dark border-opacity-50 mb-2">
                                    <h4 className="text-center">ตารางนัดหมาย</h4>
                                </div>
                                <div className="my-3 ">
                                    <div className="m-auto d-flex justify-content-between">
                               
                                        <div className="form-search">
                                            <Form noValidate onSubmit={onSearch}>
                                                <InputGroup>
                                                    <Form.Control
                                                        size="sm"
                                                        required
                                                        type="text"
                                                        value={search}
                                                        placeholder="ค้นหาประเภทห้องรักษา"
                                                        onChange={(e) => setSearch(e.target.value)}
                                                    />
                                                    <Button variant="success" type="submit" size="sm">{<i className="fa-solid fa-magnifying-glass me-2"></i>}ค้นหา</Button>
                                                </InputGroup>
                                            </Form>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <Table size="sm" responsive bordered hover className='text-center'>
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
                                                        <ListAppointItem
                                                        key={item.appoint_id}
                                                        data={item}
                                                        />
                                                    ))
                                                }
                                            </tbody>
                                    </Table>
                                </div>

                                <div className="d-flex justify-content-end">
                                    <Pagination onSelect={onPageSelected} size="sm">
                                        <Pagination.First onClick={firstPage} />
                                        <Pagination.Prev disabled={currentPage == 0} onClick={prevPage} />
                                        { getPagination()}
                                        <Pagination.Next disabled={currentPage == pageCount -1} onClick={nextPage} />
                                        <Pagination.Last onClick={lastPage} />
                                    </Pagination>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}