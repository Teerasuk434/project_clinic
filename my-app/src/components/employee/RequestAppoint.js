import { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import { Table,Button,Pagination,Form,InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { API_GET } from '../../api';
import ReqAppointItem from './ReqAppointItem';
import Top from '../Top';

export default function RequestAppoint() {

    let date = new Date().toLocaleDateString();

    let pages = 2;

    const [appointments, setAppointments] = useState([]);
    const [schedules, setSchedules] = useState([]);


    const [showAppointmentModal, setAppointmentModal] = useState(false);
    const [appointModalTitle, setAppointModalTitle] = useState("");
    const [AppointmentDetails, setAppointmentDetails] = useState({});

    useEffect(() => {
        async function fetchData(){
            let json = await API_GET("req_appointment");
            if(json.result){
                setAppointments(json.data);      
            }
        }
        fetchData();
    }, []);

    const onClose = () =>{
        setAppointmentModal(false);
    }

    var pageCount = 0;
    const [currentPage, setCurrentPage] = useState(0);
    const [numPerPage, setNumPerPage] = useState(10);

    const getPagination = () => {
        let items = [];
        pageCount = Math.ceil(appointments.length / numPerPage);

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

    return(
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
                            <div className='m-4 p-4 rounded shadow border bg-light'>
                                <div className="border-bottom border-dark border-opacity-50 mb-2">
                                    <h4 className="text-center">คำขอนัดหมาย</h4>
                                </div>
                                {/* <div className="my-3 ">
                                    <div className="m-auto d-flex justify-content-between">
                                        <div>
									        <Link to={"/user/add"} className="btn btn-sm btn-success">{<i className="fa-solid fa-plus me-2"></i>}เพิ่มข้อมูลผู้ใช้งาน</Link>
                                        </div>
                                        <div className="form-search">
                                            <Form noValidate onSubmit={onSearch}>
                                                <InputGroup>
                                                    <Form.Control
                                                        size="sm"
                                                        required
                                                        type="text"
                                                        value={search}
                                                        placeholder="ค้นหาผู้ใช้งาน (รหัส,ชื่อผู้ใช้งาน,ประเภทผู้ใช้งาน)"
                                                        onChange={(e) => setSearch(e.target.value)}
                                                    />
                                                    <Button variant="success" type="submit" size="sm">{<i className="fa-solid fa-magnifying-glass me-2"></i>}ค้นหา</Button>
                                                </InputGroup>
                                            </Form>
                                        </div>
                                    </div>
                                </div> */}

                                <div className="mt-3">
                                    <Table size="sm" responsive bordered hover className='text-center'>
                                        <thead>
                                                <tr>
                                                <th>รหัสคำขอ</th>
                                                <th>ชื่อผู้นัดหมาย</th>
                                                <th>ชื่อสัตว์เลี้ยง</th>
                                                <th>บริการ</th>
                                                <th>วันที่</th>
                                                <th>เวลา</th>
                                                <th>สถานะ</th>
                                                <th>action</th>
                                                </tr>
                                            </thead>
                                            <tbody className='table-group-divider align-middle'>
                                                {
                                                    appointments.slice(currentPage * numPerPage, (currentPage * numPerPage) + numPerPage).map(item => (
                                                        <ReqAppointItem
                                                        key={item.appoint_id}
                                                        data={item}/>
                                                    ))
                                                }
                                            </tbody>
                                    </Table>
                                </div>

                                {appointments.length == 0 && <h6 className="text-center">ไม่มีคำขอนัดหมายในขณะนี้</h6>}

                                {appointments.length > 0 &&
                                    <div className="d-flex justify-content-end">
                                        <Pagination onSelect={onPageSelected} size="sm">
                                            <Pagination.First onClick={firstPage} />
                                            <Pagination.Prev disabled={currentPage == 0} onClick={prevPage} />
                                            { getPagination()}
                                            <Pagination.Next disabled={currentPage == pageCount -1} onClick={nextPage} />
                                            <Pagination.Last onClick={lastPage} />
                                        </Pagination>
                                    </div>
                                }
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}