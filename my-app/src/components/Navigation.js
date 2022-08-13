import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './Navigation.css'

export default function Navigation(){


    return(
        <div>
            <div className='Box-top text-end'>
                <div className='Time-open d-inline-block'>
                    <p>เวลาเปิดทำการ : ทุกวัน เวลา 13.00 น. - 19.00 น. หยุดวันเสาร์</p>
                </div>

                <div className='Contact d-inline-block'>
                     <p><i class="fa-solid fa-phone me-2"></i>081-622-7293</p>
                </div>
            </div>
            <div className='Navbar d-flex justify-content-between p-2'>
                <div className="Brand ms-5">
                    <img src={`http://localhost:8080/images/Logo2.png`}/>
                </div>
                <div className="Menu-list me-3">
                    <Navbar bg="light" variant="light">    
                        <Nav className="me-auto">
                            <Nav.Link href="#home">หน้าแรก</Nav.Link>
                            <Nav.Link href="#about">เกี่ยวกับเรา</Nav.Link>
                            <Nav.Link href="#services">บริการของเรา</Nav.Link>
                            <Nav.Link href="#appointment">นัดหมาย</Nav.Link>
                            <Nav.Link className="Btn-login" href="login"><i class="fa-solid fa-right-to-bracket me-2"></i>เข้าสู่ระบบ</Nav.Link>
                        </Nav>
                    </Navbar>
                </div>
            </div>
        </div>
    )
}

