import { Bar, getElementAtEvent } from 'react-chartjs-2';
import { API_GET } from '../../api';
import { useEffect, useRef, useState } from 'react';
import ListAppointItem from '../ListAppointItem';


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
    plugin: {
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
    const [appointStore, setAppointStroe] = useState([]);
    const chartRef = useRef();

    useEffect(() => {
        async function fetchData() {
            let json = await API_GET("report2");

            setStore(json.data);

            var labels = [];
            var data = [];

            for (var i = 0; i<json.data.length; i++) {
                var item = json.data[i];
                labels.push(item.apponit_id);
                data.push(item.appoint_count);
            }

            var dataset = {
                labels: labels,
                dataset: [
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

        await getAppointment(store[index].date);
    }

    const getAppointment = async (appointment) => {
        let json = await API_GET("report2");
        setAppointStroe(json.data);
    }


    return(
        <>
            <div className='container-fluid mt-3'>
                {
                    getChart()
                }
            </div>

            <div className='container-fluid mt-3'>
                {
                    appointStore.map(item => (
                        <ListAppointItem
                            key={item.apponit_id}
                            data={item} />
                    ))
                }
            </div>
        </>
    );
}