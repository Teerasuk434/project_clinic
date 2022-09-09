import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import './Navigation.css'

export default function Navigation(){

    let role_id = localStorage.getItem("role_id");
    let username = localStorage.getItem("username");

    const clearData = () => {
        localStorage.clear();
        role_id = 0;
    }

    return(
            <div className='Navbar-container'>
                <Navbar className="Navbar shadow-sm" bg="light" variant="light">    
                    <div className="ms-5">
                        <Navbar.Brand href="/"><img src={`http://localhost:8080/images/Logo2.png`} alt=""/></Navbar.Brand>
                    </div>

                    <div className="me-4">
                        <Nav>
                            <Nav.Link className="me-2" href="/">หน้าแรก</Nav.Link>
                            <Nav.Link className="me-2" href="#about">เกี่ยวกับเรา</Nav.Link>
                            <Nav.Link className="me-2" href="#services">บริการของเรา</Nav.Link>
                            <Nav.Link className="me-2" href="/appointment">นัดหมาย</Nav.Link>
                            {role_id != 1 
                                ?
                                <Nav.Link className="Btn-login" href="login">
                                    <i className="fa-solid fa-right-to-bracket me-2"></i>เข้าสู่ระบบ</Nav.Link> 
                                :

                                <NavDropdown align="end" title={<><i className="fa-solid fa-user me-2"></i>{username}</>} id="basic-nav-dropdown">
                                    <NavDropdown.Item href="account/profile">ข้อมูลบัญชี</NavDropdown.Item>
                                    <NavDropdown.Item href="/account/pets">สัตว์เลี้ยง</NavDropdown.Item>
                                    <NavDropdown.Item href="/account/appointments">การนัดหมาย</NavDropdown.Item>
                                    <NavDropdown.Item href="">ประวัติการนัดหมาย</NavDropdown.Item>
                                    <NavDropdown.Item href="">ตั้งค่ารหัสผ่าน</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="/" onClick={clearData}>
                                        ออกจากระบบ
                                    </NavDropdown.Item>
                                </NavDropdown>
                            }
                                
                        </Nav>
                    </div>
                        
                </Navbar>
            </div>
    )
}

