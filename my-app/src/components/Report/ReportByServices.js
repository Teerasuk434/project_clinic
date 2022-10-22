import { useEffect,useRef,useState } from 'react';
import { Bar, getElementAtEvent,Line } from "react-chartjs-2";
import { API_GET, API_POST } from '../../api';
import { Button,ButtonGroup,Form,Pagination,ToggleButton } from 'react-bootstrap'
import AppointmentChartItem from './AppointmentChartItem'
import { ShowAppointmentDetails } from '../Modal';
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

export default function ReportByServices() {
    const [isLoading, setIsLoading] = useState(false);
    const [chartData, setChartData] = useState({});

    const [data_max, setDataMax] = useState(0);

    const [dateRange, setDateRange] = useState(0); 
    const [RangeName, setRangeName] = useState("");

    const [services, setServices] = useState([]);
    const [service_id, setService_id] = useState(1);
    const [service_name, setServiceName] = useState("");

    const [date_start, setDateStart] = useState("");
    const [date_end, setDateEnd] = useState("");
    const [sumData, setSumData] = useState(0);

    const [store, setStore] = useState([]);
    const [appointmentStore, setAppointmentStore] = useState([]);
    const chartRef = useRef();

    const [showAppointmentModal, setAppointmentModal] = useState(false);
    const [appointModalTitle, setAppointModalTitle] = useState("");
    const [AppointmentDetails, setAppointmentDetails] = useState({});

    var pageCount = 0;
    const [currentPage, setCurrentPage] = useState(0);
    const [numPerPage, setNumPerPage] = useState(5);


    const radios = [
        { name: 'สัปดาห์', value: '0' },
        { name: 'เดือน', value: '1' },
        { name: 'ปี', value: '2' },
      ];

    useEffect(() =>{
        fetchReportData();
        fetchService();
        if(dateRange == 0){
            setRangeName("รายสัปดาห์")
        }else if(dateRange == 1){
            setRangeName("รายเดือน")
        }else{
            setRangeName("รายปี");
        }
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
                    labels.push(item.date);
                }
                data.push(item.count);
                sumData_temp += item.count;
            }


            if(store.length >0){
                if(dateRange == 2){
                    setDateStart(store[0].date)
                    setDateEnd(store[store.length-1].date)
                }else{
                    setDateStart(moment(store[0].date).format("DD/MM/YYYY"))
                    setDateEnd(moment(store[store.length-1].date).format("DD/MM/YYYY"))
                }

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
        console.log(date)

        if(dateRange == 2){
            date_temp = moment(`${year}-${date}-01`).format("YYYY-MM-DD");
            console.log(date_temp)
        }else{
            date_temp = date;
        }

        console.log(date_temp)
        let json = await API_POST("appointment/service/",{
            service_id:service_id,
            date:date_temp,
            dateRange:dateRange
        });
        setCurrentPage(0);

        setAppointmentStore(json.data);
    }

    const onShowAppointment = (data) =>{
        setAppointModalTitle("รายละเอียดการนัดหมาย")
        setAppointmentDetails(data);
        setAppointmentModal(true);

    }

    const onClose = () =>{
        setAppointmentModal(false);
    }

    const getPagination = () => {
        let items = [];
        pageCount = Math.ceil(appointmentStore.length / numPerPage);

        for (let i = 0; i< pageCount; i++) {
            items.push(
                <Pagination.Item key={i}
                    active={currentPage == i}
                    onClick={onPageSelected}>{i + 1}</Pagination.Item>
            )
        }
        return items;
    }

    const onPageSelected = (d) => {
        var selectedPageNo = parseInt(d.target.innerHTML) -1;
        setCurrentPage(selectedPageNo)
    }

    const nextPage = () => {
        setCurrentPage(currentPage + 1);
    }

    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    }

    const firstPage = () => {
        setCurrentPage(0);
    }

    const lastPage = () => {
        setCurrentPage(pageCount - 1);
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
                    <div className="row m-4 justify-content-between">
                        <div className="shadow border rounded me-1" style={{backgroundColor:"#F2F3F4",width:"65%"}}>
                            {
                                getLineChart()
                            }
                        </div>
                        <div className="shadow border rounded pt-3" style={{backgroundColor:"#F2F3F4",width:"30%"}}>
                            {/* <div className="px-1 pt-2"> */}
                                <h5 className="text-center">สรุปข้อมูล</h5>
                                <p><b>ชื่อบริการ :</b>{service_name}</p>
                                <p><b>ประเภทช่วงเวลา :</b> {RangeName}</p>
                                <p><b>ช่วงเวลา : </b>{date_start} - {date_end}</p>

                                <div className="text-center mt-3 mx-5 shadow p-2">
                                    <h4>ยอดรวม</h4>
                                    <h3 className="text-success">{sumData}</h3>
                                    <h4>รายการ</h4>
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                        { appointmentStore.length >0 &&
                            <div className="container-fluid px-4 w-80">

                                {/* <div className="my-3 border-bottom">
                                    <div className="row pb-3">
                                        <div className="col-4">จำนวนนัดหมายที่แสดงใน 1 หน้า</div>
                                        <div className="col-8">
                                            <input type="number" step={1} value={numPerPage} onChange={(e) => setNumPerPage(e.target.value)} /> 
                                        </div>
                                    </div>
                                </div> */}

                                <div className="border rounded shadow" style={{backgroundColor:"rgba(201, 138 , 218, 0.9"}}>
                                    <div className="row text-center text-white">
                                        <div className="col-1">
                                            <p>#</p>
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
                                            <p>ผู้รับหน้าที่</p>
                                        </div>

                                        <div className="col-2">
                                            <p></p>
                                        </div>
                                    </div>

                                </div>
                                {
                                    appointmentStore.slice(currentPage * numPerPage, (currentPage * numPerPage) + numPerPage).map(item => (
                                        <AppointmentChartItem
                                            key={item.appoint_id}
                                            data={item}
                                            onShow={onShowAppointment}
                                        />
                                    ))
                                }
                                <div className="d-flex align-items-end flex-column mt-3">
                                    <div>
                                        <Pagination onSelect={onPageSelected}>
                                            <Pagination.First onClick={firstPage} />
                                            <Pagination.Prev disabled={currentPage == 0} onClick={prevPage} />
                                            { getPagination()}
                                            <Pagination.Next disabled={currentPage == pageCount -1} onClick={nextPage} />
                                            <Pagination.Last onClick={lastPage} />
                                        </Pagination>
                                    </div>
                                </div>
                            </div>
                        }

                </div>
                
            </div>

            <ShowAppointmentDetails 
            show={showAppointmentModal}
                title={appointModalTitle}
                onClose={onClose}
                data={AppointmentDetails}
            />  
        </>
    )
}