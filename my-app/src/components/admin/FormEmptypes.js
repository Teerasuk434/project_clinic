import { useEffect, useState } from "react";
import {Button, Form , Row ,Col} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { API_GET,API_POST } from "../../api";

import Sidebar from "./Sidebar";
import Top from "./Top";

import { UpdateModal } from "../ModalsAdmin";

export default function FormEmptypes(){

    let params = useParams();
    let navigate = useNavigate();
    let pages = 4;
    let date = new Date().toLocaleDateString();


    const [validated,setValidated] = useState(false);
    const [emp_position_name,setEmpPositionName] = useState("");
    const [emp_position_id,setEmpPositionId] = useState(0);
    const [emp_type, setEmpType] = useState([]);
    const [empTypes, setEmpTypes] = useState([]);
    const [listEmpTypes, setListEmpTypes] = useState([]);

     // confirmModal
     const [confirmModal, setConfirmModal] = useState(false);
     const [confirmModalTitle, setConfirmModalTitle] = useState("");
     const [confirmModalMessage, setConfirmModalMessage] = useState("");
 

    useEffect(() =>{
        async function fetchData(emp_position_id){
            let json = await API_GET("emp_types/"+emp_position_id);
            var data = json.data[0];
            
            setEmpPositionName(data.emp_position_name);
            setEmpPositionId(data.emp_position_id);
            console.log(json)
            
        }

        if(params.emp_position_name != "add"){
            fetchData([params.emp_position_id]);
        }
    },[]);

    // show modal
    const onSave = async(event) =>{
        const form = event.currentTarget;
        event.preventDefault();

        if(form.checkValidity()=== false){
            event.stopPropagation();
        }else{

            // onDelete();
            onConfirm();
        }
    }

    const doCreateEmptypes = async(res) => {
        const response = await fetch(
            "http://localhost:8080/api/emp_types/add",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: "Bearer "+ localStorage.getItem("access_token")
                },
                body: JSON.stringify({
                    emp_position_name: emp_position_name
                })
            }
        )
        let json = await response.json();

        if(json.result){
            navigate("/emptypes", { replace: true });
        }
    }
    
    const doUpdateEmptypes = async(res) => {
        const response = await fetch(
            "http://localhost:8080/api/emp_types/update",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: "Bearer "+ localStorage.getItem("access_token")
                },
                body: JSON.stringify({
                    emp_position_id: emp_position_id,
                    emp_position_name: emp_position_name
                    
                })
            }
        )
        let json = await response.json();

        if(json.result){
            navigate("/emptypes", { replace: true });
        }
    }

    const onConfirm = async (data) => {
        
        

        if(params.emp_position_id === "add"){
            
            setConfirmModalTitle("ยืนยันการเพิ่มข้อมูล");
            setConfirmModalMessage("คุณยืนยันการเพิ่มข้อมูลใช่หรือไม่");
            setConfirmModal(true);
        }else{

            setConfirmModalTitle("ยืนยันการแก้ไขข้อมูล");
            setConfirmModalMessage("คุณยืนยันการแก้ไขข้อมูลใช่หรือไม่");
            setConfirmModal(true);
            
        }
        
    }

    const onConfirmUpdate = async () => {
        setConfirmModal(false);

        if(params.emp_position_id === "add"){
            doCreateEmptypes();
            
        }else{
            doUpdateEmptypes();
            
        }

        
        // let json = await API_POST("emp_types/update", {
        //     emp_position_name:emp_position_name,
        //     emp_position_id: emp_position_id
            
        // });

        // if (json.result) {
        //     setEmpType();
        //     fetchData();
        //     navigate("/emptypes", { replace: true });
        // }
    }
    const onCancelUpdate = () => {
        setConfirmModal(false);

    }

    // const fetchData = async () => {
    //     let json = await API_GET("emp_types");
    //     setEmpTypes(json.data);
    //     setListEmpTypes(json.data);
    //     doUpdateEmptypes();
        
    // }
    
    return (
    <>
            <div className="container-fluid">

                <div className='row'>

                    <Top />

                        <div className='p-0 col-12 col-lg-2 bg-primary'>
                            <div className='sidebar'>
                                <Sidebar pages={pages}/>
                            </div>
                        </div>

                            <div className='p-0 m-0 col-12 col-lg-10'>
                                <div className="content p-5">
                                    <div className='container m-auto'>

                                        <h4 className='text-center'>เพิ่มประเภทพนักงาน</h4>
                                            <Form noValidate validated={validated} onSubmit={onSave}>
                                            
                                                <Form.Group as={Col} controlId="validateEmpTypes" >
                                                    <Form.Label>ประเภทพนักงาน</Form.Label>
                                                    <Form.Control
                                                        required
                                                        type="text"
                                                        value={emp_position_name}
                                                        placeholder="ประเภทพนักงาน"
                                                        onChange={(e) => setEmpPositionName(e.target.value)}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        กรุณากรอก ชื่อประเภทพนักงาน
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Row className="my-4">
                                                    <Button variant="primary" as="input" type="submit" value="SAVE"  onClick={onSave} />
                                                </Row>

                                                <UpdateModal
                                                    show={confirmModal}
                                                    title={confirmModalTitle}
                                                    message={confirmModalMessage}
                                                    onConfirm={onConfirmUpdate}
                                                    onClose={onCancelUpdate}/>
                                            </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                            <div className="row">              
                                <div className='bottom'>
                                    <div>
                                        <p>วันที่ : {date}</p>
                                    </div>
                                </div>
                            </div>
                </div>
        </>
    )
}