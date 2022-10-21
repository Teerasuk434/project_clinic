import BoxTop from "../Box-top"
import Navigation from "../Navigation"
import Footer from "../Footer"
import { Pagination } from 'react-bootstrap'
import { Link } from "react-router-dom"
import PetsItems from "./PetsItems"
import { API_POST } from "../../api"
import { useEffect, useState } from "react"
import { ConfirmModal } from "../Modal"
import ProfileSidebar from "./ProfileSidebar"

export default function Pets(){

    const [pets, setPets] = useState([]);

    let user_id = localStorage.getItem("user_id");
    let pages = 2;

    var pageCount = 0;
    const [currentPage, setCurrentPage] = useState(0);
    const [numPerPage, setNumPerPage] = useState(3);

    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalMessage, setConfirmModalMessage] = useState("");

    const [pet_id, setPetId] = useState(0);

    useEffect(()=>{

        async function fetchData(user_id){
            let json = await API_POST("listpets/" + user_id);

            setPets(json.data);
            console.log(json.data)
        }
        fetchData(user_id);
                   
    },[])



    const onDelete = async (data) => {
        setPetId(data.pet_id);
        setConfirmModalTitle("ยืนยันการลบข้อมูล");
        setConfirmModalMessage("คุณต้องการลบสัตว์เลี้ยงใช่หรือไม่");
        setConfirmModal(true);
    }

    const onConfirmDelete = async () => {
        setConfirmModal(false);
        let json = await API_POST("pets/delete", {
            pet_id: pet_id
        });

        if (json.result) {
            fetchPets();
            setCurrentPage(0);
        }
    }

    const onCancel = () => {
        setConfirmModal(false);
    }

    const fetchPets = async () => {
        let json = await API_POST("listpets/" + user_id);
        setPets(json.data);

    }

    const getPagination = () => {
        let items = [];
        pageCount = Math.ceil(pets.length / numPerPage);

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
            <BoxTop/>
                <div className="sticky-top">
                    <Navigation />
                </div>

                <div className="container profile">
                    <div className="row">
                        
                        <div className="col-12 col-md-12 col-lg-2 profile-left">
                            <ProfileSidebar pages={pages}/>
                        </div>

                        <div className="col-12 col-md-12 col-lg-10 profile-right">
                            <div className="profile-right-content">
                                <div className="profile-right-header p-2 text-center">
                                    <h4>ข้อมูลสัตว์เลี้ยง</h4>
                                </div>

                                <div className="profile-details">
                                    <div className="mx-5 mt-3 mb-3">
                                        <div className="row">
                                            <div className="col-12 col-md-5 col-lg-3 ">
                                                <Link id="button" to="/account/pet/add" className="btn btn-success btn-sm my-3 col-12 col-md-2">{<i className="fa-solid fa-plus me-2"></i>}เพิ่มข้อมูลสัตว์เลี้ยง</Link>
                                            </div>
                                        </div>


                                        <div className="m-auto text-center row">
                                        {pets.length > 0 &&
                                        <>
                                            {pets.slice(currentPage * numPerPage, (currentPage * numPerPage) + numPerPage).map(item => (
                                                <PetsItems
                                                key={item.pet_id}
                                                data={item}
                                                onDelete={onDelete}
                                                />
                                            ))}

                                            {pets.length >3 &&
                                                <div className="d-flex justify-content-center mt-3">
                                                    <Pagination onSelect={onPageSelected} size="sm">
                                                        <Pagination.First onClick={firstPage} />
                                                        <Pagination.Prev disabled={currentPage == 0} onClick={prevPage} />
                                                        { getPagination()}
                                                        <Pagination.Next disabled={currentPage == pageCount -1} onClick={nextPage} />
                                                        <Pagination.Last onClick={lastPage} />
                                                    </Pagination>
                                                </div>
                                            }
                                        </>
                                        }
                                        {pets.length < 1 &&
                                            <div className="text-center d-block mt-4 ms-5">
                                                <h6 className="">ไม่พบข้อมูลสัตว์เลี้ยงของท่าน โปรดเพิ่มข้อมูลสัตว์เลี้ยง</h6>
                                            </div>
                                        }
                                        </div>

                                    </div>
                                    
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            <Footer/>

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