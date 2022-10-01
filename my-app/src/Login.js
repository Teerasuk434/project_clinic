import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Form, Row, Col, Button,Alert} from 'react-bootstrap';
import { useNavigate, Link} from 'react-router-dom';
import './Login.css';
import Navigation from './components/Navigation';
import BoxTop from './components/Box-top';
import Footer from './components/Footer';

var md5 = require("md5");
export default function Login() {
    const [validated, setValidated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [alertMessage, setAlertMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    let navigate = useNavigate();

    const onLogin = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
    
        if(form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            doLogin();
        }
    
        setValidated(true);
    }
    
    const doLogin = async () => {

        const data1 = await getAuthenToken();
        const authToken = data1.data.auth_token;

        const data2 = await getAccessToken(authToken);

        console.log(data2)

        if(data2.result == true || data2.results == true){
            setShowAlert(false);
            localStorage.setItem("access_token", data2.data.access_token);
            localStorage.setItem("user_id", data2.data.account_info.user_id);
            localStorage.setItem("username", username);
            localStorage.setItem("role_id", data2.data.account_info.role_id);
            localStorage.setItem("role_name", data2.data.account_info.role_name);
            navigate("/home", { replace: true });
        }else{
            setAlertMessage(data2.message);
            setShowAlert(true);
        }

        // <Navigate replace to="/home" />
    }

    const getAuthenToken = async () =>{
        const response = await fetch(
            "http://localhost:8080/api/authen_request",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({
                    username: md5(username)
                })
            }
        );
        
        const data = await response.json();
    
        return(data);
    }

    const getAccessToken = async (authToken) => {
        var baseString = username + "&" + md5(password);
        var authenSignature = md5(baseString);

        const response = await fetch(
            "http://localhost:8080/api/access_request",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    auth_signature: authenSignature,
                    auth_token: authToken
                })
            }
        );
        const data = await response.json();
        return data;
    }

    return (
        <>  
            <BoxTop/>
            
            <Navigation/>

            <div className='container content-login p-5' style={{width:"80%"}}>
                <div className="Form-Login m-auto">
                    <div className="header-box text-white text-center p-2 fs-5"> เข้าสู่ระบบ</div>
                    <div className="box p-4">
                        {showAlert == true &&
                            <Alert key="danger" variant="danger">{alertMessage}</Alert>}
                        <Form noValidate validated={validated} onSubmit={onLogin}>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="validateUsername">
                                    <Form.Label>ชื่อผู้ใช้งาน</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        placeholder="Username"
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        กรุณากรอก Username
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="validatePassword">
                                    <Form.Label>รหัสผ่าน</Form.Label>
                                    <Form.Control type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)}/>
                                    <Form.Control.Feedback type="invalid">
                                        กรุณากรอก Password
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className="text-center">
                                <div>
                                    <Button className="btn btn-login me-2" type="submit" >เข้าสู่ระบบ</Button>

                                    <Link to={"/register"} className="btn btn-register d-inline-block">สมัครสมาชิก </Link>

                                </div>
                            </Row>
                        </Form>

                    </div>
                </div>
            </div>  
            <Footer/>
        </>
    );
}

