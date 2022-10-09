import { Link } from "react-router-dom"

export default function ProfileSidebar (props){
    return (
        <div>
            <Link className={props.pages == 1 && "active"} to="/account/profile">ข้อมูลบัญชี</Link>
            <Link className={props.pages == 2 && "active"} to="/account/pets">ข้อมูลสัตว์เลี้ยง</Link>
            <Link className={props.pages == 3 && "active"} to="/account/appointments">ข้อมูลการนัดหมาย</Link>
            <Link className={props.pages == 4 && "active"} to="/account/history-appoint">ประวัติการนัดหมาย</Link>
            <Link className={props.pages == 5 && "active"} to="/account/reset-password">ตั้งค่ารหัสผ่าน</Link>
            <Link to="/">ออกจากระบบ</Link>
        </div>
    )
}