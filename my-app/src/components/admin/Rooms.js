import { useEffect, useState } from "react"
import { Form, Row, Col, Table, Pagination, Button, InputGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import RoomItem from "./RoomItem";
import { API_GET,API_POST } from "../../api";
import Fuse from "fuse.js";
import Sidebar from '../Sidebar';
import Top from '../Top';
import { ConfirmModal ,MessageModal } from "../Modal"; 

export default function Rooms(){

    const [search,setSearch] = useState("");
    const [room,setRoom] = useState([]);
    const [listroom,setListRoom] = useState([]);
    const [room_id, setRoomId] = useState(0);

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
 

    let date = new Date().toLocaleDateString();
    let pages = 7;

    useEffect( () => {
        fetchData();
    },[]);

    useEffect(() => {
        if(search == ""){
            setRoom(listroom);
        }

    }, [search]);

    const fetchData = async () => {
        let json = await API_GET("room");
        setRoom(json.data);
        setListRoom(json.data);
    }

    const onSearch = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if(search != ""){
                const fuse = new Fuse(listroom, {
                    keys: ['room_id', 'room_name']
                })

                let search_result = fuse.search(search)
                let searchRoom = []  
                
                search_result.map(item => {
                    searchRoom.push(item.item)
                })

                setRoom(searchRoom.sort((a,b) => a.room_id - b.room_id));
            }else {
                setRoom(listroom);
            }
        }
     }

    const onDelete = async (data) => {

        setRoomId(data.room_id);

        setConfirmModalTitle("ยืนยันการลบข้อมูล");
        setConfirmModalMessage("คุณยืนยันการลบข้อมูลใช่หรือไม่");
        setConfirmModal(true);
    }
    
    const onConfirmDelete = async () => {
        setConfirmModal(false);
        let json = await API_POST("room/delete", {
            room_id: room_id
        });

        if (json.result) {
            fetchData();
        }else {
            setModalTitle("ไม่สามารถลบข้อมูลประเภทห้องรักษาได้");
            setModalMessage(json.message);
            setShowModal(true);
        }
    }
    
    const onCancelDelete = () => {
        setConfirmModal(false);
    }
    const onClose = () => {
        setConfirmModal(false);
        setShowModal(false);
    }
    const getPagination = () => {
        let items = [];
        pageCount = Math.ceil(listroom.length / numPerPage);

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
                                    <h4 className="text-center">ข้อมูลห้องรักษา</h4>
                                </div>
                                <div className="my-3 ">
                                    <div className="row">
                                        <div className="col-12 col-md-4 col-lg-6 mb-3">
						                    <Link id="button" to={"/room/add"} className="btn btn-sm btn-success btn-add">{<i className="fa-solid fa-plus me-2"></i>}เพิ่มห้องรักษา</Link>
                                        </div>
                                        <div className="col-12 col-md-8 col-lg-6">
                                            <Form noValidate onSubmit={onSearch}>
                                                <InputGroup>
                                                    <Form.Control
                                                        size="sm"
                                                        required
                                                        type="text"
                                                        value={search}
                                                        placeholder="ค้นหาห้องรักษา"
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
                                                <th>ชื่อห้องรักษา</th>
                                                <th>ประเภทห้องรักษา</th>
                                                <th>action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    room.slice(currentPage * numPerPage, (currentPage * numPerPage) + numPerPage).map(item => (
                                                        <RoomItem
                                                        key={item.room_id} 
                                                        data={item}
                                                        onDelete={onDelete} />
                                                    ))
                                                }
                                                <ConfirmModal
                                                show={confirmModal}
                                                title={confirmModalTitle}
                                                message={confirmModalMessage}
                                                onConfirm={onConfirmDelete}
                                                onClose={onCancelDelete}/>
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
            <MessageModal
                show={showModal}
                title={modalTitle}
                message={modalMessage}
                onClose={onClose}
            />
        </>
    )
}