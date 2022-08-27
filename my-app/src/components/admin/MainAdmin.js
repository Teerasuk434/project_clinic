import 'bootstrap/dist/css/bootstrap.min.css';
import './Admin.css'
import Sidebar from './Sidebar'
import Top from './Top';

export default function MainAdmin() {
    

    let pages = 1;

    return (
        <>
            <div className="container-fluid">
                <div className='row'>
                    <Top />
                    <div className='p-0 col-12 col-lg-2'>
                        <div className='sidebar'>
                            <Sidebar pages={pages}/>
                        </div>
                    </div>
                    
                    <div className='p-0 col-12 col-lg-10'>
                        <div className="content">
                            <h2>Dashboard</h2>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}