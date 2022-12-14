import BoxTop from "./components/Box-top";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import './style.css'

export default function AboutClinic (){

    const iframe = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.0643858828334!2d100.497089114721!3d7.001700594942183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304d29bbd7c26a99%3A0xdb01ab12c69b72bd!2z4Lib4Li44LiT4LiT4LiB4Lix4LiT4LiR4LmM4Liq4Lix4LiV4Lin4LmB4Lie4LiX4Lii4LmM!5e0!3m2!1sth!2sth!4v1665118736354!5m2!1sth!2sth" width="810" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';      
    
    function Iframe(props){
        return (<div dangerouslySetInnerHTML={ {__html:  props.iframe?props.iframe:""}} />);
    }

    return(
        <>
            <BoxTop />

            <div className="sticky-top">
                <Navigation />
            </div>
            
            <div className="container py-5 px-3 bg-light">
                <div className="header-about shadow" >
                    <h4>เกี่ยวกับเรา</h4>
                </div>

                    <div className="text-center pt-5 mes-about ">
                        <p className="service-text">คลินิก ปุณณกัณฑ์สัตวแพทย์ เปิดให้บริการในการรักษาสัตว์ ฉีดวัคซีน กำจัดเห็บหมัด ถ่ายพยาธิ ขูดหินปูน อัลตร้าซาวด์ ตรวจการตั้งท้อง</p>
                        <p className="service-text">จำหน่าย ยาสัตว์ เสื้อผ้าสัตว์เลี้ยงสำหรับสุนัขและแมว อุปกรณ์ของเล่นของใช้ รวมถึงเครื่องมือทางการแพทย์ต่างๆที่เกี่ยวกับสัตว์</p>
                    </div>

                    <div className="text-center mt-5 about ">
                        <div className="row  mb-2 " >
                            <div className="col-12 col-md-12 col-lg-6 box1-contact-about p-2 ">
                                <h4 className=" mt4-5 ">ช่องทางการติดต่อ</h4>
                            </div>

                            <div className="col-12 col-md-12 col-lg-6 box2-contact-about p-2 ">
                                <div className="row ">
                                    <div className="col-5 text-end pt-2  mt-2">
                                        <i className="fa-brands fa-facebook fa-2xl " target="_blank"></i>
                                    </div>

                                    <div className="col-7 text-start mt-2">
                                        <p>ปุณณกัณฑ์สัตวแพทย์</p>
                                    </div>
                                </div>

                                <div className="row ">
                                    <div className="col-5 text-end pt-2 mt-3">
                                        <i className="fa-brands fa-line fa-2xl "></i>
                                    </div>

                                    <div className="col-7 text-start mt-3">
                                        <p>081-622-7293</p>
                                    </div>
                                </div>

                                <div className="row">

                                    <div className="col-5 text-end mt-3">
                                        <i class="fa-solid fa-phone fa-xl "></i>
                                    </div>

                                    <div className="col-7 text-start mt-3">
                                        <p>081-622-7293</p>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="row  my-4 " >                            
                            <div className="col-12 col-md-12 col-lg-6 box3-contact-about shadow p-2 " >
                                <h4>เวลาเปิดทำการ</h4>
                            </div>

                            <div className="col-12 col-md-12 col-lg-6 box4-contact-about shadow p-2">
                                <h6>13.00 - 19.00 น. <b className="box4-about"> หยุดทุกวันเสาร์ </b></h6>
                            </div>
                            
                        </div>
                        
                        <div className="row " >
                            <div className="col-12 col-md-12 col-lg-6 box3-contact-about shadow p-2 " >
                                <h4 className="mt-2"> ที่อยู่ </h4>
                            </div>

                            <div className="col-12 col-md-12 col-lg-6 box4-contact-about shadow p-2">
                                <h6><i class="fa-solid fa-location-dot"></i> 382 ถนน ปุณณกัณฑ์ เทศบาลนครหาดใหญ่ 90110</h6>
                            </div>
                        </div>  
                        
                        <div className="map">
                            <Iframe iframe={iframe}/>
                        </div>
                    </div>
            </div>
            <Footer/>
        </>
    )
}