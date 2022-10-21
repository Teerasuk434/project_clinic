import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Top from '../Top';

export default function MainAdmin() {
    
    let pages = 1;
    let navigate = useNavigate();

    const Users = () => {
        navigate("/users");
    }

    const Roles = () => {
        navigate("/roles");
    }

    const Emptypes = () => {
        navigate("/emptypes");
    }

    const Services = () => {
        navigate("/services");
    }

    const Roomtypes = () =>{
        navigate("/roomtypes");
    }

    const Rooms = () => {
        navigate("/rooms")
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
                    
                    <div className='p-0 col-12 col-lg-10'>
                        <div className="content">
                            <Top />

                            <div className="p-5">
                                 <div className="row">
                                    
                                    <div className="col-12 col-md-6 col-lg-4 ">
                                        <div className='box-main-menu'>
                                            <div className="bg-light shadow row rounded-2 p-2" onClick={Users}>
                                                    <div className="col-4 col-md-4 col-lg-4">
                                                        <img src={`http://localhost:8080/images/img2.png`} alt=""/>
                                                        
                                                    </div>
                                                    <div className="col-8 col-md-8 col-lg-8 py-4">
                                                        <h6 className="text-center">จัดการผู้ใช้งาน</h6>
                                                    </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="col-12 col-md-6 col-lg-4">
                                        <div className='box-main-menu'>
                                            <div className="bg-light shadow row rounded-2 p-2" onClick={Roles}>
                                                <div className="col-4 col-md-4 col-lg-4">
                                                <img src={`http://localhost:8080/images/img3.png`} alt="" />
                                                    
                                                </div>
                                                <div className="col-8 col-md-8 col-lg-8 py-4">
                                                    <h6 className="text-center">จัดการประเภทผู้ใช้งาน</h6>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-4">
                                        <div className='box-main-menu'>
                                            <div className="bg-light shadow row rounded-2 p-2" onClick={Emptypes}>
                                                <div className="col-4 col-md-4 col-lg-4">
                                                <img src={`http://localhost:8080/images/img5.png`} alt="" />
                                                    
                                                </div>
                                                <div className="col-8 col-md-8 col-lg-8 py-4">
                                                    <h6 className="text-center">จัดการประเภทพนักงาน</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-4">
                                        <div className='box-main-menu'>
                                            <div className="bg-light shadow row rounded-2 p-2" onClick={Services}>
                                                <div className="col-4 col-md-4 col-lg-4">
                                                <img src={`http://localhost:8080/images/img4.png`} alt="" />

                                                </div>
                                                <div className="col-8 col-md-8 col-lg-8 py-4">
                                                    <h6 className="text-center">จัดการบริการของคลินิก</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="col-12 col-md-6 col-lg-4">
                                            <div className='box-main-menu'>
                                                <div className="bg-light shadow row rounded-2 p-2" onClick={Roomtypes}>
                                                    <div className="col-4 col-md-4 col-lg-4">
                                                    <img src={`http://localhost:8080/images/img6.png`} alt="" />
                                                        
                                                    </div>
                                                    <div className="col-8 col-md-8 col-lg-8 py-4">
                                                        <h6 className="text-center">จัดการประเภทห้องรักษา</h6>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-4">
                                        <div className='box-main-menu'>
                                            <div className="bg-light shadow row rounded-2 p-2" onClick={Rooms}>
                                                <div className="col-4 col-md-4 col-lg-4">
                                                <img src={`http://localhost:8080/images/img6.png`} alt="" />
                                                    
                                                </div>
                                                <div className="col-8 col-md-8 col-lg-8 py-4">
                                                    <h6 className="text-center">จัดการห้องรักษา</h6>
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