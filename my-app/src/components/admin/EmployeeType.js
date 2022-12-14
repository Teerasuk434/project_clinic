import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Table, Pagination, Button , InputGroup} from 'react-bootstrap';
import { API_GET, API_POST } from '../../api';
import Sidebar from "../Sidebar";
import Top from '../Top';
import EmployeeTypeItems from './EmployeeTypeItems';
import { ConfirmModal , MessageModal } from '../Modal';
import { useNavigate } from 'react-router-dom'; 
import Fuse from 'fuse.js';

export default function EmployeeType(props){

    let date = new Date().toLocaleDateString();
    let pages = 4;
    let navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [empTypes, setEmpTypes] = useState([]);
    const [listEmpTypes, setListEmpTypes] = useState([]);

    const [emp_position_id, setEmpPositionId] = useState(0);

    // confirmModal
    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalMessage, setConfirmModalMessage] = useState("");

    var pageCount = 0;
    const [currentPage, setCurrentPage] = useState(0);
    const [numPerPage, setNumPerPage] = useState(10);

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");


    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if(search == ""){
            setEmpTypes(listEmpTypes);
        }

    }, [search]);


    const fetchData = async () => {
        let json = await API_GET("emp_types");
        setEmpTypes(json.data);
        setListEmpTypes(json.data);
    }

    const onSearch = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if(search != ""){
                const fuse = new Fuse(listEmpTypes, {
                    keys: ['emp_position_id', 'emp_position_name']
                })

                let search_result = fuse.search(search)
                let searchEmpType = []  
                
                search_result.map(item => {
                    searchEmpType.push(item.item)
                })
    
                setEmpTypes(searchEmpType.sort((a,b) => a.emp_position_id - b.emp_position_id));
            }else {
                setEmpTypes(listEmpTypes);

            }
        }
     }
     
     const onDelete = async (data) => {

        setEmpPositionId(data.emp_position_id);

        setConfirmModalTitle("???????????????????????????????????????????????????");
        setConfirmModalMessage("??????????????????????????????????????????????????????????????????????????????????????????");
        setConfirmModal(true);

    }
    
        const onConfirmDelete = async () => {
            setConfirmModal(false);
            console.log(emp_position_id);
            let json = await API_POST("emp_types/delete", {
                emp_position_id: emp_position_id
            })
    
            if (json.result) {
                fetchData();
            } else {
                setModalTitle("???????????????????????????????????????????????????????????????????????????????????????????????????");
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
            pageCount = Math.ceil(listEmpTypes.length / numPerPage);
    
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
                            <div className='mx-4 my-3 pt-2 px-4 rounded shadow border bg-light'>
                                <div className="border-bottom border-dark border-opacity-50 mb-2">
                                    <h4 className="text-center">?????????????????????????????????????????????????????????</h4>
                                </div>
                                <div className="mt-2">
                                    <div className="row">
                                        <div className="col-12 col-md-4 col-lg-6 mb-3"> 
						                    <Link to={"/emptypes/add"} className="btn btn-sm btn-success btn-add">{<i className="fa-solid fa-plus me-2"></i>}??????????????????????????????????????????????????????</Link>
                                        </div>
                                        <div className="col-12 col-md-8 col-lg-6">
                                            <Form noValidate onSubmit={onSearch}>
                                                <InputGroup>
                                                    <Form.Control
                                                        size="sm"
                                                        required
                                                        type="text"
                                                        value={search}
                                                        placeholder="??????????????????????????????????????????????????????"
                                                        onChange={(e) => setSearch(e.target.value)}
                                                    />
                                                    <Button variant="success" type="submit" size="sm">{<i className="fa-solid fa-magnifying-glass me-2"></i>}???????????????</Button>
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
                                                <th>???????????????????????????????????????????????????</th>
                                                <th>action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    empTypes.slice(currentPage * numPerPage, (currentPage * numPerPage) + numPerPage).map(item => (
                                                        <EmployeeTypeItems
                                                        key={item.emp_position_id}
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

                                <div className="d-flex justify-content-end mt-2">
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