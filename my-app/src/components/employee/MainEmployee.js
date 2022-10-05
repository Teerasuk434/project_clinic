import Sidebar from '../Sidebar';
import Top from '../Top';

export default function MainEmployee() {
    let pages = 1;

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
                            <h5>หน้าแรก</h5>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}