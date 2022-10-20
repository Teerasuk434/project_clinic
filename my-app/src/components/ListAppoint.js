import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Table,Button, InputGroup, Form, Pagination, Row, Col} from 'react-bootstrap';
import { API_GET,API_POST } from '../api';
import ListAppointItem from './ListAppointItem';
import Top from './Top';
import Fuse from 'fuse.js';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { ShowAppointmentDetails } from './Modal';

import Scheduler from 'devextreme-react/scheduler';

export default function ListAppoint(){

    const views = ['day','week','month'];
    const [scheduleData, setScheduleData] = useState([]);

    const optionsSchedules =  {
        allowAdding: false,
        allowDeleting: false,
        allowResizing: false,
        allowDragging: false,
        allowUpdating: false,
      };

    const onAppointmentFormOpening = (e) => {
        let data = allAppointments.find(item => item.appoint_id === e.appointmentData.id);
        onShowAppointment(data);
        e.cancel = true;
    };


    const moment = extendMoment(Moment);
    let pages;

    let role_id = localStorage.getItem("role_id")

    if(role_id === 2){
        pages = 2;
    }else if (role_id === 3){
        pages = 3;
    }

    const [appointments, setAppointments] = useState([]);
    const [allAppointments, setAllAppointments] = useState([]);
    const [search, setSearch] = useState("");

    const [rooms, setRooms] = useState([]);
    const [room_id, setRoomId] = useState(0);

    const [employees, setEmployees] = useState([]);
    const [emp_id, setEmpId] = useState(0);
    const[scheduleEmpId, setScheduleEmpId] = useState(0);
    
    const [showAppointmentModal, setAppointmentModal] = useState(false);
    const [appointModalTitle, setAppointModalTitle] = useState("");
    const [AppointmentDetails, setAppointmentDetails] = useState({});

    const [listAppoint, setListAppoint] = useState([]);

    var pageCount = 0;
    const [currentPage, setCurrentPage] = useState(0);
    const [numPerPage, setNumPerPage] = useState(10);

    useEffect(() => {
        fetchAppointment();
        fetchAllAppointment();
        fetchRooms();
        fetchEmployee();
        fetchScheduleData();
    }, []);


    useEffect(() => {
        searchByFilter();
        
        if(room_id == 0 && emp_id == 0 && search == ""){
            setAppointments(listAppoint);
        }
    },[room_id,emp_id,search])

    useEffect(() =>{
        fetchScheduleData();
    },[scheduleEmpId])

    const fetchAllAppointment = async () =>{
        let json = await API_GET("all-appointments");
        setAllAppointments(json.data);
        console.log(json)
    }


    const fetchAppointment = async () =>{
        let json = await API_GET("appointment/accept");

        if(json.result){
            setAppointments(json.data);
            setListAppoint(json.data);

        }

    }

    const fetchScheduleData = async () =>{
        let json = await API_POST("schedules/emp/" + scheduleEmpId);

        let temp_data = [];

        json.data.map(item=>{

             temp_data.push({
                 text:item.room_name + " " + item.service_name + " " +item.emp_fname +" " +item.emp_lname,
                 startDate: moment(`${item.date} ${item.time}`).format(),
                 endDate: moment(`${item.date} ${item.time_end}`).format(),
                 id:item.appoint_id
             })
             
         }) 
         setScheduleData(temp_data)
         console.log(temp_data)
         console.log(json)
    }


    const fetchRooms = async () =>{
        let json = await API_GET("room");

        if(json.result){
            setRooms(json.data);
        }
    }

    const fetchEmployee = async () =>{
        let json = await API_GET("emp");

        if(json.result){
            setEmployees(json.data);
        }
    }

    const onSearch = async (event) => {
        clearFilter();
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if(search !== ""){
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

     const searchByFilter = () =>{

        let searchAppointment = [] 

        if(room_id > 0  && emp_id === 0){
            const fuse = new Fuse(listAppoint, {
                keys: ['room_id']
            })
    
            let search_result = fuse.search(room_id) 
            
            search_result.map(item => {
                searchAppointment.push(item.item)
            })
    
            setAppointments(searchAppointment.sort((a,b) => a.appoint_id - b.appoint_id));
        }else if (room_id === 0 && emp_id > 0) {
            const fuse = new Fuse(listAppoint, {
                keys: ['emp_id']
            })
    
            let search_result = fuse.search(emp_id)

            let searchAppointment = []  
            
            search_result.map(item => {
                searchAppointment.push(item.item)
            })
    
            setAppointments(searchAppointment.sort((a,b) => a.appoint_id - b.appoint_id));
        }else if (room_id > 0 && emp_id > 0) {
            const fuse = new Fuse(listAppoint, {
                keys: ['room_id','emp_id']
            })
    
            let search_result = fuse.search({
                $and: [{ room_id: `=${room_id}` },
                       { emp_id: `=${emp_id}`}]
              })

            let searchAppointment = []  
            
            search_result.map(item => {
                searchAppointment.push(item.item)
            })
    
            setAppointments(searchAppointment.sort((a,b) => a.appoint_id - b.appoint_id));
        }
        
        else{
            setAppointments(listAppoint);
        }
     }

     const clearFilter = () =>{
        setRoomId(0);
        setEmpId(0);
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

    const onClose = () => {
        setAppointmentModal(false);
    }

    const onShowAppointment = (data) =>{
        setAppointModalTitle("รายละเอียดการนัดหมาย")
        setAppointmentDetails(data);
        setAppointmentModal(true);
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
                                <div className="my-4">
                                    <div className="m-auto d-flex justify-content-between shadow px-3 py-2 rounded border">
                                        <div>
                                            <Form>
                                                <Row>
                                                    <Form.Group as={Col} md="5">
                                                        <Form.Label>ห้อง :</Form.Label>
                                                        <Form.Select
                                                            size="sm"
                                                            value={room_id}
                                                            onChange={(e) => setRoomId(e.target.value)}
                                                            required>

                                                            <option value={0}>ทั้งหมด</option> 
                                                            {
                                                            rooms.map(item => (
                                                                <option key={item.room_id} value={item.room_id}> 
                                                                {item.room_name} </option>
                                                            ))
                                                            }
                                                        </Form.Select>
                                                    </Form.Group>

                                                    <Form.Group as={Col} md="5">
                                                        <Form.Label>ผู้รับหน้าที่ :</Form.Label>
                                                        <Form.Select
                                                            
                                                            size="sm"
                                                            value={emp_id}
                                                            onChange={(e) => setEmpId(e.target.value)}
                                                            required>

                                                            <option value={0}>ทั้งหมด</option> 
                                                            {
                                                            employees.map(item => (
                                                                <option key={item.emp_id} value={item.emp_id}> 
                                                                {item.emp_fname} {item.emp_lname} </option>
                                                            ))
                                                            }
                                                        </Form.Select>
                                                    </Form.Group>

                                                    <div className="col-2 box-clear-filter">
                                                        <Button size="sm" variant="warning" onClick={clearFilter}>เคลียร์</Button>
                                                    </div>
                                                </Row>
                                            </Form>

                                        </div>


                                        <div className="form-search">
                                            <Form noValidate onSubmit={onSearch}>
                                                <InputGroup>
                                                    <Form.Control
                                                        size="sm"
                                                        required
                                                        type="text"
                                                        value={search}
                                                        placeholder="ค้นหานัดหมาย"
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
                                                <th>#</th>
                                                <th>ชื่อเจ้าของ</th>
                                                <th>บริการ</th>
                                                <th>วันที่</th>
                                                <th>เวลา</th>
                                                <th>ห้องที่ใช้</th>
                                                <th>ผู้รับหน้าที่</th>
                                                <th>สถานะ</th>
                                                <th>action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
						                        {appointments !== null &&
                                                    appointments.map(item => (
                                                        <ListAppointItem
                                                        key={item.appoint_id}
                                                        data={item}
                                                        onShow={onShowAppointment}
                                                        />
                                                    ))
                                                }
                                            </tbody>
                                    </Table>
                                </div>

                                {appointments.length === 0 && <h6 className="text-center">ไม่มีข้อมูลนัดหมายในขณะนี้</h6>}


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

                            <div className="bg-light mt-5 mx-4 mb-3 rounded shadow pt-3 px-4">
                                {/* <div className="border-bottom border-dark border-opacity-50 mb-3">
                                    <h4 className="text-center">ตารางงาน</h4>
                                </div> */}

                                <div className="mb-3 w-25">
                                    <Form.Group>
                                        <Form.Label>ผู้รับหน้าที่ :</Form.Label>
                                        <Form.Select
                                            size="sm"
                                            value={scheduleEmpId}
                                            onChange={(e) => setScheduleEmpId(e.target.value)}
                                            required>

                                            <option value={0}>ทั้งหมด</option> 
                                            {
                                            employees.map(item => (
                                                <option key={item.emp_id} value={item.emp_id}> 
                                                {item.emp_fname} {item.emp_lname} </option>
                                            ))
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                </div>

                                <div className="py-2">
                                    <Scheduler
                                        timeZone="Asia/Bangkok"
                                        dataSource={scheduleData}
                                        views={views}
                                        defaultCurrentView="month"
                                        defaultCurrentDate={new Date()}
                                        height="100%"
                                        width="100%"
                                        startDayHour={13} 
                                        endDayHour={19}
                                        editing={optionsSchedules}
                                        firstDayOfWeek={1}
                                        allDayPanelMode="hidden"
                                        onAppointmentFormOpening={onAppointmentFormOpening}
                                        cellDuration={15}
                                        />
                                </div>
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ShowAppointmentDetails 
            show={showAppointmentModal}
            title={appointModalTitle}
            onClose={onClose}
            data={AppointmentDetails}
            />
        </>
    )
}