import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Form, Row, Col, Button, Alert, InputGroup} from 'react-bootstrap';
import { useNavigate, Link} from 'react-router-dom';
import Navigation from './components/Navigation';
import BoxTop from './components/Box-top';
import Footer from './components/Footer';
import { API_POST,API_GET } from './api';

var md5 = require("md5");
export default function Login() {
    const [validated, setValidated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [type_password, setTypePassword] = useState(false);


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

            if(data2.data.account_info.role_id == 1){
                let json = await API_GET("customer/" +data2.data.account_info.user_id);
                
                if(json.result){
                    localStorage.setItem("cust_firstname", json.data[0].cust_fname);
                    localStorage.setItem("cust_lastname", json.data[0].cust_lname);
                }
            }
            navigate("/home", { replace: true });
        }else{
            setAlertMessage(data2.message);
            setShowAlert(true);
        }

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

    const onShowPassword = () => {
        setTypePassword(!type_password);
    }

    return (
        <>  
            <BoxTop/>
            
            <Navigation/>

            <div className='container content-login'>
                <div className="content-login pt-5">
                    <div className="Form-Login mx-auto">
                        <div className="header-box text-white text-center p-2 fs-5"> เข้าสู่ระบบ</div>
                        <div className="py-4 px-5">
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
                                        <InputGroup>
                                            <Form.Control 
                                                required
                                                type={type_password ? "text" : "password"}
                                                value={password}
                                                placeholder="กรอกรหัสผ่าน"
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <Button variant="light" className="border" size="sm" onClick={onShowPassword}><i className={type_password ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"}></i></Button>
                                            </InputGroup>
                                        <Form.Control.Feedback type="invalid">
                                            กรุณากรอก Password
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="text-center mx-1 my-4">
                                    <button className="btn btn-login mb-3 rounded-5" type="submit" >เข้าสู่ระบบ</button>
                                    <Link to={"/register"} className="btn btn-register rounded-5">สมัครสมาชิก </Link>
                                </Row>
                            </Form>

                        </div>
                    </div>

                </div>

            </div>  

            <Footer/>
        </>
    );
}

