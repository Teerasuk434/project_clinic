import { useEffect, useState } from "react"
import { Form, Row, Col, Table, Pagination, InputGroup, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import EmployeeItem from "./EmployeeItem";
import { API_GET,API_POST } from "../../api";
import Top from "../Top";
import { ConfirmModal, MessageModal } from "../Modal";

import Sidebar from "../Sidebar";

export default function Employee(){
    let date = new Date().toLocaleDateString();
    let pages = 3;

    const [employee,setEmployee] = useState([]);
    const [search,setSearch] = useState("");
    const [listemployee,setListEmployee] = useState([]);
    const [emp_id, setEmpId] = useState(0);

    // confirmModal
    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalMessage, setConfirmModalMessage] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState(""); 


    var pageCount = 0;
    const [currentPage, setCurrentPage] = useState(0);
    const [numPerPage, setNumPerPage] = useState(10);


    useEffect( () => {
        async function fetchEmployee(){
            const response = await fetch(
                "http://localhost:8080/api/emp",
                {
                    method: "GET",
                    headers:{
                        Accept:"application/json",
                        'Content-Type': 'application/json',
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                }
            );

            let json = await response.json();
            setEmployee(json.data);
            setListEmployee(json.data);
        }
        fetchEmployee();
    },[]);

    useEffect(() => {
        if(search == ""){
            setEmployee(listemployee);
        }

    }, [search]);

    const onSearch = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if(search != ""){
                let searchEmployee = [];
                listemployee.filter(type => type.emp_fname.includes(search)).map(item => {
                    searchEmployee.push(item);
                })
    
                setEmployee(searchEmployee);
            }
        }
     }
     const onDelete = async (data) => {

        setEmpId(data.emp_id);

        setConfirmModalTitle("ยืนยันการลบข้อมูล");
        setConfirmModalMessage("คุณยืนยันการลบข้อมูลใช่หรือไม่");
        setConfirmModal(true);
    }
     const onConfirmDelete = async () => {
        let json = await API_POST("emp/delete", {
            emp_id: emp_id
        });

        if (json.result) {
            fetchEmployee();
        }
    }

    const onCancelDelete = () => {
        setConfirmModal(false);
    }
    const onClose = () => {
        setConfirmModal(false);
        setShowModal(false);
    }

    const fetchEmployee = async () => {
        let json = await API_GET("emp");
        setEmployee(json.data);
        setListEmployee(json.data);
    }

    const getPagination = () => {
        let items = [];
        pageCount = Math.ceil(listemployee.length / numPerPage);

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
                                    <h4 className="text-center">ข้อมูลพนักงาน</h4>
                                </div>
                                <div className="my-3 ">
                                    <div className="m-auto d-flex justify-content-between">
                                        <div>
						                    <Link to={"/emp/add"} className="btn btn-sm btn-success">{<i className="fa-solid fa-plus me-2"></i>}เพิ่มข้อมูลพนักงาน</Link>
                                        </div>
                                        <div className="form-search">
                                            <Form noValidate onSubmit={onSearch}>
                                                <InputGroup>
                                                    <Form.Control
                                                        size="sm"
                                                        required
                                                        type="text"
                                                        value={search}
                                                        placeholder="ค้นหาข้อมูลพนักงาน"
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
                                                <th>ชื่อ-สกุล</th>
                                                <th>ตำแหน่ง</th>
                                                <th>action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    employee.map(item => (
                                                        <EmployeeItem
                                                        key={item.emp_id}
                                                        data={item}
                                                        onDelete={onDelete} />
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
            
            <ConfirmModal
                show={confirmModal}
                title={confirmModalTitle}
                message={confirmModalMessage}
                onConfirm={onConfirmDelete}
                onClose={onCancelDelete}/>   
            <MessageModal
                show={showModal}
                title={modalTitle}
                message={modalMessage}
                onClose={onClose}
            />
        </>
    )
}