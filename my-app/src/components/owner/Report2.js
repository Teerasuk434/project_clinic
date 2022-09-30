import { Bar, getElementAtEvent } from 'react-chartjs-2';
import { API_GET, API_POST } from '../../api';
import { useEffect, useRef, useState } from 'react';
import AppointmentChartItem from './AppointmentChartItem';


import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'รายงานจำนวนการนัดหมายบริการ'
        },
    },
};

export default function Report2() {

    const [isLoading, setIsLoading] = useState(false);
    const [chartData, setChartData] = useState({});
    const [store, setStore] = useState([]);

    const [appointStore, setAppointStore] = useState([]);
    const chartRef = useRef();

    const [appoint_id, setAppointId] = useState(0);
    const [appointment, setAppointment] = useState([]);
    const [date, setDate] = useState("");

    useEffect(() => {
        console.log(appointStore)
        async function fetchData() {
            let json = await API_POST("report2/byappointment",{
                date:date
            });
            setStore(json.data);
            console.log(json.data)
            let json2 = await API_GET("appointment");
            setAppointment(json2.data)
            

            var labels = [];
            var data = [];
            
            for (var i = 0; i<json.data.length; i++) {
                var item = json.data[i];
                labels.push(json.data[i].date);
                data.push(json.data[i].appointment_count);
                
            }
            console.log(data)
            var dataset = {
                labels: labels,
                datasets: [
                    {
                        label: "จำนวนการนัดหมายบริการ",
                        data: data,
                        backgroundColor: "rgba(255, 99, 132, 0.5)"

                    }
                    
                ]
                
            }

            setChartData(dataset);
            setIsLoading(true);
        }

        fetchData();
    },[]);

    const getChart =() => {
        if (isLoading) {
            return <Bar 
            options={options} 
            data={chartData} 
            ref={chartRef}
            onClick={onClick}/>
        }
        return <></>;
    }

    const onClick = async (event) => {
        var element = getElementAtEvent(chartRef.current, event);
        var index = element[0].index;

        await getAppointment(store[index].date);
    }

    const getAppointment = async (date) => {
        let json = await API_GET("appointment/date/",{
            date: date
        })
        setAppointStore(json.data);
    }


    return(
        <>
        <div className="container-fluid">
                <div className="mt-5 border mb-5 shadow rounded " style={{backgroundColor:"#F2F3F4"}}>
                    <div className="row mx-4 my-4">
                        <div className="col-6">
                            <h2>รายงานจำนวนการนัดหมายบริการ</h2>
                        </div>
                        
                            <div className='container-fluid mt-3'>
                                {
                                    getChart()
                                    
                                }
                                
                            </div>
                            {
                                appointStore.map(item => (
                                    <AppointmentChartItem
                                    key={item.date}
                                    data={item} />
                                ))
                            }
                    </div>
                </div>
            </div>
        </>
    );
}