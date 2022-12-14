import { useEffect, useState } from "react";
import {Button, Form , Row ,Col} from "react-bootstrap";
import { useNavigate, useParams , Link } from "react-router-dom";
import { API_GET,API_POST } from "../../api";
import Top from "../Top";
import { MessageModal ,  ConfirmModal } from "../Modal";

import Sidebar from "../Sidebar";

export default function FormEmployee(){

    let params = useParams();
    let navigate = useNavigate();
    let pages = 3;

    const [validated,setValidated] = useState(false);
    const [emp_id,setEmpId] = useState(0);
    const [emp_fname,setEmpFname] = useState("");
    const [emp_lname,setEmpLname] = useState("");
    const [emp_address,setEmpAdress] = useState("");
    const [emp_tel,setEmpTel] = useState("");
    const [emp_salary,setEmpSalary] = useState(0);
    const [emp_position_id,setEmpPositionId] = useState(0);
    const [emp_type,setEmpType] = useState([]);
    const [user_id,setUserId] = useState(0);


     // confirmModal
     const [confirmModal, setConfirmModal] = useState(false);
     const [confirmModalTitle, setConfirmModalTitle] = useState("");
     const [confirmModalMessage, setConfirmModalMessage] = useState("");
 
     const [showModal, setShowModal] = useState(false);
     const [modalTitle, setModalTitle] = useState("");
     const [modalMessage, setModalMessage] = useState("");
    

    useEffect(() =>{
        async function fetchData(emp_id){
            let json = await API_GET("emp/"+emp_id);
            let data = json.data[0];
            setEmpId(data.emp_id);
            setEmpFname(data.emp_fname);
            setEmpLname(data.emp_lname);
            setEmpAdress(data.emp_address);
            setEmpTel(data.emp_tel);
            setEmpSalary(data.emp_salary);
            setEmpPositionId(data.emp_position_id);
            setUserId(data.user_id);


        }

        if(params.emp_id != "add"){
            fetchData([params.emp_id]);
        }
    },[params.emp_id]);

    useEffect(() => {
        async function fetchData() {
            let json = await API_GET("emp_types");
            setEmpType(json.data);
        }
        fetchData();
    },[]);

    const onSave = async(event) =>{
        const form = event.currentTarget;
        event.preventDefault();

        if(form.checkValidity()=== false){
            event.stopPropagation();
        }else{
            onConfirm();
        }
        setValidated(true);
    }

    const doCreateEmployee = async() => {
        console.log(user_id)

        let json = await API_POST("emp/add",{
            emp_fname: emp_fname,
            emp_lname: emp_lname,
            emp_address: emp_address,
            emp_tel: emp_tel,
            emp_salary: emp_salary,
            emp_position_id: emp_position_id,
            user_id: user_id

        })
        if(json.result) {
            navigate("/emp", { replace: false });
        } else {
            setModalTitle("??????????????????????????????????????????????????????????????????????????????????????????");
            setModalMessage(json.message);
            setShowModal(true);
        }
    }
    
    const doUpdateEmployee = async() => {
        let json = await API_POST("emp/update",{
            
            emp_fname: emp_fname,
            emp_lname: emp_lname,
            emp_address: emp_address,
            emp_tel: emp_tel,
            emp_salary: emp_salary,
            emp_position_id: emp_position_id,
            emp_id: emp_id

        })
        if(json.result) {
            navigate("/emp", { replace: false });
        } else {
            setModalTitle("??????????????????????????????????????????????????????????????????????????????????????????");
            setModalMessage(json.message);
            setShowModal(true);
        }
    }

    const onConfirm = async (data) => {
        if(params.emp_id == "add"){
            setConfirmModalTitle("????????????????????????????????????????????????????????????");
            setConfirmModalMessage("???????????????????????????????????????????????????????????????????????????????????????????????????");
            setConfirmModal(true);
        }else{

            setConfirmModalTitle("????????????????????????????????????????????????????????????");
            setConfirmModalMessage("???????????????????????????????????????????????????????????????????????????????????????????????????");
            setConfirmModal(true);
        }
    }

    const onConfirmUpdate = async () => {
        setConfirmModal(false);

        if(params.emp_id == "add"){
            doCreateEmployee();
        }else{
            doUpdateEmployee();

        }
    }
    const onCancelUpdate = () => {
        setConfirmModal(false);

    }

    const onClose = () => {
        setConfirmModal(false);
        setShowModal(false);
    }
    return(
        <>
            <div className="container-fluid">
                <div className="row">

            
                    <div className="row">
                        <div className="p-0 col-12 col-lg-2 bg-primary">
                            <div className="sidebar">
                                <Sidebar pages={pages}/>
                            </div>
                        </div>

                            <div className="p-0 m-0 col-12 col-lg-10">
                            <Top/> 
                                <div className="content p-5">
                                    <div className="container m-auto">
                                
                                        <div className='col-8 bg-white rounded shadow p-3 m-auto'>
                                            {params.emp_id == "add" ?
                                                <h4 className="text-center mt-3">??????????????????????????????????????????????????????</h4>
                                            
                                            :
                                                <h4 className="text-center mt-3">??????????????????????????????????????????????????????</h4>

                                            }
                                            
                                                <div className="container mt-2">
                                                    <Form noValidate validated={validated} onSubmit={onSave}>
                                                    <div className="row mt-3 mb-2">
                                                        <Form.Group as={Col} controlId="validateFirstName" >
                                                            <Form.Label>????????????</Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                value={emp_fname}
                                                                placeholder="????????????"
                                                                onChange={(e) => setEmpFname(e.target.value)}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                ??????????????????????????? ?????????????????????????????????
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </div>

                                                    <div className="row mb-2">
                                                        <Form.Group as={Col} controlId="validateLastName" >
                                                            <Form.Label>?????????????????????</Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                value={emp_lname}
                                                                placeholder="?????????????????????"
                                                                onChange={(e) => setEmpLname(e.target.value)}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                ??????????????????????????? ??????????????????????????????????????????
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </div>
                                                    <div className="row mb-2">
                                                        <Form.Group as={Col} controlId="validatePosition" >
                                                            <Form.Label>?????????????????????</Form.Label>
                                                            <Form.Select
                                                                value={emp_position_id}
                                                                onChange={(e) => setEmpPositionId(e.target.value)}
                                                                required>
                                                                <option label="?????????????????????"></option>
                                                                {
                                                                    emp_type.map(item => (
                                                                        <option key={item.emp_position_id} value={item.emp_position_id}>
                                                                        {item.emp_position_name}</option>
                                                                    ))
                                                                }
                                                            </Form.Select>
                                                            <Form.Control.Feedback type="invalid">
                                                                ?????????????????????????????? ??????????????????????????????????????????
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </div>
                                                    <div className="row mb-2">
                                                        <Form.Group as={Col} controlId="validateAddress" >
                                                            <Form.Label>?????????????????????</Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                value={emp_address}
                                                                placeholder="?????????????????????"
                                                                onChange={(e) => setEmpAdress(e.target.value)}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                ??????????????????????????? ?????????????????????
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </div>
                                                    <div className="row mb-2">
                                                        <Form.Group as={Col} controlId="validateTel" >
                                                            <Form.Label>????????????????????????</Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="text"
                                                                min={0}
                                                                value={emp_tel}
                                                                placeholder="????????????????????????"
                                                                onChange={(e) => setEmpTel(e.target.value)}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                ??????????????????????????? ????????????????????????
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </div>
                                                    <div className="row mb-2">
                                                        <Form.Group as={Col} controlId="validateSalary" >
                                                            <Form.Label>???????????????????????????</Form.Label>
                                                            <Form.Control
                                                                required
                                                                type="number"
                                                                min={0}
                                                                value={emp_salary}
                                                                placeholder="???????????????????????????"
                                                                onChange={(e) => setEmpSalary(e.target.value)}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                ??????????????????????????? ???????????????????????????
                                                            </Form.Control.Feedback>
                                                        </Form.Group> 
                                                    </div>
                                                    
                                                        <Row className="mb-5">
                                                            <div className="text-end">
                                                                <Button className="btn btn-success mb-3 mt-3" as="input" type="submit" value="??????????????????" />
                                                                <Link to="/emp" className="btn btn-danger ms-2">??????????????????</Link>
                                                            </div>
                                                        </Row>
                                                    </Form>

                                                <ConfirmModal
                                                    show={confirmModal}
                                                    title={confirmModalTitle}
                                                    message={confirmModalMessage}
                                                    onConfirm={onConfirmUpdate}
                                                    onClose={onCancelUpdate}/>
                                            

                                                <MessageModal
                                                    show={showModal}
                                                    title={modalTitle}
                                                    message={modalMessage}
                                                    onClose={onClose}/>
                                            </div>
                                        </div>
                                    </div>                    
                                </div>
                            </div>
                        </div>                        
                </div>      
            </div>
        </>
    )
}