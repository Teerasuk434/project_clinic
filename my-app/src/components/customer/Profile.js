import BoxTop from "../Box-top"
import Navigation from "../Navigation"
import Footer from "../Footer"
import './Profile.css'

export default function Profile(){
    return(
        <>
            <BoxTop/>
                <div className="sticky-top">
                    <Navigation />
                </div>

                <div className="container profile">
                    <div className="row p-4">
                        <div className="col-2 profile-left">
                            <div className="Profile-Name text-center">
                            <img src={`http://localhost:8080/images/service1-1.png`} alt="" style={{width:"150px"}}/>
                                <h6 className="text-center mt-2">ธีรศักดิ์ เทียนชัย</h6>
                            </div>

                            <div className="profile-sidebar mx-2 my-5">
                                <a href="#">โปรไฟล์</a>
                                <a href="#">ข้อมูลสัตว์เลี้ยง</a>
                                <a href="">ข้อมูลการนัดหมาย</a>
                                <a href="">ประวัติการนัดหมาย</a>
                                <a href="">ออกจากระบบ</a>
                            </div>
                        </div>

                        <div className="col-10 profile-right">
                            ขวา
                        </div>
                    </div>
                </div>

            <Footer/>


        </>

    )
}