import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BoxTop from "../Box-top";
import Footer from "../Footer";
import Navigation from "../Navigation"
import { API_POST } from "../../api";
import { Table,Pagination } from "react-bootstrap";
import AppointHistoryItem from "./AppointHistoryItem";
import ProfileSidebar from "./ProfileSidebar";

export default function Appointment_History () {

    let user_id = localStorage.getItem("user_id")
    let pages = 4;

    var pageCount = 0;

    const [currentPage, setCurrentPage] = useState(0);
    const [numPerPage, setNumPerPage] = useState(10);
    const [appointments, setAppointments] = useState([]);

    useEffect(()=>{

        async function fetchData(user_id){
            let json = await API_POST("account/history-appointment/" + user_id);

            setAppointments(json.data);
            console.log(json)
        }
        fetchData(user_id);
                   
    },[])

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


    return (
        <>
            <BoxTop/>
                <div className="sticky-top">
                    <Navigation />
                </div>

                <div className="container profile">
                    <div className="row p-4">
                        
                        <ProfileSidebar pages={pages}/>

                        <div className="col-9 profile-right">
                            <div className="profile-right-header p-2 text-center">
                                <h4>ประวัติการนัดหมาย</h4>
                            </div>

                            <div className="profile-details">
                                <div className="row px-5 pt-3">
                                    <div className="col m-auto text-center">

                                    {appointments.length > 0 && 
                                        <Table size="sm" responsive bordered hover>
                                            <thead>
                                                <tr>
                                                <th>รหัส</th>
                                                <th>ชื่อสัตว์เลี้ยง</th>
                                                <th>บริการ</th>
                                                <th>วันที่นัด</th>
                                                <th>เวลา</th>
                                                <th>สถานะ</th>
                                                <th colSpan={2}><p></p></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    appointments.slice(currentPage * numPerPage, (currentPage * numPerPage) + numPerPage).map(item => (
                                                        <AppointHistoryItem
                                                        key={item.appoint_id}
                                                        data={item}
                                                        />
                                                    ))
                                                }
                                            </tbody>
                                        </Table>
                                    }
                                    
                                    {appointments.length < 1 &&
                                        <div className="text-center d-block mt-4 ms-5">
                                            <h6 className="">ไม่พบข้อมูลประวัติการนัดหมาย</h6>
                                        </div>
                                    }    
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
                        <div className="col-1">

                        </div>
                    </div>
                </div>
            <Footer/>
        </>
    )
}