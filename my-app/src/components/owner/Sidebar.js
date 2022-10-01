import './Sidebar.css'
import { Link } from 'react-router-dom';

export default function Sidebar(props){

    let pages = props.pages;


    const clearData = () => {
        localStorage.clear();
    }

    return (
        <div className='sidebar'>
            <div className="sidebar-top">
                <img src={`http://localhost:8080/images/Logo.png`} alt=""></img>
            </div>
            
            <div className="sidebar-bottom">
                <Link className={pages === 1 && "active"} to="/home"><span><img src={`http://localhost:8080/images/img1.png`} alt=""></img></span>หน้าแรก</Link>
                <Link className={pages === 2 && "active"} to="/list-appointment"><span><img src={`http://localhost:8080/images/appoint2.png`} alt=""></img></span>ตารางนัดหมาย</Link>
                <Link className={pages === 3 && "active"} to="/emp"><span><img src={`http://localhost:8080/images/emp.png`} alt=""></img></span>จัดการพนักงาน</Link>
                <Link className={pages === 8 && "active"} to="/" onClick={clearData}><span><img src={`http://localhost:8080/images/img7.png`} alt=""></img></span>ออกจากระบบ</Link> 
            </div>  
        </div>
        
    )
}