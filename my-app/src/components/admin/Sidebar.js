import Logo from './images/Logo.png'
import IconMain from './images/img1.png'
import IconUser from './images/img2.png'
import IconTypeUser from './images/img3.png'
import IconEmp from './images/img5.png'
import IconService from './images/img6.png'
import IconRoomType from './images/img4.png'
import IconExit from './images/img7.png'
import './Sidebar.css'

export default function Sidebar(props){

    let pages = props.pages;

    return (
        <div className="sidebar">
            <div className="sidebar-top">
                <img src={Logo}></img>
            </div>

            <div className="sidebar-bottom">
                <a className={pages === 1 && "active"} href="home"><span><img src={IconMain}></img></span>หน้าแรก</a>
                <a className={pages === 2 && "active"} href="users"><span><img src={IconUser}></img></span>ผู้ใช้งาน</a>
                <a className={pages === 3 && "active"} href="roles"><span><img src={IconTypeUser}></img></span>ประเภทผู้ใช้งาน</a>
                <a className={pages === 4 && "active"} href="#emp_types"><span><img src={IconEmp}></img></span>ประเภทพนักงาน</a> 
                <a className={pages === 5 && "active"} href="services"><span><img src={IconService}></img></span>บริการของคลินิก</a>
                <a className={pages === 6 && "active"} href="#room_types"><span><img src={IconService}></img></span>ประเภทห้องรักษา</a> 
                <a className={pages === 7 && "active"} href="#rooms"><span><img src={IconRoomType}></img></span>ข้อมูลห้องรักษา</a> 
                <a className={pages === 8 && "active"} href="/"><span><img src={IconExit}></img></span>ออกจากระบบ</a> 
             </div>
        </div>
        
    )
}