import React, { useState,useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import {Line} from 'react-chartjs-2'
import { CategoryScale, Chart as ChartJS, LineElement, LinearScale, PointElement, Legend } from 'chart.js'
ChartJS.register(LineElement, LinearScale, CategoryScale, PointElement, Legend);
import api from '../api'
import '../styles/Chart.css';

const Chart = () => {
    const param = useParams();
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const navigate = useNavigate();
    

    const createChart = (optOutput) => {
        console.log(optOutput)
        const datasets = Object.keys(optOutput).map((key) => ({
            label: key,
            data: optOutput[key],
            fill: false,
            borderColor: '#' + Math.floor(Math.random()*16777215).toString(16), // Random color
            tension: 0.1
        }));

        setChartOptions({
            scales: {
                x: {
                    min:0,
                    max:24
                },
                y: {
                    min:0,
                    max:1
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'right'
                }
            }
        });
        setChartData({
            labels: optOutput[Object.keys(optOutput)[0]].map((_, index) => `Hour ${index + 1}`),
            datasets
        });
    }

    const stopOpt = (e) => {
        e.preventDefault()
        api.get('/api/task/').then((res)=>{
            if(res.status===200){
                alert('Optimization ended')
                console.log(res.data)
            } else {
                alert('Error in ending optimization')
            }
        }).catch((err)=>{alert(err)})   
        navigate('/',{state:{from: '/chart'}})
    }

    useEffect(() => {
        if(param){
            createChart(JSON.parse(param.arg1.split('|')[0]))
        }
    },[param])

    const TurnOn = (e) => {
        console.log(e)
        const data=JSON.parse(param.arg1.split('|')[0])
        const token=param.arg1.split('|')[1]
        const date = new Date();
        var currentMinute = date.getMinutes(); //promijeni u sate
        data[e][ currentMinute==0 ? 23 : currentMinute-1 ]=1
        api.post('/api/turnOnDevice/',{entity_id:e,token:token}).then((res)=>{
            if(res.status===200){
                console.log('Device turned on')
                window.location.href="/chart/"+JSON.stringify(data)+'|'+token
            } else {
                alert('Error in turning on device')
            }
        }).catch((err)=>{alert(err)})
    }

    const TurnOff = (e) => {
        console.log(param.arg1.split('|')[0])
        const data=JSON.parse(param.arg1.split('|')[0])
        const token=param.arg1.split('|')[1]
        const date = new Date();
        var currentMinute = date.getMinutes(); //promijeni u sate
        data[e][ currentMinute==0 ? 23 : currentMinute-1 ]=0
        api.post('/api/turnOffDevice/',{entity_id:e,token:token}).then((res)=>{
            if(res.status===200){
                console.log('Device turned off')
                window.location.href="/chart/"+JSON.stringify(data)+'|'+token
            } else {
                alert('Error in turning off device')
            }
        }).catch((err)=>{alert(err)})
    }

    return <div>
                {Object.keys(chartOptions).length>0 && 
                (<div>
                <button onClick={stopOpt}>Stop Automation</button>
                <div id="chartWrapper">
                    <div id="optChart">
                        <Line data={chartData} options={chartOptions}/>
                    </div>
                </div>
                </div>)
                }
                <ul>
                    {Object.keys(JSON.parse(param.arg1.split('|')[0])).map((key,index) => (
                    <li key={index}>
                        <input type="text" disabled defaultValue={key}/>
                        <button onClick={()=>{TurnOn(key)}}>TurnOn</button>
                        <button onClick={()=>{TurnOff(key)}}>TurnOff</button>
                    </li>
                    ))}
                </ul>
            </div>

        
    ;
};

export default Chart;