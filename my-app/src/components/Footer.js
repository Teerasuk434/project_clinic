import './Footer.css'

export default function Footer(){
    return(
        <div className="Footer">
           <div className='container p-3'>
                <div className='row'>

                    <div className="col-4 left">
                        <div className="boxs">
                            <h1 className='Title'>คลินิกปุณกันฑ์สัตวแพทย์</h1>
                            <div className='Text'>
                                <p>คลินิกรักษาสัตว์หาดใหญ่</p>
                                <p>เวลาเปิดทำการ 13.00 - 19.00 น. หยุดทุกวันเสาร์</p>
                                <p>382 ถนน ปุณณกัณฑ์ เทศบาลนครหาดใหญ่ 90110</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-4 center">
                        <div className='boxs'>
                            <h1 className='Title'>ช่องทางการติดต่อ</h1>
                            <div className='Text'>
                                <p><i class="fa-brands fa-square-facebook me-2 fa-xl"></i>ปุณณกัณฑ์สัตวแพทย์</p>
                                <p><i class="fa-brands fa-line me-2 fa-xl"></i>081-622-7293</p>
                                <p><i class="fa-solid fa-phone me-2 fa-lg"></i>081-622-7293</p>
                            </div>
                        </div>
                    </div>  

                    <div className="col-4 right">
                        <div className="boxs">
                
                        </div>
                    </div>             
                </div>
           </div>
        </div>
    )
}