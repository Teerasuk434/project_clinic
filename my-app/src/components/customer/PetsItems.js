import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function PetsItems(props) {

    const onDelete = async () => {
        props.onDelete(props.data)
    }

    return (
        <>
            <div className="box-pet bg-light shadow text-start col-3 mx-2 my-3">
                <div className="text-center border-bottom border-secondary border-opacity-50 p-2 box-pet-image">
                    {props.data.image == "" ?
                        <img src={`http://localhost:8080/images/pets/default.png`} alt=""/>
                        :
                        <img src={`http://localhost:8080/images/pets/${props.data.image}`} alt=""/>    
                    }
                </div>
                    <p>ชื่อสัตว์เลี้ยง : {props.data.pet_name}</p>
                    <p>ประเภทสัตว์ : {props.data.pet_type}</p>
                    <p>สายพันธุ์ : {props.data.pet_species}</p>
                    <p>เพศ : {props.data.pet_gender}</p>
                    <p className="border-bottom border-secondary border-opacity-25 ">อายุ : {props.data.pet_age_year} ปี {props.data.pet_age_month} เดือน</p>
                    
                    <div className="float-end p-2">
                        <Button variant="warning" size="sm" className="me-2">แก้ไขข้อมูล</Button>
                        <Button variant="danger" size="sm" onClick={onDelete}>ลบ</Button>
                    </div>
            </div>
        </>
    )
}