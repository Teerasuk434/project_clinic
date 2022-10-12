import BoxTop from "../Box-top"
import Navigation from "../Navigation"
import Footer from "../Footer"
import { useEffect, useState } from "react"
import { API_GET} from "../../api"
import Moment from 'moment';
import { Link } from "react-router-dom"
import ProfileSidebar from "./ProfileSidebar"

export default function Account(){
    
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [tel, setTel] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [email, setEmail] = useState("");

    let user_id = localStorage.getItem("user_id");
    let username = localStorage.getItem("username");
    let pages = 1;

    useEffect(()=>{

        async function fetchData(){
            let json = await API_GET("customer/" + user_id);
            setFirstName(json.data[0].cust_fname);
            setLastName(json.data[0].cust_lname);
            setTel(json.data[0].cust_tel);
            setAddress(json.data[0].cust_address);
            setGender(json.data[0].cust_gender);
            setEmail(json.data[0].email);

            let bd_split = (json.data[0].cust_birthdate).split("T")
            setBirthDate(Moment(bd_split[0]).format('DD/MM/YYYY'));
        }
        fetchData();

    },[])

    return(
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
                                <h4>ข้อมูลบัญชีของฉัน</h4>
                            </div>

                            <div className="profile-details">
                                <div className="row mx-5 mt-5 mb-4">
                                    <div className="col-3 m-auto profile-label">
                                        <p>ชื่อผู้ใช้งาน</p>
                                        <p>ชื่อ-สกุล</p>
                                        <p>เพศ</p>
                                        <p>วันเกิด</p>
                                        <p>หมายเลขโทรศัพท์</p>
                                        <p>ที่อยู่</p>
                                        <p>อีเมล</p>
                                    </div>

                                    <div className="col-9">
                                        <p>{username}</p>
                                        <p className="mt-1">{firstname} {lastname}</p>
                                        <p className="mt-1">{gender}</p>
                                        <p className="mt-1">{birthDate}</p>
                                        <p className="mt-1">{tel}</p>
                                        <p className="mt-1">{address}</p>
                                        <p className="mt-1">{email}</p>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col">

                                        <Link to="/account/editprofile" className="btn btn-success ms-5" style={{width:"30%"}}>{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไขข้อมูล</Link>
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