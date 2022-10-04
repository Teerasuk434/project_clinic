import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { API_GET, API_POST } from '../../api';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Table,Button,InputGroup,Pagination } from 'react-bootstrap'
import Fuse from 'fuse.js'

import Sidebar from './Sidebar'
import Top from '../Top';
import UsersItem from './UsersItem';

export default function Admin() {
    let date = new Date().toLocaleDateString();
    let pages = 2;

    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [listUsers, setListUsers] = useState([]);

    var pageCount = 0;
    const [currentPage, setCurrentPage] = useState(0);
    const [numPerPage, setNumPerPage] = useState(10);


    useEffect(() => {
        async function fetchData() {
            const response = await fetch(
                "http://localhost:8080/api/users",
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        'Content-Type': 'application/json',
                        Authorization: "Bearer " + localStorage.getItem("access_token")
                    }
                }
            );

            let json = await response.json();
            setListUsers(json.data);
            setUsers(json.data);
        }
        fetchData();

    }, []);

    useEffect(() => {
        if(search == ""){
            setUsers(listUsers);
        }

    }, [search]);

    const fetchUsers = async () => {
        let json = await API_GET("users");
        setListUsers(json.data);
        setUsers(json.data);
    }

    const onDelete = async (data) => {
        let json = await API_POST("user/delete", {
            user_id: data.user_id
        });

        if (json.result) {
            fetchUsers();
        }
    }

    const onSearch = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if(search != ""){

                const fuse = new Fuse(listUsers, {
                    keys: ['user_id','username','role_name']
                })

                let search_result = fuse.search(search)
                let searchUser = []

                search_result.map(item => {
                    searchUser.push(item.item)
                })

                console.log(searchUser)

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
                            <div className='m-4 p-4 rounded shadow border bg-light'>
                                <div className="border-bottom border-dark border-opacity-50 mb-2">
                                    <h4 className="text-center">ข้อมูลผู้ใช้งาน</h4>
                                </div>
                                <div className="my-3 ">
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
                                </div>

                                <div className="mt-2">
                                    <Table size="sm" responsive bordered hover className='text-center'>
                                        <thead>
                                                <tr>
                                                <th>รหัสผู้ใช้งาน</th>
                                                <th>ชื่อผู้ใช้งาน         </th>
                                                <th>ประเภทผู้ใช้งาน</th>
                                                <th>action</th>
                                                </tr>
                                            </thead>
                                            <tbody className='table-group-divider align-middle'>
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
                                    <Pagination onSelect={onPageSelected} >
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