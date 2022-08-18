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
    const [custId, setCustId] = useState(0);

    let user_id = localStorage.getItem("user_id");


    useEffect(()=>{

        async function fetchData(user_id){
            let json = await API_GET("customer/" + user_id);
            setCustId(json.data[0].cust_id);

        }
        fetchData(user_id);

    },[])

    useEffect(()=>{

        async function fetchData(){
            let json = await API_GET("pets");
            let listPets = [];

            json.data.map(item => {
                console.log(item)
                if(item.cust_id === custId){
                    listPets.push(item)
                }
            })

            setPets(listPets);
        }
        fetchData();

    },[custId])
  
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
                                    <Link className="active" to="/account/pets">ข้อมูลสัตว์เลี้ยง</Link>
                                    {/* <a href="/account">ข้อมูลบัญชี</a>
                                    <a className="active" href="/account/pets">ข้อมูลสัตว์เลี้ยง</a> */}
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
                                <div className="row mx-5 mt-5 mb-3">
                                    <div className="col m-auto profile-label text-center">
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
                                                     />
                                                    //  onDelete={onDelete}
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                    </div>

                                </div>
                                
                            </div>

                            <div className="profile-right-content">

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