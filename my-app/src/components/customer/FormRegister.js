import { useEffect, useState } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { ConfirmModal,MessageModal,SuccessRegisterModal } from '../Modal';
import { useNavigate } from 'react-router-dom';
import { API_POST } from '../../api';


export default function FormRegister(){

    let navigate = useNavigate();

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
    const [type_password, setTypePassword] = useState(false);

    const [confirmModal, setConfirmModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    
    let user_id = 0;

    const onSave = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if(form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            onConfirm();
        }

        setValidated(true);
    }

    const doCreateAccount = async () => {

        let json = await API_POST("register/account",{
            cust_fname: firstName,
            cust_lname: lastName,
            cust_tel: tel,
            cust_address: address,
            cust_gender: gender,
            cust_birthdate: birthDate,
            email: email,
            username:username,
            password:password,
            role_id:1
        })
        
        if (json.result) {
            setModalTitle("สมัครสมาชิกสำเร็จ")
            setModalMessage("คุณได้สมัครสมาชิกสำเร็จแล้ว สามารถเข้าสู่ระบบได้ทันที")
            setShowSuccessModal(true);

            
        }else {
            setModalTitle("สมัครสมาชิกไม่สำเร็จ");
            setModalMessage(json.message);
            setShowModal(true);
        }
    }

    const onConfirm = async () => {

        setModalTitle("ยืนยันการสมัครสมาชิก");
        setModalMessage("คุณต้องการสมัครสมาชิกใหม่ใช่หรือไม่");
        setConfirmModal(true);
    
    }

    const onClickConfirm = async () => {
        setConfirmModal(false);

        doCreateAccount();
    }

    const onClose = () => {
        setConfirmModal(false);
        setShowModal(false);
    }

    const onCloseSuccess = () => {
        setShowSuccessModal(false);
        navigate("/",{replace : false});

    }

    const onShowPassword = () => {
        setTypePassword(!type_password);
    }

    return (
        <>
            <div className='form-register m-auto shadow bg-light'>
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
                                        <InputGroup>
                                        <Form.Control 
                                            required
                                            type={type_password ? "text" : "password"}
                                            value={password}
                                            placeholder="กรอกรหัสผ่าน"
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <Button variant="secondary" onClick={onShowPassword}><i className={type_password ? "fa-regular fa-eye" : "fa-regular fa-eye-slash"}></i></Button>
                                        </InputGroup>
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

            <MessageModal
                show={showModal}
                title={modalTitle}
                message={modalMessage}
                onClose={onClose}
            />

            <ConfirmModal 
                show={confirmModal}
                title={modalTitle}
                message={modalMessage}
                onConfirm={onClickConfirm}
                onClose={onClose}
            />

            <SuccessRegisterModal 
                show={showSuccessModal}
                title={modalTitle}
                message={modalMessage}
                onClose={onCloseSuccess}
            />
        </>
    )
}