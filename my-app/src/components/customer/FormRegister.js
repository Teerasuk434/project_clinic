import { useEffect, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import './FormRegister.css'

export default function FormRegister(){

    const [validated, setValidated] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [tel, setTel] = useState("");
    const [gender, setGender] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [curr_username, setCurrentUsername] = useState([]); 
    
    let user_id = 0;

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(
                "http://localhost:8080/api/users",
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        'Content-Type': 'application/json',
                    }
                }
            );
            let json = await response.json();
            setCurrentUsername(json.data);
        }
        fetchData();
    },[])

    const onSave = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if(form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            await doCreateUser();
            await getUserId();
            doCreateAccount();
        }

        setValidated(true);
    }

    const doCreateAccount = async () => {
        const response = await fetch(
            "http://localhost:8080/api/register/account",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cust_fname: firstName,
                    cust_lname: lastName,
                    cust_tel: tel,
                    cust_address: address,
                    cust_gender: gender,
                    cust_birthdate: birthDate,
                    email: email,
                    user_id: user_id
                })
            }
        );
        
        let json = await response.json();
        // if (json.result) {
        //     window.location = "/"
        // }
    }

    const doCreateUser = async () => {
        const response = await fetch(
            "http://localhost:8080/api/register/user",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username:username,
                    password:password,
                    role_id:1
                })
            }
        );
    }

    const getUserId = async () => {
        const response = await fetch(
            "http://localhost:8080/api/register/user",
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json'
                }
            }
        );
        let json = await response.json();
        console.log(json.data);
        console.log(json);
        json.data.map(item => {
            console.log("Username : " + username)
            console.log(item.username)
            if(item.username === username){
                console.log("set id: " + item.user_id)
                user_id = item.user_id
                console.log("userId : " +user_id);
            }
        })
    }

    return (
        <>
            <div className='form-register m-auto p-5'>
                <div className="header-box text-white text-center p-2 fs-5">สมัครสมาชิก</div>
                    <div className="box p-4">
                        <Form noValidate validated={validated} onSubmit={onSave}>
                            <Row className="mb-3">
                                <Form.Group as={Col} sm="12" md="6" className="mb-2" controlId="validateFirstName">
                                    <Form.Label>ชื่อจริง</Form.Label>
                                    <Form.Control
                                        className="f-name"
                                        required
                                        type="text"
                                        value={firstName}
                                        placeholder="กรอกชื่อจริง"
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        กรุณากรอกชื่อจริง
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col}  sm="12" md="6" controlId="validateLastName" className="Form-LName">
                                    <Form.Label>นามสกุล</Form.Label>
                                    <Form.Control 
                                        className="l-name"
                                        required
                                        type="text"
                                        value={lastName}
                                        placeholder="กรอกนามสกุล"
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        กรุณากรอกนามสกุล
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} sm="12" md="6" className="mb-2" controlId="validateBirthDate">
                                    <Form.Label>วันเกิด</Form.Label>
                                    <Form.Control 
                                        required
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        กรุณาระบุวันเกิด
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} sm="12" md="6" controlId="validateGender">
                                    <Form.Label>เพศ</Form.Label>
                                    <Form.Select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        required>
                                        <option label="กรุณาระบุเพศ"></option> 
                                        <option value="ชาย">ชาย</option>
                                        <option value="หญิง">หญิง</option>

                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        กรุณาระบุเพศ
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="mb-3">
                                <Form.Group as={Col} sm="12" md="6" className="mb-2" controlId="validateEmail">
                                    <Form.Label>อีเมล</Form.Label>
                                    <Form.Control 
                                        required
                                        type="email"
                                        value={email}
                                        placeholder="กรอกอีเมล"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        กรุณากรอกอีเมล
                                    </Form.Control.Feedback>
                                </Form.Group>

                                
                                <Form.Group as={Col} sm="12" md="6" controlId="validateTelephone">
                                    <Form.Label>หมายเลขโทรศัพท์</Form.Label>
                                    <Form.Control 
                                        required
                                        type="text"
                                        value={tel}
                                        placeholder="กรอกหมายเลขโทรศัพท์"
                                        onChange={(e) => setTel(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        กรุณากรอกหมายเลขโทรศัพท์
                                    </Form.Control.Feedback>
                                </Form.Group>

                            </Row>
                                    
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="validateAddress">
                                    <Form.Label>ที่อยู่</Form.Label>
                                    <Form.Control 
                                        required
                                        type="text"
                                        value={address}
                                        placeholder="กรอกที่อยู่"
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        กรุณากรอกที่อยู่
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} sm="12" md="6" className="mb-2" controlId="validateUserName">
                                        <Form.Label>ชื่อผู้ใช้</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            value={username}
                                            placeholder="กรอกชื่อผู้ใช้"
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            กรุณากรอกชื่อผู้ใช้งาน
                                        </Form.Control.Feedback>
                                       
                                    </Form.Group>

                                    <Form.Group as={Col} sm="12" md="6" controlId="validatePassword">
                                        <Form.Label>รหัสผ่าน</Form.Label>
                                        <Form.Control 
                                            required
                                            type="password"
                                            value={password}
                                            placeholder="กรอกรหัสผ่าน"
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            กรุณากรอกรหัสผ่าน
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>

                                <Row className="mx-1 mt-4">
                                    <Button variant="success p-2" as="input" type="submit" value="สร้างบัญชี"></Button>
                                </Row>
                        </Form>
                </div>
            </div>
        </>
    )
}