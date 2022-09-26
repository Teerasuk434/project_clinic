import { useEffect,useRef,useState } from 'react';
import { Bar,getElementAtEvent,Doughnut } from "react-chartjs-2";
import { API_GET, API_POST } from '../../api';
import { Button,ButtonGroup,Form } from 'react-bootstrap'
import AppointmentChartItem from './AppointmentChartItem';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
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
    const [doughnutData, setDoughData] = useState({});

    const [services, setServices] = useState([]);
    const [service_id, setService_id] = useState(0);

    const [store, setStore] = useState([]);
    const [appointmentStore, setAppointmentStore] = useState([]);
    const chartRef = useRef();
    const doughnutRef = useRef();

    useEffect(() =>{
        async function fetchData() {
            let json = await API_POST("report/byservice",{
                date:"2022-09-28"
            });
            setStore(json.data);

            let json2 = await API_GET("service");
            setServices(json2.data)

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
                        label: "จำนวนการนัดหมาย",
                        data: data,
                        backgroundColor: "rgba(201, 138 , 218, 0.7)"
                    }
                ]
            }
            setChartData(dataset);

            dataset = {
                labels: labels,
                datasets: [
                    {
                        label: "จำนวนการนัดหมาย",
                        data: data,
                        backgroundColor: [
                            'rgba(201, 138 , 218, 0.7)',
                            'rgba(220, 138 , 218, 0.9)',

                          ]
                    }
                ]
            }
            setDoughData(dataset)

            setIsLoading(true);
        }
        fetchData();
    },[])

    const getChart = () => {
        if(isLoading) {
            return <Bar 
                option={options} 
                data={chartData}
                ref={chartRef}
                onClick={onClickBar} />;
        }
        return <></>;
    }

    const getDoughnut = () => {
        if(isLoading){
            return  <Doughnut 
                option={options} 
                data={doughnutData}
                ref={doughnutRef}
                onClick={onClickDoughnut}
                />
        }
        return <></>;
    }

    const onClickBar = async (event) => {
        var element = getElementAtEvent(chartRef.current, event);
        console.log(element)
        var index = element[0].index;
        
        await getAppointments(store[index].service_id)
    }

    const onClickDoughnut = async (event) => {
        var element = getElementAtEvent(doughnutRef.current, event);
        var index = element[0].index;
        
        await getAppointments(store[index].service_id)
    }

    const getAppointments = async (service_id) => {
        let json = await API_GET("appointment/service/" + service_id);
        setAppointmentStore(json.data);
        console.log(json)
    }


    return(
        <>
            <div className="container">
                <div className="rounded border shadow p-3" style={{backgroundColor:"#F2F3F4"}}>
                    <h4>รายงานจำนวนการนัดหมายตามบริการของคลินิก</h4>
                    <div className="row ms-2 mt-3" style={{width:"50%"}}>
                        <div className="col-6">
                            <Form.Select
                                value={service_id}
                                onChange={(e) => setService_id(e.target.value)}
                                required>
                                <option label="กรุณาเลือกประเภทบริการ"></option> 
                                {
                                services.map(item => (
                                    <option key={item.service_id} value={item.service_id}> 
                                    {item.service_name} </option>
                                ))
                                }
                            </Form.Select>
                        </div>
                        
                            <ButtonGroup className="col-6">
                                <Button>สัปดาห์</Button>
                                <Button>เดือน</Button>
                                <Button>ปี</Button>
                            </ButtonGroup>
                    </div>
                    <div className="row my-3 ms-3">
                        <div className="col-7 shadow p-2 border rounded me-5" style={{backgroundColor:"#F2F3F4"}}>
                            <div className="row mt-2">
                                <div className="col-6">
                                    
                                </div>
                            </div>
                            {
                                getChart()
                            }
                        </div>

                        <div className="col-4 shadow p-2 border rounded" style={{backgroundColor:"#F2F3F4"}} >
                            {
                                getDoughnut()
                            }
                        </div>
                    </div>

                        <div className="container-fluid mt-5">
                            <div className="border rounded shadow" style={{backgroundColor:"rgba(201, 138 , 218, 0.9"}}>
                                <div className="row text-center text-white">
                                    <div className="col-1">
                                        <p>#</p>
                                    </div>

                                    <div className="col-2">
                                        <p>ผู้นัดหมาย</p>
                                    </div>

                                    <div className="col-1">
                                        <p>ชื่อสัตว์</p>
                                    </div>

                                    <div className="col-2">
                                        <p>บริการ</p>
                                    </div>

                                    <div className="col-1">
                                        <p>วันที่</p>
                                    </div>

                                    <div className="col-2">
                                        <p>เวลา</p>
                                    </div>

                                    <div className="col-1">
                                        <p></p>
                                    </div>

                                    <div className="col-1">
                                        <p></p>
                                    </div>
                                </div>

                            </div>
                            {
                                appointmentStore.map(item=>(
                                    <AppointmentChartItem
                                        key={item.appoint_id}
                                        data={item}
                                    />
                                ))
                            }

                    </div>

                </div>
                
            </div>
        </>
    )
}