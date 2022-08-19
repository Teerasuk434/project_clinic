import Sidebar from "./Sidebar";
import AdminContent from "./AdminContent";

export default function Rooms(){
    
    let date = new Date().toLocaleDateString();
    // let pages = 6


    
    
    return(
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

            
                <div className="row">              
                    <div className='bottom'>
                        <div>
                            {/* <p>วันที่ : {date}</p> */}
                        </div>
                    </div>
                </div>
                
            </div>
        </>     
    )
}