import BoxTop from "../Box-top"
import Navigation from "../Navigation"
import Footer from "../Footer"
import './Account.css'
import { Link } from "react-router-dom"

export default function Account(){
  
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
                                    <div className="col-3 m-auto profile-label">

                                    </div>

                                    <div className="col-9">

                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col">

                                        {/* <Link to="editprofile" className="btn btn-success ms-5" style={{width:"30%"}}>{<i className="fa-solid fa-pen-to-square me-2"></i>}แก้ไขข้อมูล</Link> */}
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