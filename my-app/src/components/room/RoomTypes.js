import { useEffect, useState } from "react"
import { Form, Row, Col, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import RoomTypesItem from "./RoomTypesItem";
import { API_GET,API_POST } from "../../api";


export default function RoomTypes(){

    const [room_type,setRoomTypes] = useState([]);
    const [search,setSearch] = useState("");
    const [listroomtypes,setListRoomTypes] = useState([]);

    useEffect( () => {
        async function fetchData(){
            const response = await fetch(
                "http://localhost:8080/api/room_type",
                {
                    method: "GET",
                    headers:{
                        Accept:"application/json",
                        'Content-Type': 'application/json',
                    }
                }
            );

            let json = await response.json();
            setRoomTypes(json.data);
            setListRoomTypes(json.data);
        }
        fetchData();
    },[]);

    useEffect(() => {
        if(search == ""){
            setRoomTypes(listroomtypes);
        }

    }, [search]);

    const onSearch = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            if(search != ""){
                let searchRoomTypes = [];
                listroomtypes.filter(type => type.room_type_name.includes(search)).map(item => {
                    searchRoomTypes.push(item);
                })
    
                setRoomTypes(searchRoomTypes);
            }
        }
     }

     const onDelete = async (data) => {
        let json = await API_POST("room_type/delete", {
            room_type_id: data.room_type_id
        });

        if (json.result) {
            fetchRoomTypes();
        }
    }

    const fetchRoomTypes = async () => {
        let json = await API_GET("room_type");
        setRoomTypes(json.data);
        setListRoomTypes(json.data);
    }
    return (
        <>
           <div className="container m-auto">
                <div className="row">
                    <div className="col">
                        <div className="my-5">
                            <h2 className="header text-center text-white p-2">ข้อมูลประเภทห้องรักษา</h2>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-2">
                        <Link to={"/roomtype/add"} className="btn btn-success ms-3">{<i className="fa-solid fa-plus me-2"></i>}เพิ่มข้อมูล</Link>
                    </div>
                    <div className="col-10">
                        <Form>
                            <Row>
                                <Form.Group as={Col} md="10" className="mb-2" controlId="validateFirstName">
                                    <Form.Control
                                        required
                                        type="text"
                                        value={search}
                                        placeholder="ค้นหา"
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        กรุณากรอกข้อมูลที่ต้องการค้นหา
                                    </Form.Control.Feedback>
                                    </Form.Group>
                                <Form.Group as={Col} md="2">
                                    <div className="d-grid gap-2">
                                        <button className="btn btn-success" type="submit" onClick={onSearch}>{<i className="fa-solid fa-magnifying-glass me-2"></i>}ค้นหา</button>
                                    </div>
                                </Form.Group>
                            </Row>
                        </Form>
                    </div>
                </div>

                <div className='row mt-3'>
                    <div className='col text-center'>
                        <Table striped>
                            <thead>
                                <tr>
                                <th>รหัสประเภทห้องรักษา</th>
                                <th>ชื่อประเภทห้องรักษา</th>
                                <th>action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    room_type.map(item => (
                                        <RoomTypesItem
                                        key={item.room_type_id}
                                        data={item}
                                        onDelete={onDelete} />
                                    ))
                                }
                            </tbody>
                        </Table>
                    </div>

                </div>
            </div>


        </>
    )
}