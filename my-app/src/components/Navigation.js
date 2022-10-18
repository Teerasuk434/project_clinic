import { Nav, NavDropdown, Navbar, Container } from 'react-bootstrap';
import { GoogleLogout } from 'react-google-login';
import { useNavigate } from 'react-router-dom';


export default function Navigation(){

    let navigate = useNavigate();
    let role_id = localStorage.getItem("role_id");
    let username = localStorage.getItem("username");
    let isLoginGoogle = localStorage.getItem("LoginGoogle");
    const clientId = "555154502485-1ffpk8f299sf2blje6spbrnntkl9jhhs.apps.googleusercontent.com";


    const clearData = () => {
        localStorage.clear();
        localStorage.setItem("role_id",0);
    }

    const logOut = () => {
        localStorage.clear();
        navigate("/login",{replace:false})
    }

    return(
        <>
            <Navbar collapseOnSelect expand="lg" bg="light" variant="light" className="border-bottom border-dark border-opacity-25">
                <Container>
                    <Navbar.Brand href="/" className="align-middle ps-2">
                        <img alt="Logo" src={`http://localhost:8080/images/Logo2.png`} height="50" className="me-2" />
                        </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="justify-content-end flex-grow-1 pe-3">
                        <Nav.Link href="/">หน้าแรก</Nav.Link>
                        <Nav.Link href="/about">เกี่ยวกับเรา</Nav.Link>
                        <Nav.Link href="/service">บริการของเรา</Nav.Link>
                        <Nav.Link href="/appointment">นัดหมาย</Nav.Link>
                        {role_id != 1 
                                ?
                                <Nav.Link className="Btn-login" href="login">
                                    <i className="fa-solid fa-right-to-bracket me-2"></i>เข้าสู่ระบบ</Nav.Link> 
                                :

                                <NavDropdown align="end" title={<><i className="fa-solid fa-user me-2"></i>{username}</>} id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/account/profile">ข้อมูลบัญชี</NavDropdown.Item>
                                    <NavDropdown.Item href="/account/pets">สัตว์เลี้ยง</NavDropdown.Item>
                                    <NavDropdown.Item href="/account/appointments">การนัดหมาย</NavDropdown.Item>
                                    <NavDropdown.Item href="/account/history-appoint">ประวัติการนัดหมาย</NavDropdown.Item>
                                    {!isLoginGoogle &&
                                        <NavDropdown.Item href="/account/reset-password">ตั้งค่ารหัสผ่าน</NavDropdown.Item>
                                    }
                                    <NavDropdown.Divider />
                                    {isLoginGoogle ?
                                        <GoogleLogout 
                                            clientId={clientId} 
                                            buttonText="ออกจากระบบ"
                                            onLogoutSuccess={logOut}
                                        />  
                                    :
                                    <NavDropdown.Item href="/" onClick={clearData}>
                                        ออกจากระบบ
                                    </NavDropdown.Item>
                                }
                                    
                                </NavDropdown>
                            }
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        
            {/* <div className='Navbar-container'>
                <Navbar className="Navbar shadow-sm" bg="light" variant="light">    
                    <div className="ms-5">
                        <Navbar.Brand href="/"><img src={`http://localhost:8080/images/Logo2.png`} alt=""/></Navbar.Brand>
                    </div>

                    <div className="me-4">
                        <Nav>
                            <Nav.Link className="me-2" href="/">หน้าแรก</Nav.Link>
                            <Nav.Link className="me-2" href="/about">เกี่ยวกับเรา</Nav.Link>
                            <Nav.Link className="me-2" href="/service">บริการของเรา</Nav.Link>
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
                                    <NavDropdown.Item href="/account/history-appoint">ประวัติการนัดหมาย</NavDropdown.Item>
                                    <NavDropdown.Item href="/account/reset-password">ตั้งค่ารหัสผ่าน</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="/" onClick={clearData}>
                                        ออกจากระบบ
                                    </NavDropdown.Item>
                                </NavDropdown>
                            }
                                
                        </Nav>
                    </div>
                        
                </Navbar>
            </div> */}

        </>
    )
}

