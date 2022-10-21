import BoxTop from "../Box-top"
import Navigation from "../Navigation"
import Footer from "../Footer"
import { useEffect, useState } from "react"
import { API_GET, API_POST} from "../../api"
import { Form,Button,Col,Row } from "react-bootstrap"
import Moment from 'moment';
import ProfileSidebar from "./ProfileSidebar"
import { useNavigate } from "react-router-dom"
import { ConfirmModal } from "../Modal"


export default function EditProfile(){

    let navigate = useNavigate();

    const [custId, setCustId] = useState(0);
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [tel, setTel] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [email, setEmail] = useState("");
    
    const [validated, setValidated] = useState(false);

    let user_id = localStorage.getItem("user_id");
    let pages = 1;

    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalMessage, setConfirmModalMessage] = useState("");

    useEffect(()=>{

        async function fetchData(user_id){
            let json = await API_GET("customer/" + user_id);

            setCustId(json.data[0].cust_id);
            setFirstName(json.data[0].cust_fname);
            setLastName(json.data[0].cust_lname);
            setTel(json.data[0].cust_tel);
            setAddress(json.data[0].cust_address);
            setGender(json.data[0].cust_gender);
            setEmail(json.data[0].email);

            var dateString = json.data[0].cust_birthdate;
            var dateObj = new Date(dateString);
            var momentObj = Moment(dateObj);
            var momentString = momentObj.format('YYYY-MM-DD');
            setBirthDate(momentString);
            
        }
        fetchData(user_id);

    },[])

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

    const doUpdateProfile = async () => {
        const json = await API_POST("account/editprofile", {
            firstname: firstname,
            lastname: lastname,
            tel: tel,
            address: address,
            gender: gender,
            birthDate: birthDate,
            email: email,
            custId: custId
        });

        if (json.result) {
            navigate("/account/profile",{replace: false});
        }
    }

    const onConfirm = async () => {
    
        setConfirmModalTitle("ยืนยันการแก้ไขข้อมูลบัญชี");
        setConfirmModalMessage("คุณต้องการไขข้อมูลบัญชีใช่หรือไม่");
        setConfirmModal(true);
        
    }

    const onClickConfirm = async () => {
        setConfirmModal(false);
        doUpdateProfile();
    }

    const onClose = () => {
        setConfirmModal(false);
    }


    return(
        <>

            <BoxTop/>
                <div className="sticky-top">
                    <Navigation />
                </div>

                <div className="container profile">
                    <div className="row">
                        
                        <div className="col-12 col-md-12 col-lg-2 profile-left">
                            <ProfileSidebar pages={pages}/>
                        </div>
                        
                        <div className="col-12 col-md-12 col-lg-10 profile-right">
                            <div className="profile-right-content">
                                <div className="profile-right-header p-2 text-center">
                                    <h4>แก้ไขข้อมูลบัญชี</h4>
                                </div>

                                <div className="profile-details">
                                    <div className="profile-content pt-3 px-5">
                                        <Form noValidate validated={validated} onSubmit={onSave}>
                                            <Row className="mb-3">
                                                <Form.Group as={Col} sm="12" md="6" className="mb-2" controlId="validateFirstName">
                                                    <Form.Label>ชื่อจริง</Form.Label>
                                                    <Form.Control
                                                        className="f-name"
                                                        required
                                                        type="text"
                                                        value={firstname}
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
                                                        value={lastname}
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

                                            <Row className="mb-3 border-top pt-2">
                                                <div className="col-12 col-md-12 col-lg-3 mx-auto">
                                                    <Button id="button" variant="success" as="input" type="submit" size="sm" value="บันทึกข้อมูล" />
                                                </div>
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


        </>

    )
}