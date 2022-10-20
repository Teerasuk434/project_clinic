import { Link } from "react-router-dom"
import { useState,useEffect } from "react";
import { API_GET } from "../../api";

export default function ProfileSidebar (props){

    let user_id = localStorage.getItem("user_id");
    let isLoginGoogle = localStorage.getItem("LoginGoogle");
    const [cust_fname, setCustFname] = useState("");
    const [cust_lname, setCustLname] = useState("");

    useEffect(()=>{
        checkUser();
    },[])

    const checkUser = async () =>{
        let json = await API_GET("customer/" + user_id);
        if(json.result){
            console.log(json)
            setCustFname(json.data[0].cust_fname);
            setCustLname(json.data[0].cust_lname);
        }
    }

    return (
            <div className="profile-sidebar">
                <div className="Profile-Name text-center">
                    <img src={`http://localhost:8080/images/service1-1.png`} alt="" style={{width:"150px"}}/>
                    <h5 className="text-center mt-3">{cust_fname} {cust_lname}</h5>                         
                </div>
                
                <div className="border border-bottom-5 mx-2 mb-3"></div>

                <div className="profile-menu">
                    <div>
                        <Link className={props.pages === 1 && "active"} to="/account/profile">ข้อมูลบัญชี</Link>
                        <Link className={props.pages === 2 && "active"} to="/account/pets">ข้อมูลสัตว์เลี้ยง</Link>
                        <Link className={props.pages === 3 && "active"} to="/account/appointments">ข้อมูลการนัดหมาย</Link>
                        <Link className={props.pages === 4 && "active"} to="/account/history-appoint">ประวัติการนัดหมาย</Link>
                        {!isLoginGoogle &&
                            <Link className={props.pages === 5 && "active"} to="/account/reset-password">ตั้งค่ารหัสผ่าน</Link>
                        }
                    </div>
                </div>
            </div>
    )
}