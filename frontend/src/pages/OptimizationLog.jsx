import { useEffect, useState } from "react";
import "../styles/OptimizationLogs.css";

import api from "../api";
function OptimizationLogs(){
    const [optimizations, setOptimizations] = useState([])

    useEffect(() => {
        getAllOptimizations()
    }, [])


    function getAllOptimizations(){
        api.get('/api/saveOptimizationResult/').then((res)=>{
            if(res.status===200){
                setOptimizations(res.data)
            } else {
                alert('Error in getting optimization logs')
            }
        }).catch((err)=>{alert(err)})
    }

    function deleteOptimization(id){
        api.delete(`/api/deleteOptimizationResult/${id}/`).then((res)=>{
            if(res.status===204){
                alert('Optimization log deleted successfully')
                getAllOptimizations()
            } else {
                alert('Error in deleting optimization log')
            }
        }).catch((err)=>{alert(err)})
    }

    const startOpt = (opt) => {
        api.post('/api/task/',{workingTime:opt.result,token:opt.homeToken}).then((res)=>{
            if(res.status===200){
                alert('Optimization started')
                window.location.href="/chart/"+JSON.stringify(res.data)+'|'+opt.homeToken
            } else {
                alert('Error in starting optimization or you are not inside a home attached to this optimization log')
            }
        }).catch((err)=>{alert(err)})
        
    }

    return ( Object.keys(optimizations).length > 0 && 
    <div id="mainLogsContainer">
        <div id="topDiv"><h2>Automation Logs</h2><button onClick={()=>{window.location.href="/"}}>Back To Home</button></div>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Home Attached</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {optimizations.map((opt, index) => (
                    <tr key={index}>
                        <td>{opt.name}</td>
                        <td>{opt.homeAttached}</td>
                        <td>{new Date(opt.created_at).toLocaleString()}</td>
                        <td>
                            <button onClick={()=> startOpt(opt)}>Start</button>
                            <button onClick={() => deleteOptimization(opt.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    
    )   
}
export default OptimizationLogs;