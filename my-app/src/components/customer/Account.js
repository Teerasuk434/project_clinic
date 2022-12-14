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
                    <div className="row">

                        <div className="col-12 col-md-12 col-lg-2 profile-left">
                            <ProfileSidebar pages={pages}/>
                        </div>
                        
                        <div className="col-12 col-md-12 col-lg-10 profile-right">
                            <div className="profile-right-content">
                                <div className="profile-right-header p-2 text-center">
                                    <h4>???????????????????????????????????????????????????</h4>
                                </div>

                                <div className="profile-details">
                                    <div className="profile-content pt-5 px-5 pb-3">
                                        <div className="row mb-3">
                                            <label className="col-12 col-md-3 fw-bold">???????????????????????????????????????</label>
                                            <div className="col-12 col-md-9">{username}</div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-12 col-md-3 fw-bold">????????????-????????????</label>
                                            <div className="col-12 col-md-9">{firstname} {lastname}</div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-12 col-md-3 fw-bold">?????????</label>
                                            <div className="col-12 col-md-9">{gender}</div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-12 col-md-3 fw-bold">?????????????????????</label>
                                            <div className="col-12 col-md-9">{birthDate}</div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-12 col-md-3 fw-bold">?????????????????????????????????????????????</label>
                                            <div className="col-12 col-md-9">{tel}</div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-12 col-md-3 fw-bold">?????????????????????</label>
                                            <div className="col-12 col-md-9">{address}</div>
                                        </div>
                                        <div className="row mb-3">
                                            <label className="col-12 col-md-3 fw-bold">???????????????</label>
                                            <div className="col-12 col-md-9">{email}</div>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-12 col-md-5 col-lg-3 px-5">
                                            <Link to="/account/editprofile" id="button" className="btn btn-success">{<i className="fa-solid fa-pen-to-square me-2"></i>}?????????????????????????????????</Link>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            <Footer/>


        </>

    )
}