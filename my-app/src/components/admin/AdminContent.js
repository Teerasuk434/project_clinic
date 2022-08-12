import './AdminContent.css'
import Users from '../users/Users'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminContent(props){
    return (
            <>
                {props.pages === 1 && <h1>ยินดีต้อนรับเข้าสู่เว็บไซต์</h1> }
                {props.pages === 2 && <Users /> }
            </>
    )
}