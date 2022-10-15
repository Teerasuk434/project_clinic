
export default function AboutServicesItems(props){
 

    return (
        <>
            <div className="row box-service  mb-4 shadow">
                
                <div className=" col-3 m-auto "><b><img src={`http://localhost:8080/images/${props.data.service_image}` } className="mx-3" width={50}/>  {props.data.service_name}</b></div>
                <div className=" col-3 m-auto "><b>{props.data.cost_service}</b></div>
                <div className=" col-3 m-auto "><b>{props.data.cost_deposit}</b></div>
                <div className=" col-3 m-auto "><b>{props.data.time_spent}</b></div>
                        
            </div>
        </>
    )
}