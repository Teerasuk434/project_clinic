import { useEffect,useState } from "react";

export default function Top(){

    let date = new Date().toLocaleDateString();
    
    let role_id = localStorage.getItem("role_id")



    return(
        <>
            <div className='top d-flex justify-content-between px-3'>

                <div className="text">
                    <p className='me-2'>วันที่ : {date}</p>
                </div>
                <div className='text'>
                   {role_id == 2 &&  <p> สถานะ : เจ้าของคลินิก</p>}
                   {role_id == 3 &&  <p> สถานะ : พนักงาน</p>}
                   {role_id == 4 &&  <p> สถานะ : ผู้ดูแลระบบ</p>}
                </div>

            </div>
        </>
    )
}