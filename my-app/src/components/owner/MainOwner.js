import { Link } from "react-router-dom";
import Sidebar from "../Sidebar";
import ReportAppointment from "../Report/ReportAppointment";
import ReportByServices from "../Report/ReportByServices";
import Top from "../Top";

export default function MainOwner() {

    let date = new Date().toLocaleDateString();
    let pages = 1


    const clearData = () => {
        localStorage.clear();
    }

    return (
    
        <div className="container-fluid">
            <div className='row'>
            
                <div className='p-0 col-12 col-lg-2'>
                    <div className='sidebar'>
                           <Sidebar pages ={pages} />
                    </div>
                </div>
                
                <div className='p-0 col-12 col-lg-10'>
                    <div className="content p-0">
                    <Top />
                        {/* <ReportByServices /> */}
                        <ReportAppointment />
                    </div>
                </div>
            </div>

        </div>

    )
}