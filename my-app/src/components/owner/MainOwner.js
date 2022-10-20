import Sidebar from "../Sidebar";
import ReportAppointment from "../Report/ReportAppointment";
import ReportByServices from "../Report/ReportByServices";
import Top from "../Top";

export default function MainOwner() {

    let pages = 1

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
                        <ReportByServices />
                        <ReportAppointment />
                    </div>
                </div>
            </div>

        </div>

    )
}