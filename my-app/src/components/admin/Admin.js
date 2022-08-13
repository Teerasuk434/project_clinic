import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css'
import Sidebar from './Sidebar'
import AdminContent from './AdminContent';

export default function Admin() {
    let date = new Date().toLocaleDateString();
    let pages = 1;

    console.log(date);
    return (
        <>
            <div className="container-fluid">
                <div className='top row'>
                    <div className='col'>
                        <p>สถานะ : แอดมิน</p>
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
                            <p>วันที่ : {date}</p>
                        </div>
                    </div>
                
            </div>
        </>
    )
}