import './Sidebar.css'
import { Link } from "react-router-dom";

export default function Sidebar(props){

    let pages = props.pages;

    return (
        <div className="sidebar">
            <div className="sidebar-top">
                <img src={`http://localhost:8080/images/Logo.png`} alt=""></img>
            </div>

            <div className="sidebar-bottom">
                <Link className={pages === 1 && "active"} to="/home"><span><img src={`http://localhost:8080/images/img1.png`} alt=""></img></span>หน้าแรก</Link>
                <Link className={pages === 2 && "active"} to="/request-appoint"><span><img src={`http://localhost:8080/images/appoint1.png`} alt=""></img></span>คำขอนัดหมาย</Link>
                <Link className={pages === 3 && "active"} to="/list-appoint"><span><img src={`http://localhost:8080/images/appoint2.png`} alt=""></img></span>ตารางนัดหมาย</Link>
                <Link className={pages === 4 && "active"} to="/history-appoint"><span><img src={`http://localhost:8080/images/appoint2.png`} alt=""></img></span>ประวัติการนัดหมาย</Link>
                <Link className={pages === 5 && "active"} to="/"><span><img src={`http://localhost:8080/images/img7.png`} alt=""></img></span>ออกจากระบบ</Link> 
             </div>
        </div>
        
    )
}