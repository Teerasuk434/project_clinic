import { useEffect, useState } from "react";
import {Button, Form , Row ,Col} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { API_GET,API_POST } from "../../api";


export default function FormRoomtypes(){

    let params = useParams();
    let navigate = useNavigate();

    const [validated,setValidated] = useState(false);

    const [room_type_name,setRoomTypesName] = useState("");
    const [room_type_id,setRoomTypesId] = useState("");

    useEffect(() =>{
        async function fetchData(room_type_id){
            let json = await API_GET("room_type/"+room_type_id);
            var data = json.data[0];

            setRoomTypesName(data.room_type_name);
            setRoomTypesId(data.room_type_id);

        }

        if(params.room_type_name != "add"){
            fetchData([params.room_type_id]);
        }
    },[]);

    const onSave = async(event) =>{
        const form = event.currentTarget;
        event.preventDefault();

        if(form.checkValidity()=== false){
            event.stopPropagation();
        }else{
            if(params.room_type_id === "add"){
                doCreateRoomtypes();
            }else{
                
                doUpdateRoomtypes();
            }
        }
    }

    const doCreateRoomtypes = async(res) => {
        const response = await fetch(
            "http://localhost:8080/api/room_type/add",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: "Bearer "+ localStorage.getItem("access_token")
                },
                body: JSON.stringify({
                    room_type_name: room_type_name
                })
            }
        )
        let json = await response.json();

        if(json.result){
            navigate("/roomtypes", { replace: true });
        }
    }
    
    const doUpdateRoomtypes = async(res) => {
        console.log(room_type_name)
        const response = await fetch(
            "http://localhost:8080/api/room_type/update",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: "Bearer "+ localStorage.getItem("access_token")
                },
                body: JSON.stringify({
                    room_type_id: room_type_id,
                    room_type_name: room_type_name
                    
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
                    
                        <Form.Group as={Col} controlId="validateRoomTypes" >
                            <Form.Label>ประเภทห้องรักษา</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={room_type_name}
                                placeholder="ประเภทห้องรักษา"
                                onChange={(e) => setRoomTypesName(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                กรุณากรอก ชื่อประเภทห้องรักษา
                            </Form.Control.Feedback>
                        </Form.Group>
                  
                        <Button variant="primary" as="input" type="submit" value="SAVE"/>
                    
                </Form>
            </div>
        </>
    )
}