import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css'
import Sidebar from './Sidebar'
import AdminContent from './AdminContent'
import { useEffect } from 'react';

export default function Admin() {
    
    let pages = 2;
    return (
        <>
            <div className="Main">
                <div className='top row'>
                    <div className='col'>
                        สถานะ : แอดมิน
                    </div>
                </div>

                <div className='row'>
                    <div className='p-0 col-12 col-lg-2 bg-primary'>
                        <div className='sidebar'>
                            <Sidebar pages={pages}/>
                        </div>
                    </div>
                    <div className='p-0 m-0 col-12 col-lg-10'>
                        <div className="content">
                            <AdminContent pages={pages}/>
                        </div>
                    </div>
                </div>

            
                <div className='bottom row'>
                        <div className='col'>
                            วันที่ : 8/8/2565
                        </div>
                    </div>
                
            </div>
        </>
    )
}