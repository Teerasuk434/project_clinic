import { Link } from "react-router-dom";

export default function Sidebar(props){

    let pages = props.pages;

    const clearData = () => {
        localStorage.clear();
    }

    return (
        <div className="sidebar">
            <div className="sidebar-top">
                <img src={`http://localhost:8080/images/Logo.png`} alt=""></img>
            </div>

            <div className="sidebar-bottom">
                <Link className={pages === 1 && "active"} to="/home"><span><img src={`http://localhost:8080/images/img1.png`} alt=""></img></span>หน้าแรก</Link>
                <Link className={pages === 2 && "active"} to="/users"><span><img src={`http://localhost:8080/images/img2.png`} alt=""></img></span>ผู้ใช้งาน</Link>
                <Link className={pages === 3 && "active"} to="/roles"><span><img src={`http://localhost:8080/images/img3.png`} alt=""></img></span>ประเภทผู้ใช้งาน</Link>
                <Link className={pages === 4 && "active"} to="/emptypes"><span><img src={`http://localhost:8080/images/img5.png`} alt=""></img></span>ประเภทพนักงาน</Link> 
                <Link className={pages === 5 && "active"} to="/services"><span><img src={`http://localhost:8080/images/img4.png`} alt=""></img></span>บริการของคลินิก</Link>
                <Link className={pages === 6 && "active"} to="/roomtypes"><span><img src={`http://localhost:8080/images/img6.png`} alt=""></img></span>ประเภทห้องรักษา</Link> 
                <Link className={pages === 7 && "active"} to="/rooms"><span><img src={`http://localhost:8080/images/img6.png`} alt=""></img></span>ข้อมูลห้องรักษา</Link> 
                <Link className={pages === 8 && "active"} to="/" onClick={clearData}><span><img src={`http://localhost:8080/images/img7.png`} alt=""></img></span>ออกจากระบบ</Link> 

             </div>
        </div>
        
    )
}