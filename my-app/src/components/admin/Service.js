import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Table, Pagination } from 'react-bootstrap';
import { API_GET, API_POST } from '../../api';
import Fuse from 'fuse.js'


import './Admin.css';
import Sidebar from './Sidebar';
import ServiceItems from './ServiceItems';
import { ConfirmModal } from '../Modal';

export default function Service() {
    let date = new Date().toLocaleDateString();
    let pages = 5;

    const [search, setSearch] = useState("");
    const [services, setServices] = useState([]);
    const [service_id, setServiceId] = useState(0);
    const [listServices, setListServices] = useState([]);

    var pageCount = 0;
    const [currentPage, setCurrentPage] = useState(0);
    const [numPerPage, setNumPerPage] = useState(5);

    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalMessage, setConfirmModalMessage] = useState("");

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(
                "http://localhost:8080/api/service",
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        'Content-Type': 'application/json',
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                }
            );

            document.body.style.overflow = "hidden";

            let json = await response.json();
            setServices(json.data);
            setListServices(json.data)
        }

        fetchData();
    }, []);

    useEffect(() => {
        if(search == ""){
            setServices(listServices);
        }

    }, [search]);

    const fetchServices = async () => {
        let json = await API_GET("service");
        setServices(json.data);
        setListServices(json.data);
    }

    const onSearch = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if(search != ""){

                const fuse = new Fuse(listServices, {
                    keys: ['service_id','service_name','room_type_name']
                })

                let search_result = fuse.search(search)
                let searchServices = []

                search_result.map(item => {
                    searchServices.push(item.item)
                })

                setServices(searchServices.sort((a,b) => a.service_id - b.service_id));
            }else {
                setServices(listServices);
            }
        }
     }

     const onDelete = async (data) => {

        setServiceId(data.service_id);
        setConfirmModalTitle("ยืนยันการลบข้อมูล");
        setConfirmModalMessage("คุณต้องการลบข้อมูลใช่หรือไม่");
        setConfirmModal(true);
    }

     const onConfirmDelete = async () => {
        setConfirmModal(false);
        let json = await API_POST("service/delete", {
            service_id: service_id
        });

        if (json.result) {
            fetchServices();
        } 
    }

    const onCancel = () => {
        setConfirmModal(false);
    }

    const getPagination = () => {
        let items = [];
        pageCount = Math.ceil(listServices.length / numPerPage);

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

    return (
        <>
            <div className="container-fluid">

                <div className='row'>

                    <div className='top d-flex justify-content-between px-3'>

                        <div className="text">
                             <p className='me-2'>วันที่ : {date}</p>
                        </div>
                        <div className='text'>
                           <p> สถานะ : แอดมิน</p>
                        </div>

                    </div>

                    <div className='p-0 col-12 col-lg-2 sidebar-height'>
                        <div className='sidebar'>
                            <Sidebar pages={pages}/>
                        </div>
                    </div>

                    <div className='p-0 col-12 col-lg-10'>
                        <div className="content overflow-hidden">
                            <div className="container m-auto">
                                <div className="row my-2">
                                    <div className="col">
                                        <h2 className="header-content text-center text-white p-2">ข้อมูลบริการ</h2>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-2">
                                        <Link to={"/service/add"} className="btn btn-success ms-3">{<i className="fa-solid fa-plus me-2"></i>}เพิ่มข้อมูล</Link>
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
                                </div>

                                <div className='row mt-3'>
                                    <div className='col text-center'>
                                        <Table striped responsive>
                                            <thead>
                                                <tr>
                                                <th>รหัสบริการ</th>
                                                <th>ชื่อบริการ</th>
                                                <th>ค่าบริการ</th>
                                                <th>ค่ามัดจำ</th>
                                                <th>เวลาที่ใช้</th>
                                                <th>รูปภาพ</th>
                                                <th>ห้องที่ใช้</th>
                                                <th>action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    services.slice(currentPage * numPerPage, (currentPage * numPerPage) + numPerPage).map(item => (
                                                        <ServiceItems
                                                        key={item.service_id}
                                                        data={item}
                                                        onDelete={onDelete} />
                                                    ))
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                    <div className="mt-2">
                                        <div className="float-end">
                                            <Pagination onSelect={onPageSelected}>
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

                </div>
                
            </div>
                <ConfirmModal
                    show={confirmModal}
                    title={confirmModalTitle}
                    message={confirmModalMessage}
                    onConfirm={onConfirmDelete}
                    onClose={onCancel}
                />
        </>
    )
}