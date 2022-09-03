import { useEffect, useState } from "react";
import {Button, Form , Row ,Col} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { API_GET,API_POST } from "../../api";


export default function FormEmployee(){

    let params = useParams();
    let navigate = useNavigate();

    const [validated,setValidated] = useState(false);
    const [emp_id,setEmpId] = useState([]);
    const [emp_fname,setEmpFname] = useState("");
    const [emp_lname,setEmpLname] = useState("");
    const [emp_address,setEmpAdress] = useState("");
    const [emp_tel,setEmpTel] = useState("");
    const [emp_salary,setEmpSalary] = useState(0);
    const [emp_position_id,setEmpPositionId] = useState("");
    const [user_id,setUserId] = useState("");

    useEffect(() =>{
        async function fetchData(emp_id){
            let json = await API_GET("emp/"+emp_id);
            var data = json.data[0];

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
    },[]);

    const onSave = async(event) =>{
        const form = event.currentTarget;
        event.preventDefault();

        if(form.checkValidity()=== false){
            event.stopPropagation();
        }else{
            if(params.emp_id === "add"){
                doCreateEmployee();
            }else{
                
                doUpdateEmployee();
            }
        }
    }

    const doCreateEmployee = async(res) => {
        const response = await fetch(
            "http://localhost:8080/api/emp/add",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: "Bearer "+ localStorage.getItem("access_token")
                },
                body: JSON.stringify({
                    emp_fname: emp_fname,
                    emp_lname: emp_lname,
                    emp_address: emp_address,
                    emp_tel: emp_tel,
                    emp_salary: emp_salary,
                    emp_position_id: emp_position_id,
                    user_id: user_id
                })
            }
        )
        let json = await response.json();

        if(json.result){
            navigate("/emp", { replace: true });
        }
    }
    
    const doUpdateEmployee = async(res) => {

        const response = await fetch(
            "http://localhost:8080/api/emp/update",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: "Bearer "+ localStorage.getItem("access_token")
                },
                body: JSON.stringify({
                    emp_fname: emp_fname,
                    emp_lname: emp_lname,
                    emp_address: emp_address,
                    emp_tel: emp_tel,
                    emp_salary: emp_salary,
                    emp_position_id: emp_position_id,

                    
                })
            }
        )
        let json = await response.json();

        if(json.result){
            navigate("/emp", { replace: true });
        }
    }
    return(
        <>
            <div className="container">
            <Form noValidate validated={validated} onSubmit={onSave}>
                    
                        <Form.Group as={Col} controlId="validateFirstName" >
                            <Form.Label>ชื่อ</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={emp_id}
                                placeholder="ชื่อ"
                                onChange={(e) => setEmpId(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                กรุณากรอก ชื่อพนักงาน
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="validateLastName" >
                            <Form.Label>นามสกุล</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={emp_lname}
                                placeholder="นามสกุล"
                                onChange={(e) => setEmpLname(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                กรุณากรอก นามสกุลพนักงาน
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="validatePosition" >
                            <Form.Label>ตำแหน่ง</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={emp_position_id}
                                placeholder="ตำแหน่ง"
                                onChange={(e) => setEmpPositionId(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                กรุณากรอก ตำแหน่ง
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="validateAddress" >
                            <Form.Label>ที่อยู่</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={emp_address}
                                placeholder="ที่อยู่"
                                onChange={(e) => setEmpAdress(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                กรุณากรอก ที่อยู่
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="validateTel" >
                            <Form.Label>เบอร์โทร</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={emp_tel}
                                placeholder="เบอร์โทร"
                                onChange={(e) => setEmpTel(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                กรุณากรอก เบอร์โทร
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="validateSalary" >
                            <Form.Label>เงินเดือน</Form.Label>
                            <Form.Control
                                required
                                type="number"
                                value={emp_salary}
                                placeholder="เงินเดือน"
                                onChange={(e) => setEmpSalary(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                กรุณากรอก เงินเดือน
                            </Form.Control.Feedback>
                        </Form.Group>
                            
                        <Row className="mb-3">
                            <Button variant="primary" as="input" type="submit" value="SAVE"/>
                        </Row>
                </Form>
            </div>
        </>
    )
}