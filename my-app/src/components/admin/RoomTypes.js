import { useEffect, useState } from "react"

export default function RoomTypes(){
    
    const [room_type,setRoomTypes] = useState([]);


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

        }
        fetchData();
    },[]);
    
    return(
        <>
        <div>
            <h1>ประเภทห้องรักษา</h1>
            {
                room_type.map(item => (
                <div>
                    <h1>{item.room_type_id}</h1>
                    <h1>{item.room_type_name}</h1>
                </div>
                )
                )
            }
        </div>
        </>
    )
}