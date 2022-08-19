import BoxTop from "../Box-top"
import Navigation from "../Navigation"
import Footer from "../Footer"
import { Form, Row, Col, Table } from 'react-bootstrap'
import { Link } from "react-router-dom"
import PetsItems from "./PetsItems"
import { API_GET, API_POST } from "../../api"
import { useEffect, useState } from "react"

export default function Pets(){

    const [pets, setPets] = useState([]);

    let user_id = localStorage.getItem("user_id");

    // useEffect(()=>{

    //     async function fetchData(user_id){
    //         let json = await API_GET("customer/" + user_id);

    //         if(json.result == true){
    //             setCustId(json.data[0].cust_id);
  
    //         }
    //     }
    //     fetchData(user_id);
                   
    // },[])

    useEffect(()=>{

        async function fetchData(user_id){
            let json = await API_POST("listpets/" + user_id);

            setPets(json.data);
        }
        fetchData(user_id);
                   
    },[])


    // useEffect(()=>{

    //     async function fetchData(user_id){
    //         let json = await API_GET("listpets" + user_id);
    //         console.log(json)
    //         // if(json.result == true){
    //         //     setCustId(json.data[0].cust_id);
  
    //         // }
    //     }
    //     fetchData(user_id);
                   
    // },[])


    
    // useEffect(()=>{
    //     async function fetchData(){
    //         let json = await API_GET("pets");
    //         if(json.result == true){
    //             let listPets = [];
    //             json.data.map(item => {
    //                 if(item.cust_id === custId){
    //                     listPets.push(item)
    //                 }
    //             })
    //             if(listPets.length > 0){
    //                 setPets(listPets);
    //             }
    //         }
           
    //     }
    //     fetchData();

    // },[custId])

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
                                    <Link to="/account">ข้อมูลบัญชี</Link>
                                    <Link className="active" to="/pets">ข้อมูลสัตว์เลี้ยง</Link>
                                    <a href="">ข้อมูลการนัดหมาย</a>
                                    <a href="">ประวัติการนัดหมาย</a>
                                    <a href="">ตั้งค่ารหัสผ่าน</a>
                                    <a href="/">ออกจากระบบ</a>
                                </div>
                            </div>
                        </div>

                        <div className="col-9 profile-right p-0 shadow-sm">
                            <div className="profile-right-header p-2 text-center">
                                <h4>ข้อมูลสัตว์เลี้ยง</h4>
                            </div>

                            <div className="profile-details">
                                <Link to="/pet/add" className="btn btn-success mx-5 mt-5" style={{width:"20%"}}>{<i className="fa-solid fa-plus me-2"></i>}เพิ่มข้อมูลสัตว์เลี้ยง</Link>

                                <div className="row mx-5 mt-5 mb-3">
                                    <div className="col m-auto text-center">
                                    {pets.length > 0 &&
                                    <>
                                        <Table>
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
                                        </Table>
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