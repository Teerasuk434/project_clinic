import { useEffect, useState } from 'react';
import Sidebar from '../Sidebar';
import { Table, Button , Form , InputGroup , Pagination} from 'react-bootstrap';
import { API_GET } from '../../api';
import HistoryItem from './HistoryItem';
import Fuse from 'fuse.js';
import Top from '../Top';
import { ShowAppointmentDetails } from "../Modal";

export default function HistoryAppoint(){

    let pages = 4;

    const [appointments, setAppointment] = useState([]);
    const [listappointment ,setListAppointment] = useState([]);

    const [showAppointmentModal, setAppointmentModal] = useState(false);
    const [appointModalTitle, setAppointModalTitle] = useState("");
    const [AppointmentDetails, setAppointmentDetails] = useState({});

    const [search,setSearch] = useState("");

    var pageCount = 0;
    const [currentPage, setCurrentPage] = useState(0);
    const [numPerPage, setNumPerPage] = useState(10);

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

    const onShowAppointment = (data) =>{

        setAppointmentDetails(data);
        setAppointModalTitle("????????????????????????????????????????????????????????????")
        setAppointmentModal(true);

    }

    const onClose = () =>{
        setAppointmentModal(false);
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
                                    <h2 className="text-center text-dark p-2">???????????????????????????????????????????????????</h2>
                                </div>
                            </div> */}

                            <div className='m-4 p-4 rounded shadow border bg-light'>
                                <div className="row mb-2">
                                    <div className="col-6">
                                        <h5 className="ms-2">?????????????????????????????????????????????????????????????????????</h5>
                                        
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
                                                        placeholder="???????????????"
                                                        onChange={(e) => setSearch(e.target.value)}
                                                    />
                                                    <Button variant="success" type="submit" size="sm" className="px-3">{<i className="fa-solid fa-magnifying-glass me-2"></i>}???????????????</Button>
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
                                            <th>?????????????????????????????????</th>
                                            <th>??????????????????</th>
                                            <th>??????????????????</th>
                                            <th>????????????</th>
                                            <th>???????????????????????????????????????</th>
                                            <th>???????????????</th>
                                            <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                appointments.slice(currentPage * numPerPage, (currentPage * numPerPage) + numPerPage).map(item => (
                                                    <HistoryItem
                                                    key={item.appoint_id}
                                                    data={item}
                                                    onShowAppointment={onShowAppointment}

                                                    />
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </div>
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

            <ShowAppointmentDetails
                show={showAppointmentModal}
                title={appointModalTitle}
                data={AppointmentDetails}
                onClose={onClose}
            />
        </>
    )
}