import { useEffect,useRef,useState } from 'react';
import { Bar,getElementAtEvent,Doughnut,Line } from "react-chartjs-2";
import { API_GET, API_POST } from '../../api';
import { Button,ButtonGroup,Form,ToggleButton } from 'react-bootstrap'
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
    LineElement,
    Filler
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
    LineElement,
    Filler
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

    const [dateRange, setDateRange] = useState(0); 

    const [services, setServices] = useState([]);
    const [service_id, setService_id] = useState(1);
    const [service_name, setServiceName] = useState("");

    const [date, setDate] = useState("");

    const [date_start, setDateStart] = useState("");
    const [date_end, setDateEnd] = useState("");
    const [sumData, setSumData] = useState(0);

    const [store, setStore] = useState([]);
    const [appointmentStore, setAppointmentStore] = useState([]);
    const chartRef = useRef();

    const radios = [
        { name: 'สัปดาห์', value: '0' },
        { name: 'เดือน', value: '1' },
        { name: 'ปี', value: '2' },
      ];


    useEffect(() =>{
        fetchReportData();
        fetchService();
        document.body.style.overflow = "hidden"
    },[service_id,dateRange])

    useEffect(()=>{
        setDataChart();
    },[store])

    const fetchReportData = async () =>{
        let json = await API_POST("report/byservice",{
            service_id,service_id,
            dateRange:dateRange //0 == week  1 == month  2 == year
        });

        setStore(json.data);
    }

    const fetchService = async () => {
        let json = await API_GET("service");
        setServices(json.data)
        setServiceName(json.data[service_id-1].service_name)
    }

    const setDataChart = () => {

        var labels = [];
        var data = [];
        let sumData_temp = 0;

            for(var i = 0; i< store.length; i++){
                var item = store[i];

                if(dateRange == 0  || dateRange == 1){
                    labels.push(moment(item.date).format("DD/MM"));
                }else{
                    labels.push(moment().month(item.date-1).format("MMMM"));
                }
                data.push(item.count);
                sumData_temp += item.count;

                if(i==0){
                    setDateStart(moment(item.date).format("DD/MM/YYYY"))
                }else if(i < store.length){
                    setDateEnd(moment(item.date).format("DD/MM/YYYY"))
                }
            }

            setSumData(sumData_temp)
            
            var dataset = {
                labels: labels,
                datasets: [
                    {
                        label: "จำนวนการนัดหมาย",
                        data: data,
                        backgroundColor: [
                            'rgba(20,113,176, 0.2)',
                          ],
                          fill:true,
                          borderColor: 'rgb(49,113,176)',
                          tension: 0.1
                    }
                ]
            }
            setChartData(dataset)
            
            setIsLoading(true);
    }

    const getLineChart = () => {
        if(isLoading){
            return  <Line 
                option={options} 
                data={chartData}
                ref={chartRef}
                onClick={onClickChart}
                />
        }
        return <></>;
    }

    const onClickChart = async (event) => {
        var element = getElementAtEvent(chartRef.current, event);
        var index = element[0].index;
        console.log(index)
        console.log(store)

        await getAppointments(store[index].date)
    }

    const getAppointments = async (date) => {
        let year = moment().year();
        let date_temp;

        if(dateRange == 2){
            date_temp = moment(`${year}-${date}-01`).format("YYYY-MM-DD");
        }else{
            date_temp = date;
        }

        console.log(date_temp)
        let json = await API_POST("appointment/service/",{
            service_id:service_id,
            date:date_temp,
            dateRange:dateRange
        });
        setAppointmentStore(json.data);
        console.log(json)
    }

    // const onClickWeek = () => {
    //     setDateRange(0);
    // }
    
    // const onClickMonth = () => {
    //     setDateRange(1);
    // }

    // const onClickYear = () => {
    //     setDateRange(2);
    // }

    return(
        <>
            <div className="container-fluid mt-3">
                <div className="rounded border shadow p-3" style={{backgroundColor:"#F2F3F4"}}>
                    <div className="row mx-2 my-3">
                        <div className="col-6">
                        <h4>รายงานยอดการนัดหมายตามบริการของคลินิก</h4>
                        </div>
                        <div className="col-6 p-0">
                            <div className="row">
                                <div className="col-6">
                                    <Form.Select
                                        value={service_id}
                                        onChange={(e) => setService_id(e.target.value)}
                                        required>
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
                                        {/* <Button variant="light" className="border" onClick={onClickWeek}>สัปดาห์</Button>
                                        <Button variant="light" className="border" onClick={onClickMonth}>เดือน</Button>
                                        <Button variant="light" className="border" onClick={onClickYear}>ปี</Button> */}
                                        {radios.map((radio, value) => (
                                            <ToggleButton
                                                key={value}
                                                id={`radio-${value}`}
                                                type="radio"
                                                variant="light"
                                                name="radio"
                                                value={dateRange}
                                                checked={dateRange === value }
                                                onChange={(e) => setDateRange(value)}
                                            >
                                                {radio.name}
                                            </ToggleButton>
                                            ))}


                                    </ButtonGroup>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row my-4 px-5">
                        <div className="col-8 shadow border rounded me-5" style={{backgroundColor:"#F2F3F4"}}>
                            {
                                getLineChart()
                            }
                        </div>
                        <div className="col-3 shadow border rounded" style={{backgroundColor:"#F2F3F4"}}>
                            <div className="px-1 pt-2">
                                <h5 className="text-center">สรุป</h5>
                                <p><b>ชื่อบริการ :</b> {service_name}</p>
                                <p><b>ประเภทช่วงเวลา :</b> รายสัปดาห์</p>
                                <p><b>วันที่ : </b> {date_start} - {date_end}</p>

                                <div className="text-center mt-5 shadow p-2">
                                    <h4>ยอดรวม</h4>
                                    <h3 className="text-success">{sumData}</h3>
                                    <h4>รายการ</h4>
                                </div>
                            </div>
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