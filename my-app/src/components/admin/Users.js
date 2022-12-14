import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { API_GET, API_POST } from '../../api';
import { Link } from 'react-router-dom';
import { Form,Table,Button,InputGroup,Pagination } from 'react-bootstrap'
import Fuse from 'fuse.js'
import { ConfirmModal } from '../Modal';
import Sidebar from '../Sidebar';
import Top from '../Top';
import UsersItem from './UsersItem';

export default function Admin() {
    let pages = 2;

    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [listUsers, setListUsers] = useState([]);

    const [user_id, setUserId] = useState(0);

    var pageCount = 0;
    const [currentPage, setCurrentPage] = useState(0);
    const [numPerPage, setNumPerPage] = useState(10);

    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalMessage, setConfirmModalMessage] = useState("");


    useEffect(() => {
        fetchUsers();

    }, []);

    useEffect(() => {
        if(search === ""){
            setUsers(listUsers);
        }

    }, [search]);

    const fetchUsers = async () => {
        let json = await API_GET("users");
        setListUsers(json.data);
        setUsers(json.data);
    }

    const onDelete = async (data) => {

        setUserId(data.user_id);
        setConfirmModalTitle("ยืนยันการลบข้อมูล");
        setConfirmModalMessage("คุณต้องการลบข้อมูลใช่หรือไม่");
        setConfirmModal(true);
    }

     const onConfirmDelete = async () => {
        setConfirmModal(false);
        let json = await API_POST("user/delete", {
            user_id: user_id
        });

        if (json.result) {
            fetchUsers();
        }
    }

    const onCancel = () => {
        setConfirmModal(false);
    }

    const onSearch = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if(search !== ""){

                const fuse = new Fuse(listUsers, {
                    keys: ['user_id','username','role_name']
                })

                let search_result = fuse.search(search)
                let searchUser = []

                search_result.map(item => {
                    searchUser.push(item.item)
                })

                setUsers(searchUser.sort((a,b) => a.user_id - b.user_id));
            }else {
                setUsers(listUsers);
            }
        }
     }

     const getPagination = () => {
        let items = [];
        pageCount = Math.ceil(listUsers.length / numPerPage);

        for (let i = 0; i< pageCount; i++) {
            items.push(
                <Pagination.Item key={i}
                    active={currentPage === i}
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
                    <div className='p-0 col-12 col-md-12 col-lg-2'>
                        <div className='sidebar'>
                            <Sidebar pages={pages}/>
                        </div>
                    </div>
                    
                    <div className='p-0 m-0 col-12 col-md-12 col-lg-10'>
                        <div className="content m-auto">
                            <Top />
                            <div className='mx-4 my-3 pt-2 px-4 rounded shadow border bg-light'>
                                <div className="border-bottom border-dark border-opacity-50 mb-2">
                                    <h4 className="text-center">ข้อมูลผู้ใช้งาน</h4>
                                </div>

                                <div className="mt-2">
                                    <div className="row">
                                        <div className="col-12 col-md-4 col-lg-6 mb-3">
									        <Link to={"/user/add"} className="btn btn-sm btn-success btn-add">{<i className="fa-solid fa-plus me-2"></i>}เพิ่มผู้ใช้งาน</Link>
                                        </div>
                                        <div className="col-12 col-md-8 col-lg-6">
                                            <Form noValidate onSubmit={onSearch}>
                                                <InputGroup>
                                                    <Form.Control
                                                        size="sm"
                                                        required
                                                        type="text"
                                                        value={search}
                                                        placeholder="ค้นหาผู้ใช้งาน"
                                                        onChange={(e) => setSearch(e.target.value)}
                                                    />
                                                    <Button variant="success" type="submit" size="sm">{<i className="fa-solid fa-magnifying-glass me-2"></i>}ค้นหา</Button>
                                                </InputGroup>
                                            </Form>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Table size="sm" responsive bordered hover className='text-center'>
                                        <thead>
                                                <tr>
                                                <th>#</th>
                                                <th>ชื่อผู้ใช้งาน         </th>
                                                <th>ประเภทผู้ใช้งาน</th>
                                                <th colSpan={2}>action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    users.slice(currentPage * numPerPage, (currentPage * numPerPage) + numPerPage).map(item => (
                                                        <UsersItem
                                                        key={item.user_id}
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
                                        <Pagination.Prev disabled={currentPage === 0} onClick={prevPage} />
                                        { getPagination()}
                                        <Pagination.Next disabled={currentPage === pageCount -1} onClick={nextPage} />
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
                onClose={onCancel}
            />
        </>
    )
}