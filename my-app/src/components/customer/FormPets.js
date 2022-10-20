import BoxTop from "../Box-top";
import Navigation from "../Navigation";
import Footer from "../Footer";
import { useEffect, useState } from "react";
import { API_GET, API_POST} from "../../api";
import { Form,Button,Col,Row,InputGroup } from "react-bootstrap";
import { useParams,useNavigate } from "react-router-dom";
import { ConfirmModal } from '../Modal'
import ProfileSidebar from "./ProfileSidebar";

import { SERVER_URL } from "../../app.config"

export default function FormPets(){

    const [pet_id, setPetId] = useState(0);
    const [pet_name,setPetName] = useState("");
    const [pet_type, setPetType] = useState("");
    const [pet_species, setPetSpecies] = useState("");
    const [pet_gender, setPetGender] = useState("");
    const [pet_age_year, setPetAgeYear] = useState(0);
    const [pet_age_month, setPetAgeMonth] = useState(0);
    const [custId, setCustId] = useState(0);

    const [check_age, setCheckAge] = useState(true);
    const [min_age, setMinAge] = useState(0);

    const [imageUrl, setImageUrl] = useState("");

    const [confirmModal, setConfirmModal] = useState(false);
    const [confirmModalTitle, setConfirmModalTitle] = useState("");
    const [confirmModalMessage, setConfirmModalMessage] = useState("");


    let user_id = localStorage.getItem("user_id");
    let pages = 2;

    let params = useParams();
    let navigate = useNavigate();

    const [validated, setValidated] = useState(false);

    useEffect(()=>{

        async function fetchData(user_id){
            let json = await API_GET("customer/" + user_id);
            setCustId(json.data[0].cust_id);

        }
        fetchData(user_id);

    },[])

    useEffect(() => {
        async function fetchData(pet_id) {
            let json = await API_GET("pets/" + pet_id);
            var data = json.data[0];
            setPetId(data.pet_id);
            setPetName(data.pet_name);
            setPetType(data.pet_type);
            setPetSpecies(data.pet_species);
            setPetGender(data.pet_gender);
            setPetAgeYear(data.pet_age_year);
            setPetAgeMonth(data.pet_age_month);
            setImageUrl(data.image)
        }

        if (params.pet_id !== "add") {
            fetchData([params.pet_id]);
        }
    },[params.pet_id])

    useEffect(() =>{
        if(pet_age_year === 0 && pet_age_month === 0){
            setMinAge(1);
            setCheckAge(true);
        }else if(pet_age_year > 0){
            setMinAge(0);
            setCheckAge(false);
        }

        console.log(check_age)
    },[pet_age_year])

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

    const doCreatePet = async (res) => {
        const response = await fetch(
            "http://localhost:8080/api/pets/add",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + localStorage.getItem("access_token")
                },
                body: JSON.stringify({
                    pet_name:pet_name,
                    pet_type:pet_type,
                    pet_species:pet_species,
                    pet_gender:pet_gender,
                    pet_age_year:pet_age_year,
                    pet_age_month:pet_age_month,
                    image:imageUrl,
                    cust_id: custId
                })
            }
        );
        let json = await response.json();
        if(json.result){
            navigate("/account/pets", { replace: true });
        }

    }

    const doUpdatePet = async () => {
        const json = await API_POST("pets/update", {
            pet_id:pet_id,
            pet_name:pet_name,
            pet_type:pet_type,
            pet_species:pet_species,
            pet_gender:pet_gender,
            pet_age_year:pet_age_year,
            pet_age_month:pet_age_month,
            cust_id: custId
        });

        if(json.result){
            navigate("/account/pets", { replace: true });
        }
    }

    const onFileSelected = (e) => {
        if (e.target.files.length > 0) {
            onUploadImage(e.target.files[0])
        }
            
    }

    const onUploadImage = async (selectedFile) => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        let response = await fetch(
            SERVER_URL + "api/pets/upload/" + pet_id,
            {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
                body: formData,
            }
        );
        let json = await response.json();
        console.log(json)
        setImageUrl(json.data);
    }

    const getImageComponent = () => {
        return (
            <div className="container-fluid p-0 mt-2">

                <Form>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>อัพโหลดรูปภาพสัตว์เลี้ยง</Form.Label>
                        <Form.Control
                            type="file"
                            name="file"
                            onChange={onFileSelected} />
                        <Form.Control.Feedback type="invalid">
                            กรุณาอัพโหลดรูปภาพ
                        </Form.Control.Feedback>
                    </Form.Group> 
                </Form>

            </div>
        );
    }

    const onConfirm = async () => {
    
        if(params.pet_id === "add"){
            setConfirmModalTitle("ยืนยันการเพิ่มข้อมูล");
            setConfirmModalMessage("คุณต้องการเพิ่มสัตว์เลี้ยงใช่หรือไม่");
            setConfirmModal(true);
        }else{

            setConfirmModalTitle("ยืนยันการแก้ไขข้อมูล");
            setConfirmModalMessage("คุณต้องการการแก้ไขข้อมูลสัตว์เลี้ยงใช่หรือไม่");
            setConfirmModal(true);
        }
        
    }

    const onClickConfirm = async () => {
        setConfirmModal(false);

        if(params.pet_id === "add"){
            doCreatePet();
            
        }else{
            doUpdatePet();
            
        }
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
                        
                        <div className="col-12 col-md-2 profile-left">
                            <ProfileSidebar pages={pages}/>
                        </div>
                        
                        <div className="col-12 col-md-10 profile-right">
                            <div className="profile-right-content">
                                <div className="profile-right-header p-2 text-center">
                                    {params.pet_id === "add" ?
                                        <h4>เพิ่มข้อมูลสัตว์เลี้ยง</h4>
                                    :
                                        <h4>แก้ไขข้อมูลสัตว์เลี้ยง</h4>
                                    }
                                </div>

                                <div className="profile-details">
                                    <div className="row m-3">
                                        <div className="overflow-auto">
                                            <Form noValidate validated={validated} onSubmit={onSave}>
                                                <Row>
                                                    <Form.Group as={Col} md="6" className="mb-2" controlId="validatePetName">
                                                        <Form.Label>ชื่อสัตว์เลี้ยง</Form.Label>
                                                        <Form.Control
                                                            required
                                                            type="text"
                                                            value={pet_name}
                                                            placeholder="กรอกชื่อสัตว์เลี้ยง"
                                                            onChange={(e) => setPetName(e.target.value)}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            กรุณากรอกชื่อสัตว์เลี้ยง
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                    <Form.Group as={Col} md="6" className="mb-2" controlId="validatePetType">
                                                        <Form.Label>ประเภทสัตว์เลี้ยง</Form.Label>
                                                        <Form.Control 
                                                            required
                                                            type="text"
                                                            value={pet_type}
                                                            placeholder="กรอกประเภทสัตว์เลี้ยง (สุนัข,แมว,...)"
                                                            onChange={(e) => setPetType(e.target.value)}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            กรุณากรอกประเภทสัตว์เลี้ยง
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                </Row>

                                                <Row>
                                                    <Form.Group as={Col} md="6" className="mb-2" controlId="validatePetSpecies">
                                                        <Form.Label>สายพันธุ์</Form.Label>
                                                        <Form.Control 
                                                            required
                                                            type="text"
                                                            value={pet_species}
                                                            placeholder="กรอกสายพันธุ์"
                                                            onChange={(e) => setPetSpecies(e.target.value)}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            กรุณากรอกสายพันธุ์
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                    <Form.Group as={Col} md="6" className="mb-2" controlId="validateGender">
                                                        <Form.Label>เพศ</Form.Label>
                                                        <Form.Select
                                                            value={pet_gender}
                                                            onChange={(e) => setPetGender(e.target.value)}
                                                            required>
                                                            <option label="กรุณาระบุเพศ"></option> 
                                                            <option value="ผู้">ผู้</option>
                                                            <option value="เมีย">เมีย</option>
                                                        </Form.Select>
                                                        <Form.Control.Feedback type="invalid">
                                                            กรุณาระบุเพศสัตว์เลี้ยง
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Row>
                                                
                                                <div className="row">
                                                    <div className="col-md-6 col-12">
                                                        <div className="d-flex flex-row mt-3">
                                                            <Row>
                                                                <Col xs="12" md="6" className="mb-3">
                                                                    <InputGroup>
                                                                        <Form.Label className="m-auto me-2">อายุ (ปี)</Form.Label>
                                                                        <Form.Control 
                                                                                type="number"
                                                                                value={pet_age_year}
                                                                                min="0"
                                                                                max="20"
                                                                                onChange={(e) => setPetAgeYear(e.target.value)}/>
                                                                        <InputGroup.Text>ปี</InputGroup.Text>
                                                                        <Form.Control.Feedback type="invalid">
                                                                            กรุณาระบุอายุสัตว์
                                                                        </Form.Control.Feedback>
                                                                    </InputGroup>
                                                                </Col>
                                                                
                                                                <Col xs="12" md="6">
                                                                    <InputGroup>
                                                                    <Form.Label className="m-auto me-2">อายุ (เดือน)</Form.Label>
                                                                        <Form.Control 
                                                                                required={check_age}
                                                                                type="number"
                                                                                value={pet_age_month}
                                                                                min={min_age}
                                                                                max="12"
                                                                                onChange={(e) => setPetAgeMonth(e.target.value)}/>
                                                                        <InputGroup.Text>เดือน</InputGroup.Text>
                                                                        <Form.Control.Feedback type="invalid">
                                                                            กรุณาระบุอายุสัตว์
                                                                        </Form.Control.Feedback>
                                                                    </InputGroup>
                                                                </Col>

                                                                
                                                            </Row>

                                                            
                                                        </div>

                                                        {
                                                            getImageComponent()
                                                        }

                                                    </div>

                                                    <div className="col-6"> 
                                                        {imageUrl !== "" && 
                                                            <div className="m-auto text-center mb-4 mt-2 shadow-sm p-2">
                                                                <img src={`${SERVER_URL}images/pets/${imageUrl}`} width={200} alt="Upload status"/>

                                                            </div>                        
                                                        }
                                                    </div>

                                                    <Row className="border-top pt-3">
                                                        <div className="col-12 col-md-2 mx-auto">
                                                            <Button id="button" variant="success" size="sm" as="input" type="submit" value="บันทึกข้อมูล" />
                                                        </div>
                                                    </Row>

                                                </div>


                                            </Form>

                                            
                                        </div>
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