import { useEffect,useState } from 'react';
import { Bar } from "react-chartjs-2";
import { API_POST } from '../../api';

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
            display:true,
            text: 'รายงานยอดการนัดหมายตามประเภทบริการ',
        },
    },
};

export default function Report() {
    const [isLoading, setIsLoading] = useState(false);
    const [chartData, setChartData] = useState({});

    useEffect(() =>{
        async function fetchData() {
            let json = await API_POST("report/byservice",{
                date:"2022-09-28"
            });

            console.log(json)

            var labels = [];
            var data = [];
        
            for(var i = 0; i< json.data.length; i++){
                var item = json.data[i];
                labels.push(item.service_name);
                data.push(item.count);
            }

            var dataset = {
                labels: labels,
                datasets: [
                    {
                        label: "จำนวนการนัดหมายแยกตามบริการ",
                        data: data,
                        backgroundColor: "rgba(255, 99, 132, 0.5)"
                    }
                ]
            }
            setChartData(dataset);
            setIsLoading(true);
        }
        fetchData();
    },[])

    const getChart = () => {
        if(isLoading) {
            return <Bar option={options} data={chartData} />;
        }
        return <></>;
    }


    return(
        <>
            <div className="container mt-3">
                {
                    getChart()
                }
            </div>
        </>
    )
}