import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Report from "./Report";

export default function MainOwner() {

    let date = new Date().toLocaleDateString();
    let pages = 1


    const clearData = () => {
        localStorage.clear();
    }

    return (
    
        <div className="container-fluid">
            <div className='row'>
                <div className='top d-flex justify-content-between px-3'>
                    <div className="text">
                        <p className='me-2'>วันที่ : {date}</p>
                    </div>
                    <div className='text'>
                        <p> สถานะ : เจ้าของคลินิก</p>
                    </div>
                </div>

                <div className='p-0 col-12 col-lg-2'>
                    <div className='sidebar'>
                           <Sidebar pages ={pages} />
                    </div>
                </div>
                
                <div className='p-0 col-12 col-lg-10'>
                    <div className="content p-0 mt-3">
                        <Report />
                    </div>
                </div>
            </div>

        </div>

    )
}