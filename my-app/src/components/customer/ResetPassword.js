import BoxTop from "../Box-top"
import Navigation from "../Navigation"
import Footer from "../Footer"
import { useState } from "react"
import { API_POST} from "../../api"
import { useNavigate } from "react-router-dom"
import { Form,Row,Button,Col,Alert } from "react-bootstrap"
import { ConfirmModal,SuccessModal } from "../Modal"
import ProfileSidebar from "./ProfileSidebar"

export default function ResetPassword (){

    let pages = 5;

    const [curr_pwd, setCurrentPwd] = useState("");
    const [new_pwd, setNewPwd] = useState("");
    const [confirm_new_pwd, setConfirmNewPwd] = useState("");
    const [validated, setValidated] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertColor, setAlertColor] = useState("");

    let user_id = localStorage.getItem("user_id");

    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalMessage, setConfirmModalMessage] = useState("");

    const [successModal, setSuccessModal] = useState(false);
    const [successModalTitle, setSuccessModalTitle] = useState("");
    const [successModalMessage, setSuccessModalMessage] = useState("");

    let navigate = useNavigate();

    const onSave = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            onConfirm();
        }
        setValidated(true);
    }

    const checkPassword = async () =>{
        setConfirmModal(false);
        let json = await API_POST("account/checkpassword",{
            user_id:user_id,
            password:curr_pwd
        })
        if(json.data){
            checkNewPassword();
        }else{
            setShowAlert(true);
            setAlertColor("danger");
            setAlertMessage("รหัสผ่านเดิมไม่ถูกต้อง โปรดลองใหม่");
            
            setValidated(false);
        }

    }

    const checkNewPassword = async () => {
        if(new_pwd.length >= 6 && confirm_new_pwd.length >= 6){
            if(new_pwd === confirm_new_pwd && new_pwd !== curr_pwd){
                updatePassword();
            }else if (new_pwd !== confirm_new_pwd){
                setShowAlert(true);
                setAlertColor("danger");
                setAlertMessage("รหัสผ่านใหม่ และยืนยันรหัสผ่านใหม่ไม่ตรงกัน โปรดลองใหม่") 
            }else if (new_pwd === curr_pwd){
                setShowAlert(true);
                setAlertColor("danger");
                setAlertMessage("รหัสผ่านใหม่ต้องไม่ตรงกับรหัสผ่านเก่า โปรดลองใหม่") 
            }
        }else{
            setShowAlert(true);
            setAlertColor("danger");
            setAlertMessage("รหัสผ่านใหม่ต้องมีความยาว 6 ตัวอักษรขึ้นไป โปรดลองใหม่")
        }
    }

    const updatePassword = async () => {
        let json = await API_POST("account/reset-password",{
            password:new_pwd,
            user_id:user_id
        })

        if(json.result){
            setSuccessModal(true);
            setSuccessModalTitle("เปลี่ยนรหัสผ่าน");
            setSuccessModalMessage("เปลี่ยนรหัสผ่านสำเร็จแล้ว")

        }
    }

    const onConfirm = async () => {
        setConfirmModalTitle("ยืนยันการเปลี่ยนรหัสผ่าน");
        setConfirmModalMessage("คุณต้องการเปลี่ยนรหัสผ่านใหม่ใช่หรือไม่");
        setConfirmModal(true);
        
    }

    const onClickConfirm = async () => {
        setShowAlert(false);
        checkPassword();
    }

    const onClose = () => {
        setConfirmModal(false);
    }

    const onCloseSuccess = () => {
        setSuccessModal(false);
        navigate("/account/profile", {replace: false });

    }

    return (
        <>
            <BoxTop/>
                <div className="sticky-top">
                    <Navigation />
                </div>

                <div className="container profile">
                    <div className="row">
                        
                        <div className="col-12 col-md-2 profile-left">
                            <ProfileSidebar pages={pages}/> 
                        </div>
                        
                        <div className="col-12 col-md-10 profile-right">
                            <div className="profile-right-content">
                                <div className="profile-right-header p-2 text-center">
                                    <h4>ตั้งค่ารหัสผ่าน</h4>
                                </div>

                                <div className="profile-details">
                                    <div className="mx-5 mt-5 mb-4">

                                    {showAlert === true && 
                                        <Alert variant={alertColor}>{alertMessage}</Alert>
                                    }

                                    <Form noValidate validated={validated} onSubmit={onSave}>
                                        <Form.Group as={Col} md="6" className="mb-2" controlId="validateCurrPwd">
                                            <Form.Label><b>รหัสผ่านเดิม</b></Form.Label>
                                            <Form.Control
                                                required
                                                type="password"
                                                value={curr_pwd}
                                                placeholder="กรอกรหัสผ่านเดิม"
                                                onChange={(e) => setCurrentPwd(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณากรอกรหัสผ่านเดิม
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group as={Col} md="6" className="mb-2" controlId="validateNewPwd">
                                            <Form.Label><b>รหัสผ่านใหม่</b></Form.Label>
                                            <Form.Control 
                                                required
                                                type="password"
                                                value={new_pwd}
                                                placeholder="กรอกรหัสผ่านใหม่"
                                                onChange={(e) => setNewPwd(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณากรอกรหัสผ่านใหม่
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group as={Col} md="6" controlId="validateConfirmNewPwd">
                                            <Form.Label><b>ยืนยันรหัสผ่านใหม่</b></Form.Label>
                                            <Form.Control 
                                                required
                                                type="password"
                                                value={confirm_new_pwd}
                                                placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                                                onChange={(e) => setConfirmNewPwd(e.target.value)}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                กรุณากรอกรหัสผ่านใหม่อีกครั้ง
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Row className="mx-1 mt-4">
                                            <Col >
                                                <Button variant="success" as="input" type="submit" value="บันทึกข้อมูล"></Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                        
                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>
                </div>

            <Footer/>

            <ConfirmModal 
                show={confirmModal}
                title={confirmModalTitle}
                message={confirmModalMessage}
                onConfirm={onClickConfirm}
                onClose={onClose}
            />

            
            <SuccessModal
                show={successModal}
                title={successModalTitle}
                message={successModalMessage}
                onClose={onCloseSuccess}
            />
        </>
    )
}