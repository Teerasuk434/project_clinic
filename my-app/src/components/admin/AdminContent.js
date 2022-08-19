import './AdminContent.css'
import Users from '../users/Users'
import Roles from '../users/Roles';
import Service from '../service/Service';
import 'bootstrap/dist/css/bootstrap.min.css';
import EmpTypeContent from './EmpTypeContent';
import RoomTypes from '../room/RoomTypes';


export default function AdminContent(props){
    return (
            <>
                {props.pages === 1 && <h1>ยินดีต้อนรับเข้าสู่เว็บไซต์</h1> }
                {props.pages === 2 && <Users /> }
                {props.pages === 3 && <Roles />}
                {props.pages === 4 && <EmpTypeContent />}
                {props.pages === 5 && <Service />}
                {props.pages === 6 && <RoomTypes />}

            </>
    )
}