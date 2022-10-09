
export default function AboutServicesItems(props){


    return (
        <>
            <tr>
                <td><p>{props.data.service_name}</p></td>
                <td><p>{props.data.cost_service}</p></td>
                <td><p>{props.data.time_spent}</p></td>
                
            </tr>
        </>
    )
}