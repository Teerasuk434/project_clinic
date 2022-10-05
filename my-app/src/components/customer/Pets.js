import BoxTop from "../Box-top"
import Navigation from "../Navigation"
import Footer from "../Footer"
import { Form, Row, Col, Table, Button,Pagination } from 'react-bootstrap'
import { Link } from "react-router-dom"
import PetsItems from "./PetsItems"
import { API_GET, API_POST } from "../../api"
import { useEffect, useState } from "react"

export default function Pets(){

    const [pets, setPets] = useState([]);

    let user_id = localStorage.getItem("user_id");

    var pageCount = 0;
    const [currentPage, setCurrentPage] = useState(0);
    const [numPerPage, setNumPerPage] = useState(3);

    useEffect(()=>{

        async function fetchData(user_id){
            let json = await API_POST("listpets/" + user_id);

            setPets(json.data);
            console.log(json.data)
        }
        fetchData(user_id);
                   
    },[])



    const onDelete = async (data) => {
        let json = await API_POST("pets/delete", {
            pet_id: data.pet_id
        });

        if (json.result) {
            fetchPets();
        }
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
                    <div className="row p-4">
                        <div className="col-2 profile-left me-3 ms-5 shadow-sm ">
                            <div className="Profile-Name text-center">
                                <img src={`http://localhost:8080/images/service1-1.png`} alt="" style={{width:"150px"}}/>
                                <h5 className="text-center mt-3">ธีรศักดิ์ เทียนชัย</h5>
                            </div>
                            <div className="border border-bottom-5 mx-2 mb-3"></div>

                            <div className="profile-sidebar">
                                <div>
                                    <Link to="/account/profile">ข้อมูลบัญชี</Link>
                                    <Link className="active" to="/account/pets">ข้อมูลสัตว์เลี้ยง</Link>
                                    <Link to="/account/appointments">ข้อมูลการนัดหมาย</Link>
                                    <Link to="#">ประวัติการนัดหมาย</Link>
                                    <Link to="#">ตั้งค่ารหัสผ่าน</Link>
                                    <Link to="/">ออกจากระบบ</Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-9 profile-right">
                            <div className="profile-right-header p-2 text-center">
                                <h4>ข้อมูลสัตว์เลี้ยง</h4>
                            </div>

                            <div className="profile-details">

                                    <Link to="/account/pet/add" className="btn btn-success btn-sm ms-5 mt-3">{<i className="fa-solid fa-plus me-2"></i>}เพิ่มข้อมูลสัตว์เลี้ยง</Link>
                               
                                <div className="mx-5 mt-3 mb-3">
                                    <div className="m-auto text-center row">
                                    {pets.length > 0 &&
                                    <>
                                        {/* <Table size="sm" responsive bordered hover className='text-center'>
                                            <thead>
                                                <tr>
                                                <th>ชื่อสัตว์เลี้ยง</th>
                                                <th>ประเภท</th>
                                                <th>สายพันธุ์</th>
                                                <th>เพศ</th>
                                                <th>อายุ</th>
                                                <th>action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    pets.map(item => (
                                                        <PetsItems
                                                        key={item.pet_id}
                                                        data={item}
                                                        onDelete={onDelete}
                                                        />
                                                    ))
                                                }
                                            </tbody>
                                        </Table> */}
                                            {pets.slice(currentPage * numPerPage, (currentPage * numPerPage) + numPerPage).map(item => (
                                                <PetsItems
                                                key={item.pet_id}
                                                data={item}
                                                onDelete={onDelete}
                                                />
                                            ))}

                                            {pets.length >3 &&
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
                        <div className="col-1">

                        </div>
                    </div>
                </div>

            <Footer/>
        </>

    )
}