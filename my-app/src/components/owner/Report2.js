import { Bar, getElementAtEvent } from 'react-chartjs-2';
import { API_GET, API_POST } from '../../api';
import { useEffect, useRef, useState } from 'react';

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

    useEffect(() => {
        console.log(appointStore)
        async function fetchData() {
            let json = await API_POST("report2/byappointment",{
                date:"2022-09-28"
            });
            setStore(json.data);

            let json2 = await API_GET("appointment");
            setAppointment(json2.data)

            var labels = [];
            var data = [];

            for (var i = 0; i<json.data.length; i++) {
                var item = json.data[i];
                labels.push(item.appoint_id);
                data.push(item.appoint_count);
            }

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
    }

    const onClick = async (event) => {
        var element = getElementAtEvent(chartRef.current, event);
        var index = element[0].index;

        await getAppointment(store[index].appoint_id);
    }

    const getAppointment = async (appoint_id) => {
        let json = await API_GET("appointment"+ appoint_id);
        setAppointStore(json.data);
    }


    return(
        <>
        <div className="col-6 mt-5">
            <h4>รายงานจำนวนการนัดหมายบริการ</h4>
        </div>
            <div className='container-fluid mt-3'>
                {
                    getChart()
                }
            </div>

            <div className='container-fluid mt-3'>
                {
                    // appointStore.map(item => (
                    //     <ListAppointItem
                    //         key={item.apponit_id}
                    //         data={item} />
                    // ))
                }
            </div>
        </>
    );
}