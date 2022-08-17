import './Sidebar.css'

export default function Sidebar(props){

    let pages = props.pages;

    return (
        <div className="sidebar">
            <div className="sidebar-top">
                <img src={`http://localhost:8080/images/Logo.png`} alt=""></img>
            </div>

            <div className="sidebar-bottom">
                <a className={pages === 1 && "active"} href="home"><span><img src={`http://localhost:8080/images/img1.png`} alt=""></img></span>หน้าแรก</a>
                <a className={pages === 2 && "active"} href="users"><span><img src={`http://localhost:8080/images/img2.png`} alt=""></img></span>ผู้ใช้งาน</a>
                <a className={pages === 3 && "active"} href="roles"><span><img src={`http://localhost:8080/images/img3.png`} alt=""></img></span>ประเภทผู้ใช้งาน</a>
                <a className={pages === 4 && "active"} href="emptypes"><span><img src={`http://localhost:8080/images/img5.png`} alt=""></img></span>ประเภทพนักงาน</a> 
                <a className={pages === 5 && "active"} href="services"><span><img src={`http://localhost:8080/images/img4.png`} alt=""></img></span>บริการของคลินิก</a>
                <a className={pages === 6 && "active"} href="#room_types"><span><img src={`http://localhost:8080/images/img6.png`} alt=""></img></span>ประเภทห้องรักษา</a> 
                <a className={pages === 7 && "active"} href="#rooms"><span><img src={`http://localhost:8080/images/img6.png`} alt=""></img></span>ข้อมูลห้องรักษา</a> 
                <a className={pages === 8 && "active"} href="/"><span><img src={`http://localhost:8080/images/img7.png`} alt=""></img></span>ออกจากระบบ</a> 
             </div>
        </div>
        
    )
}