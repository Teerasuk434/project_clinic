import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useState } from 'react';

export default function Sidebar(props){

    let pages = props.pages;
    let role_id = localStorage.getItem("role_id")

    const [menu,setMenu] = useState(false);

    const onClickMenu = () => {
        setMenu(!menu);
    }

    const clearData = () => {
        localStorage.clear();
    }

    const getSideBar = () =>{
        if(role_id == 2){
            return (
                <>
                    <Link className={pages === 1 && "active"} to="/home"><span><img src={`http://localhost:8080/images/img1.png`} alt=""></img></span>หน้าแรก</Link>
                    <Link className={pages === 2 && "active"} to="/list-appoint"><span><img src={`http://localhost:8080/images/appoint2.png`} alt=""></img></span>ตารางนัดหมาย</Link>
                    <Link className={pages === 3 && "active"} to="/emp"><span><img src={`http://localhost:8080/images/emp.png`} alt=""></img></span>จัดการพนักงาน</Link>
                    <Link to="/" onClick={clearData}><span><img src={`http://localhost:8080/images/img7.png`} alt=""></img></span>ออกจากระบบ</Link> 
                </>
            )

        }else if(role_id == 3){
            return (
                <>
                    <Link className={pages === 1 && "active"} to="/home"><span><img src={`http://localhost:8080/images/img1.png`} alt=""></img></span>หน้าแรก</Link>
                    <Link className={pages === 2 && "active"} to="/request-appoint"><span><img src={`http://localhost:8080/images/appoint1.png`} alt=""></img></span>คำขอนัดหมาย</Link>
                    <Link className={pages === 3 && "active"} to="/list-appoint"><span><img src={`http://localhost:8080/images/appoint2.png`} alt=""></img></span>ตารางนัดหมาย</Link>
                    <Link className={pages === 4 && "active"} to="/history-appoint"><span><img src={`http://localhost:8080/images/appoint2.png`} alt=""></img></span>ประวัติการนัดหมาย</Link>
                    <Link className={pages === 5 && "active"} to="/"><span><img src={`http://localhost:8080/images/img7.png`} alt=""></img></span>ออกจากระบบ</Link> 
                </>
            )
            
        }else if(role_id == 4){
            return (
                <>
                    <Link className={pages === 1 && "active"} to="/home"><span><img src={`http://localhost:8080/images/img1.png`} alt=""></img></span>หน้าแรก</Link>
                    <Link className={pages === 2 && "active"} to="/users"><span><img src={`http://localhost:8080/images/img2.png`} alt=""></img></span>ผู้ใช้งาน</Link>
                    <Link className={pages === 3 && "active"} to="/roles"><span><img src={`http://localhost:8080/images/img3.png`} alt=""></img></span>ประเภทผู้ใช้งาน</Link>
                    <Link className={pages === 4 && "active"} to="/emptypes"><span><img src={`http://localhost:8080/images/img5.png`} alt=""></img></span>ประเภทพนักงาน</Link> 
                    <Link className={pages === 5 && "active"} to="/services"><span><img src={`http://localhost:8080/images/img4.png`} alt=""></img></span>บริการของคลินิก</Link>
                    <Link className={pages === 6 && "active"} to="/roomtypes"><span><img src={`http://localhost:8080/images/img6.png`} alt=""></img></span>ประเภทห้องรักษา</Link> 
                    <Link className={pages === 7 && "active"} to="/rooms"><span><img src={`http://localhost:8080/images/img6.png`} alt=""></img></span>ข้อมูลห้องรักษา</Link> 
                    <Link className={pages === 8 && "active"} to="/" onClick={clearData}><span><img src={`http://localhost:8080/images/img7.png`} alt=""></img></span>ออกจากระบบ</Link> 
                </>
            )
        }

    }

    return (
        <div className='sidebar'>
            <div className="menu-bar">
                <div >
                    <button className="btn border border-secondary border-3" onClick={onClickMenu}><i className="fa-solid fa-bars text-light"></i></button>
                </div>
            </div>
            <div className="sidebar-top">
                <img src={`http://localhost:8080/images/Logo.png`} alt="" className="img-sidebar"></img>
            </div>
            
            <div className={menu == false ? "sidebar-bottom-disabled" : "sidebar-bottom"}>
                { getSideBar() } 
            </div>  
        </div>
        
    )
}