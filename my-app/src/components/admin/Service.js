import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, Col, Table, Pagination,Button,InputGroup } from 'react-bootstrap';
import { API_GET, API_POST } from '../../api';
import Fuse from 'fuse.js'
import Sidebar from '../Sidebar';
import ServiceItems from './ServiceItems';
import { ConfirmModal,MessageModal } from '../Modal';
import Top from '../Top';

export default function Service() {
    let date = new Date().toLocaleDateString();
    let pages = 5;

    const [search, setSearch] = useState("");
    const [services, setServices] = useState([]);
    const [service_id, setServiceId] = useState(0);
    const [listServices, setListServices] = useState([]);

    var pageCount = 0;
    const [currentPage, setCurrentPage] = useState(0);
    const [numPerPage, setNumPerPage] = useState(10);

    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalMessage, setConfirmModalMessage] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    useEffect(() => {
        fetchServices();
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
        setConfirmModalTitle("???????????????????????????????????????????????????");
        setConfirmModalMessage("????????????????????????????????????????????????????????????????????????????????????");
        setConfirmModal(true);
    }

     const onConfirmDelete = async () => {
        setConfirmModal(false);
        let json = await API_POST("service/delete", {
            service_id: service_id
        });

        if(json.result) {
            fetchServices();
        } else {
            setModalTitle("??????????????????????????????????????????????????????????????????????????????");
            setModalMessage(json.message);
            setShowModal(true);
        }
    }

    const onClose = () => {
        setConfirmModal(false);
        setShowModal(false);
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
                                    <h4 className="text-center">????????????????????????????????????</h4>
                                </div>
                                <div className="mt-2">
                                    <div className="row">
                                        <div className="col-12 col-md-4 col-lg-6 mb-3">
									        <Link to={"/service/add"} className="btn btn-sm btn-success btn-add">{<i className="fa-solid fa-plus me-2"></i>}?????????????????????????????????</Link>
                                        </div>
                                        <div className="col-12 col-md-8 col-lg-6">
                                            <Form noValidate onSubmit={onSearch}>
                                                <InputGroup>
                                                    <Form.Control
                                                        size="sm"
                                                        required
                                                        type="text"
                                                        value={search}
                                                        placeholder="?????????????????????????????????"
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
                                                <th>??????????????????????????????</th>
                                                <th>???????????????????????????</th>
                                                <th>????????????????????????</th>
                                                <th>??????????????????????????????</th>
                                                <th>??????????????????</th>
                                                <th>??????????????????????????????</th>
                                                <th colSpan={2}>action</th>
                                                </tr>
                                            </thead>
                                            <tbody className='table-group-divider align-middle'>
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

                                <div className="container d-flex justify-content-end">
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
                onClose={onClose}
            />

            <MessageModal
                show={showModal}
                title={modalTitle}
                message={modalMessage}
                onClose={onClose}
            />
        </>
    )
}