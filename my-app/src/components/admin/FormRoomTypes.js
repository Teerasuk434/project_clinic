

export default function FormRoomtypes(){

    const [room_type_id,setRoomTypesId] = useState("");
    const [room_type_name,setRoomTypesName] = useState("");

    const doCreateRoomtypes = async(res) => {
        const response = await fetch(
            "http://localhost:8080/api/room_types/add",
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
        // // let json = await response.json();

        // // if(json.result){
        // //     console.log("เพิ่มสำเร็จ");
        // }
    }
}