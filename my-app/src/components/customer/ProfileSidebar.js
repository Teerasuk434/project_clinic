import { Link } from "react-router-dom"

export default function ProfileSidebar (props){

    let fname = localStorage.getItem("cust_firstname");
    let lname = localStorage.getItem("cust_lastname")
    let isLoginGoogle = localStorage.getItem("LoginGoogle");


    const clearData = () => {
        localStorage.clear();
        localStorage.setItem("role_id",0);
    }

    return (
            <div className="profile-sidebar">
                <div className="Profile-Name text-center">
                    <img src={`http://localhost:8080/images/service1-1.png`} alt="" style={{width:"150px"}}/>
                    <h5 className="text-center mt-3">{fname} {lname}</h5>                         
                </div>
                
                <div className="border border-bottom-5 mx-2 mb-3"></div>

                <div className="profile-menu">
                    <div>
                        <Link className={props.pages == 1 && "active"} to="/account/profile">ข้อมูลบัญชี</Link>
                        <Link className={props.pages == 2 && "active"} to="/account/pets">ข้อมูลสัตว์เลี้ยง</Link>
                        <Link className={props.pages == 3 && "active"} to="/account/appointments">ข้อมูลการนัดหมาย</Link>
                        <Link className={props.pages == 4 && "active"} to="/account/history-appoint">ประวัติการนัดหมาย</Link>
                        {!isLoginGoogle &&
                            <Link className={props.pages == 5 && "active"} to="/account/reset-password">ตั้งค่ารหัสผ่าน</Link>
                        }
                    </div>
                </div>
            </div>
    )
}