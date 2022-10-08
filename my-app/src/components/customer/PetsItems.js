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
                    <Link to={`/account/pet/${props.data.pet_id}`} className="btn btn-warning btn-sm me-2">{<i className="fa-solid fa-pen-to-square"></i>}</Link>
                        <Button variant="danger" size="sm" onClick={onDelete}><i className="fa-solid fa-trash-can"></i></Button>
                    </div>
            </div>
        </>
    )
}