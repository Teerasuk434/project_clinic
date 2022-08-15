import { useEffect, useState } from "react";
import {Button, Form , Row ,Col} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { API_GET,API_POST } from "../../api";


export default function FormEmptypes(){

    let params = useParams();

    const [validated,setValidated] = useState(false);
    // const [emp_position_,setEmpTypes] = useState(false);
    const [emp_position_name,setEmpPositionName] = useState("");
    const [emp_position_id,setEmpPositionId] = useState("");

    useEffect(() =>{
        async function fetchData(emp_position_id){
            let json = await API_GET("emp_types/"+emp_position_id);
            var data = json.data[0];

            setEmpPositionName(data.emp_position_name);
            setEmpPositionId(data.emp_position_id);

        }

        if(params.emp_position_name != "add"){
            fetchData([params.emp_position_id]);
        }
    },[]);

    const onSave = async(event) =>{
        const form = event.currentTarget;
        event.preventDefault();

        if(form.checkValidity()=== false){
            event.stopPropagation();
        }else{
            if(params.emp_position_id === "add"){
                doCreateEmptypes();
            }else{
                
                doUpdateEmptypes();
            }
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
            console.log("เพิ่มสำเร็จ");
        }
    }
    
    const doUpdateEmptypes = async(res) => {
        console.log(emp_position_name)
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
            console.log("อัปเดตสำเร็จ");
        }
    }
    return(
        <>
            <div className="container">
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
                  
                        <Button variant="primary" as="input" type="submit" value="SAVE"/>
                    
                </Form>
            </div>
        </>
    )
}