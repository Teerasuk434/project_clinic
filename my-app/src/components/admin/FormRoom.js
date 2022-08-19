import { useEffect, useState } from "react";
import {Button, Form , Row ,Col} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { API_GET,API_POST } from "../../api";


export default function FormRoom(){

    let params = useParams();
    let navigate = useNavigate();

    const [validated,setValidated] = useState(false);

    const [room_types, setRoomTypes] = useState([]);
    const [room_type_id, setRoomTypeId] = useState(0);

    const [room_name,setRoomName] = useState("");
    const [room_id,setRoomId] = useState("");

    useEffect(() =>{
        async function fetchData(room_id){
            let json = await API_GET("room/"+room_id);
            var data = json.data[0];
            setRoomName(data.room_name);
            setRoomId(data.room_id);

        }
        if(params.room_name != "add"){
            fetchData([params.room_id]);
        }

    },[params.room_id]);

    useEffect(() =>{
        async function fetchData(){
            let json = await API_GET("room_type");
            setRoomTypes(json.data);
        }
        fetchData();

    },[]);

    const onSave = async(event) =>{
        const form = event.currentTarget;
        event.preventDefault();

        if(form.checkValidity()=== false){
            event.stopPropagation();
        }else{
            if(params.room_id === "add"){
                doCreateRoom();
                
            }else{
                doUpdateRoom();
            }
        }
    }

    const doCreateRoom = async(res) => {
        const response = await fetch(
            "http://localhost:8080/api/room/add",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: "Bearer "+ localStorage.getItem("access_token")
                },
                body: JSON.stringify({
                    room_name: room_name,
                    room_type_id:room_type_id
                })
            }
        )
        let json = await response.json();

        if(json.result){
            navigate("/room", { replace: true });
        }
    }
    
    const doUpdateRoom = async(res) => {
        console.log(room_name)
        const response = await fetch(
            "http://localhost:8080/api/room/update",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                    Authorization: "Bearer "+ localStorage.getItem("access_token")
                },
                body: JSON.stringify({
                    room_id: room_id,
                    room_name: room_name,
                    room_type_id: room_type_id
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
                    
                        <Form.Group as={Col} controlId="validateRoom" >
                            <Form.Label>ข้อมูลห้องรักษา</Form.Label>
                            <Form.Control
                                required
                                type="text"
                                value={room_name}
                                placeholder="ข้อมูลห้องรักษา"
                                onChange={(e) => setRoomName(e.target.value)}
                            />
                            <Form.Control.Feedback type="invalid">
                                กรุณากรอก ชื่อข้อมูลห้องรักษา
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} controlId="validateRoomType">
                            <Form.Label>ประเภทห้องรักษา</Form.Label>
                            <Form.Select
                                value={room_type_id}
                                onChange={(e) => setRoomTypeId(e.target.value)}
                                required>
                                <option label="กรุณาเลือกประเภทห้องรักษา"></option> 
                                {
                                   room_types.map(item => (
                                    <option key={item.room_type_id} value={item.room_type_id}> 
                                    {item.room_type_name} </option>
                                ))
                                }
                            </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    กรุณาเลือก ประเภทผู้ใช้งาน
                                </Form.Control.Feedback>
                        </Form.Group>
                  
                        <Button variant="primary" as="input" type="submit" value="SAVE"/>
                    
                </Form>
            </div>
        </>
    )
}