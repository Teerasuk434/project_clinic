import { Bar, getElementAtEvent } from 'react-chartjs-2';
import { API_GET, API_POST } from '../../api';
import { useEffect, useRef, useState } from 'react';
import AppointmentChartItem from '../owner/AppointmentChartItem';
import { Form , ButtonGroup , ToggleButton} from 'react-bootstrap';
import moment from 'moment';

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

export default function ReportAppointment() {

    const [isLoading, setIsLoading] = useState(false);
    const [chartData, setChartData] = useState({});
    const [store, setStore] = useState([]);

    const [appointStore, setAppointStore] = useState([]);
    
    const [service_id, setServiceId] = useState(0)
    const [service_name, setServiceName] = useState("")
    const [count, setCount] = useState("")

    const chartRef = useRef();

    const [Range, setRange] = useState(0); 
    const [RangeName2, setRangeName2] = useState("");

    const [date_start, setDateStart] = useState("");
    const [date_end, setDateEnd] = useState("");
    const [sumData, setSumData] = useState(0);


    const radios = [
        { name: 'สัปดาห์', value: '0' },
        { name: 'เดือน', value: '1' },
        { name: 'ปี', value: '2' },
      ];

      useEffect(() =>{
        fetchAppointment();
        if(Range == 0){
            setRangeName2("รายสัปดาห์")
        }else if(Range == 1){
            setRangeName2("รายเดือน")
        }else{
            setRangeName2("รายปี");
        }
    },[Range])

    useEffect(()=>{
        setDataChart();
    },[store])

    const fetchAppointment = async () => {
        let json = await API_POST("report2/byappointment",{
            dateRange:Range
        });
            setStore(json.data);
    }


    const setDataChart = () => {

        var labels = [];
        var data = [];
        let sumData_temp = 0;

        if(store.length >0){
            let findmax = store.reduce((pre, curr) => {
                return curr.appointment_count > pre.appointment_count ? curr : pre;
            })

            setServiceName(findmax.service_name)
            setCount(findmax.appointment_count)

        }

            for(var i = 0; i< store.length; i++){
                var item = store[i];

                labels.push(item.service_name );

                data.push(item.appointment_count);
                sumData_temp += item.appointment_count;
            }

            setSumData(sumData_temp)

            console.log(labels);
            console.log(data);
            
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

    // useEffect(() => {
    //     console.log(appointStore)
    //     async function fetchData() {
    //         let json = await API_POST("report2/byappointment",{
    //             date:date
    //         });
    //         setStore(json.data);
    //         console.log(json.data)
            
    //         var labels = [];
    //         var data = [];
            
    //         for (var i = 0; i<json.data.length; i++) {
    //             var item = json.data[i];
    //             labels.push(json.data[i].date);
    //             data.push(json.data[i].appointment_count);
                
    //         }
    //         console.log(data)

    //         var dataset = {
    //             labels: labels,
    //             datasets: [
    //                 {
    //                     label: "จำนวนการนัดหมายบริการ",
    //                     data: data,
    //                     backgroundColor: 'rgba(20,113,176, 0.2)'
    //                 }
    //             ]
    //         }
    //         setChartData(dataset);
    //         setIsLoading(true);
    //     }

    //     fetchData();
    // },[]);

    const getChart =() => {
        if (isLoading) {
            return <Bar 
            options={options} 
            data={chartData} 
            ref={chartRef}
            onClick={onClickChart}
            />
            
        }
        return <></>;
    }

    const onClickChart = async (event) => {
        var element = getElementAtEvent(chartRef.event);
        var index = element[0].index;
        
        await getAppointment(store[index].date)
    }

    const getAppointment = async (date) => {

        let year = moment().year();
        let date_temp;

        if(Range == 2){
            date_temp = moment(`${year}-${date}-01`).format("YYYY-MM-DD");
        }else{
            date_temp = date;
        }
        let json = await API_GET("appointment/service",{
            service_id: service_id,
            date: date_temp,
            Range: Range
        })
        setAppointStore(json.data);
    }

    return(
        <>
            <div className="container-fluid ">
                <div className="my-4 shadow rounded border p-3" style={{backgroundColor:"#F2F3F4"}}>
                    <div className="row mx-2 my-3 ">
                        <div className="col-6">
                            <h4>รายงานจำนวนการนัดหมายบริการ</h4>
                        </div>

                        <div className="col-6 p-0">
                            <div className="row">

                                <div className="col-12">
                                <div className='text-end'>
                                    <ButtonGroup className="shadow p-0 border-secondary w-50 ">
                                    
                                        {radios.map((radio, value) => (
                                            <ToggleButton 
                                                key={value}
                                                id={`radio2-${value}`}
                                                type="radio"
                                                variant="light"
                                                name="radio2"
                                                value={Range}
                                                checked={Range === value }
                                                onChange={(e) => setRange(value)}
                                            >
                                                {radio.name}
                                            </ToggleButton>
                                            ))}
                                    </ButtonGroup>
                                </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row m-4 justify-content-between">
                        <div className="shadow border rounded me-1" style={{backgroundColor:"#F2F3F4",width:"65%"}}>
                            <div className='container-fluid me-1'>
                                {
                                    getChart()
                                    
                                }
                            </div>
                        </div>
                        <div className="shadow border rounded pt-3" style={{backgroundColor:"#F2F3F4",width:"30%"}}>
                            <h5 className="text-center">สรุปข้อมูล</h5>
                            <p className="border-bottom border-secondary border-opacity-25"><b>ประเภทช่วงเวลา :</b> {RangeName2}</p>
                            {store.length > 0 && 
                                <>
                                    <p><b>บริการที่มีจำนวนเยอะที่สุด :</b> {service_name}</p>
                                    <p><b>จำนวน :</b> {count}</p>
                                </>
                            }


                            <div className="text-center mt-3 mx-5 shadow p-2">
                                <h4>ยอดรวม</h4>
                                <h3 className="text-success">{sumData}</h3>
                                <h4>รายการ</h4>
                            </div>
                        </div>
                    </div>
                            
                        
                    
                </div>
            </div>
           
        </>
    );
}