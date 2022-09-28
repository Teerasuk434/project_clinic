import { useEffect,useRef,useState } from 'react';
import { Bar,getElementAtEvent,Doughnut,Line } from "react-chartjs-2";
import { API_GET, API_POST } from '../../api';
import { Button,ButtonGroup,Form } from 'react-bootstrap'
import AppointmentChartItem from './AppointmentChartItem';
import moment from 'moment';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
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
    const [LineData, setLineData] = useState({});

    const [dateRange, setDateRange] = useState(0); 
    const [date, setDate] = useState("2022-09-30");

    const [services, setServices] = useState([]);
    const [service_id, setService_id] = useState(1);

    const [store, setStore] = useState([]);
    const [appointmentStore, setAppointmentStore] = useState([]);
    const chartRef = useRef();
    const doughnutRef = useRef();
    const LineRef = useRef();

    useEffect(() =>{
        async function fetchData() {

            let json = await API_POST("report/byservice",{
                date:date
            });

            setStore(json.data);

            let json2 = await API_GET("service");
            setServices(json2.data)

            let amount_day = moment().daysInMonth();
            let lineLabel = []

            for(let i=0;i< amount_day;i++){
                lineLabel.push(i+1)
            }

            let dayOfWeek = []

            for(let i=0;i<=6;i++){
                dayOfWeek.push(moment().weekday(i).format("DD-MM"))
            }

            console.log(dayOfWeek)

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
                        backgroundColor: [
                            'rgba(49,113,176, 0.6)',
                            'rgba(35,113,176, 0.9)',

                          ]
                    }
                ],
            }
            setDoughData(dataset)

            dataset = {
                labels: lineLabel,
                datasets: [
                    {
                        label: "จำนวนการนัดหมาย",
                        data: data,
                        backgroundColor: [
                            'rgba(49,113,176, 0.6)',
                            'rgba(35,113,176, 0.7)',

                          ],
                          fill: true,
                          borderColor: 'rgb(75, 192, 192)',
                          tension: 0.1
                    }
                ]
            }
            setLineData(dataset)

            setIsLoading(true);
        }
        fetchData();
    },[])

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

    const getLineChart = () => {
        if(isLoading){
            return  <Line 
                option={options} 
                data={LineData}
                ref={LineRef}
                onClick={onClickLine}
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

    const onClickLine = async (event) => {
        var element = getElementAtEvent(LineRef.current, event);
        var index = element[0].index;
        
        await getAppointments(store[index].service_id)
    }

    const getAppointments = async (service_id) => {
        let json = await API_POST("appointment/service/",{
            service_id:service_id,
            date:date
        });
        setAppointmentStore(json.data);
        console.log(json)
    }

    const onClickWeek = () => {
        setDateRange(1);
    }
    
    const onClickMonth = () => {
        setDateRange(2);
    }

    const onClickYear = () => {
        setDateRange(3);
    }

    return(
        <>
            <div className="container-fluid">
                <div className="rounded border shadow p-3" style={{backgroundColor:"#F2F3F4"}}>
                    <div className="row mx-2 my-3">
                        <div className="col-6">
                        <h4>รายงานจำนวนการนัดหมายตามบริการของคลินิก</h4>
                        </div>
                        <div className="col-6 p-0">
                            <div className="row">
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
                                
                                <div className="col-6">
                                    <ButtonGroup className="shadow p-0 border-secondary w-100">
                                        <Button variant="light" className="border" onClick={onClickWeek}>สัปดาห์</Button>
                                        <Button variant="light" className="border" onClick={onClickMonth}>เดือน</Button>
                                        <Button variant="light" className="border" onClick={onClickYear}>ปี</Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row my-4 ms-5">
                        <div className="col-7 shadow border rounded me-5" style={{backgroundColor:"#F2F3F4"}}>
                            <div className="row mt-2">
                                <div className="col-6">
                                    
                                </div>
                            </div>
                            {
                                getLineChart()
                            }
                        </div>

                        <div className="col-4 shadow border rounded" style={{backgroundColor:"#F2F3F4"}} >
                            {
                                getDoughnut()
                            }
                        </div>
                    </div>
                        { appointmentStore.length >0 &&
                            <div className="container-fluid">
                                <div className="border rounded shadow" style={{backgroundColor:"rgba(201, 138 , 218, 0.9"}}>
                                    <div className="row text-center text-white">
                                        <div className="col-1">
                                            <p className="ms-4">#</p>
                                        </div>

                                        <div className="col-2">
                                            <p>ผู้นัดหมาย</p>
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

                                        <div className="col-2">
                                            <p>สถานะ</p>
                                        </div>

                                        <div className="col-2">
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
                        }

                </div>
                
            </div>
        </>
    )
}