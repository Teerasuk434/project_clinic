import { Link } from "react-router-dom";
import BoxTop from "./components/Box-top";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import './style.css'

export default function AboutClinic (){

    return(
        <>
            <BoxTop />

            <div className="sticky-top">
                <Navigation />
            </div>
            
            <div className="container py-5 px-3 ">
                <div className="header-about shadow" >
                    <h4>เกี่ยวกับเรา</h4>
                </div>
                
                
                    <h5 className="about-text shadow mt-5 py-5 px-3">
                        คลินิก ปุณณกัณฑ์สัตวแพทย์ เปิดให้บริการในการรักษาสัตว์ ฉีดวัคซีน กำจัดเห็บหมัด ถ่ายพยาธิ
                        ขูดหินปูน อัลตร้าซาวด์ ตรวจการตั้งท้อง จำหน่าย ยาสัตว์ เสื้อผ้าสัตว์เลี้ยงสำหรับสุนัขและแมว 
                        อุปกรณ์ของเล่นของใช้ รวมถึงเครื่องมือทางการแพทย์ต่างๆที่เกี่ยวกับสัตว์</h5>
                
                    <div className="text-center ">
                        <div className="row mt-lg-5" >
                            <div className=" box1-contact-about shadow" >
                                <h4 className=""> ช่องทางการติดต่อ</h4>
                                
                            </div>
                            <div className=" box2-contact-about shadow">
                                    <p className="  ">ปุณณกัณฑ์สัตวแพทย์</p>
                                    <p>081-622-7293</p>
                                    <p>081-622-7293</p>
                            </div>
                        </div>
                        <div className="row pt-3" >
                            <div className="box3-contact-about shadow" >
                                <h4 className=" "> เวลาเปิดทำการ </h4>
                                
                            </div>
                            <div className="box4-contact-about shadow">
                                    13.00 - 19.00 น. 
                                    <h6 className="box4-about">หยุดทุกวันเสาร์</h6>
                                    
                            </div>
                        </div>
                        <div className="row pt-3" >
                            <div className="box3-contact-about shadow" >
                                <h4> ที่อยู่ </h4>
                                
                            </div>
                            <div className="box4-contact-about shadow">
                                    <p>382 ถนน ปุณณกัณฑ์ เทศบาลนครหาดใหญ่ 90110</p>
                            </div>
                        </div>
                </div>
            
                {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.0643858828334!2d100.497089114721!3d7.001700594942183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304d29bbd7c26a99%3A0xdb01ab12c69b72bd!2z4Lib4Li44LiT4LiT4LiB4Lix4LiT4LiR4LmM4Liq4Lix4LiV4Lin4LmB4Lie4LiX4Lii4LmM!5e0!3m2!1sth!2sth!4v1665118736354!5m2!1sth!2sth" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}
            </div>
            <Footer/>
        </>
    )
}