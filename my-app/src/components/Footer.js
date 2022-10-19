import { FacebookProvider, Page } from 'react-facebook';

export default function Footer(){    

    return(
        <div className="Footer">
           <div className='container p-3'>
                <div className='row mx-5'>
                    
                    <div className="col-1"></div>

                    <div className="col-12 col-lg-4 left">
                        <div className="boxs">
                            <h1 className='Title'>คลินิกปุณกันฑ์สัตวแพทย์</h1>
                            <div className='Text'>
                                <p>คลินิกรักษาสัตว์หาดใหญ่</p>
                                <p>เวลาเปิดทำการ 13.00 - 19.00 น. หยุดทุกวันเสาร์</p>
                                <p>382 ถนน ปุณณกัณฑ์ เทศบาลนครหาดใหญ่ 90110</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-2 center">
                        <div className="boxs">
                            <h1 className='Title'>ช่องทางการติดต่อ</h1>
                            <div className='Text'>
                                <p><i className="fa-solid fa-phone me-2 fa-lg"></i>081-622-7293</p>
                                <p><i className="fa-brands fa-line me-2 fa-xl"></i>081-622-7293</p>
                                <p><i className="fa-brands fa-square-facebook me-2 fa-xl"></i>ปุณณกัณฑ์สัตวแพทย์</p>
                            </div>
                        </div>
                    </div>  

                    <div className="col-12 col-lg-3 right">
                        
                        <div className="boxs">

                            <FacebookProvider appId="517243269878543">
                                <Page href="https://www.facebook.com/poonnakanpetclinic"/>
                            </FacebookProvider>   
                        </div>

                    </div>  

                    <div className="col-2">

                    </div>

                </div>
           </div>
        </div>
    )
}