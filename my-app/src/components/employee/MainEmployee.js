import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Top from '../Top';

export default function MainEmployee() {
    let pages = 1;

    let navigate = useNavigate();

    const RequestAppoint = () => {
        navigate("/request-appoint");
    }

    const Appointment = () => {
        navigate("/list-appoint");
    }

    const HistoryAppointment = () => {
        navigate("/history-appoint");
    }

    return (
        <>
            <div className="container-fluid">
                <div className='row'>
                    <div className='p-0 col-12 col-lg-2'>
                        <div className='sidebar'>
                            <Sidebar pages={pages}/>
                        </div>
                    </div>
                    
                    <div className='p-0 m-0 col-12 col-lg-10'>
                        <div className="content">
                            <Top />
                            <div className="p-5">
                                 <div className="row">
                                    <div className="col-12 col-md-6 col-lg-4 ">
                                        <div className='box-main-menu'>
                                            <div className="bg-light shadow row rounded-2 p-2" onClick={RequestAppoint}>
                                                    <div className="col-4 col-md-4 col-lg-4">
                                                        <img src={`http://localhost:8080/images/appoint1.png`} alt=""/>
                                                        
                                                    </div>
                                                    <div className="col-8 col-md-8 col-lg-8 py-4">
                                                        <h5 className="text-center">จัดการคำขอนัดหมาย</h5>
                                                    </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="col-12 col-md-6 col-lg-4">
                                        <div className='box-main-menu'>
                                            <div className="bg-light shadow row rounded-2 p-2" onClick={Appointment}>
                                                <div className="col-4 col-md-4 col-lg-4">
                                                <img src={`http://localhost:8080/images/appoint2.png`} alt="" />
                                                    
                                                </div>
                                                <div className="col-8 col-md-8 col-lg-8 py-4">
                                                    <h5 className="text-center">จัดการตารางนัดหมาย</h5>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-4">
                                        <div className='box-main-menu'>
                                            <div className="bg-light shadow row rounded-2 p-2" onClick={HistoryAppointment}>
                                                <div className="col-4 col-md-4 col-lg-4">
                                                <img src={`http://localhost:8080/images/appoint2.png`} alt="" />
                                                    
                                                </div>
                                                <div className="col-8 col-md-8 col-lg-8 py-4">
                                                    <h5 className="text-center">ประวัติการนัดหมาย</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                 </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}