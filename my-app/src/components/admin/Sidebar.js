import './Sidebar.css'

export default function Sidebar(props){

    let pages = props.pages;

    return (
        <div className="sidebar">
            <div className="sidebar-top">
                <img src={`http://localhost:8080/images/Logo.png`}></img>
            </div>

            <div className="sidebar-bottom">
                <a className={pages === 1 && "active"} href="home"><span><img src={`http://localhost:8080/images/img1.png`}></img></span>หน้าแรก</a>
                <a className={pages === 2 && "active"} href="users"><span><img src={`http://localhost:8080/images/img2.png`}></img></span>ผู้ใช้งาน</a>
                <a className={pages === 3 && "active"} href="roles"><span><img src={`http://localhost:8080/images/img3.png`}></img></span>ประเภทผู้ใช้งาน</a>
                <a className={pages === 4 && "active"} href="#emp_types"><span><img src={`http://localhost:8080/images/img5.png`}></img></span>ประเภทพนักงาน</a> 
                <a className={pages === 5 && "active"} href="services"><span><img src={`http://localhost:8080/images/img4.png`}></img></span>บริการของคลินิก</a>
                <a className={pages === 6 && "active"} href="#room_types"><span><img src={`http://localhost:8080/images/img6.png`}></img></span>ประเภทห้องรักษา</a> 
                <a className={pages === 7 && "active"} href="#rooms"><span><img src={`http://localhost:8080/images/img6.png`}></img></span>ข้อมูลห้องรักษา</a> 
                <a className={pages === 8 && "active"} href="/"><span><img src={`http://localhost:8080/images/img7.png`}></img></span>ออกจากระบบ</a> 
             </div>
        </div>
        
    )
}