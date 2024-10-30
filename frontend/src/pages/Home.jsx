import {useState,useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import api from '../api'
import '../styles/Home.css';
import TokenInputForm from './TokenInputForm'

function Home(){
    
    const [tokenList, setTokens] = useState([])
    const [selectedToken, setSelectedToken] = useState('')
    const [devices, setDevices] = useState([])
    const [workingTime, setWorkingTime] = useState({})
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [optimizationName, setOpimizationName] = useState('')



    useEffect(() => {
        const fetchTokens = async () => {
            await getTokenList();
        }
        fetchTokens();
    }, []);	

    useEffect(() => {
        if (tokenList.length > 0) {
            setSelectedToken(tokenList[0].id+","+tokenList[0].token+","+tokenList[0].homeAttached);
        }
    } , [tokenList]);

    const getTokenList = () => {
        api.get('/api/longLivedToken/')
        .then((res)=> res.data)
        .then((data)=>{setTokens(data)}).catch(err=>{alert(err)})
    };

    const deleteToken = (id) => {
    api.delete(`/api/longLivedToken/${id}/`).then((res)=>{
        if(res.status===204){
            alert('LLT Deleted Successfully')
            getTokenList()
            setSelectedToken(tokenList[0].id+","+tokenList[0].token);
        } else {
            alert('Error in deleting LLT')
        }
    }).catch((err)=>{alert(err)})
    
    }

    const showMyDevices = (token) => {
        api.get(`/api/showMyDevices/${token}/`).then((res)=>{
            console.log(res.data)
            setDevices(res.data)
        }).catch((err)=>{alert(err)})
    }

    const setDevicesAndWorkingTimes = (e, id) => {
        setWorkingTime({...workingTime,[id]: parseInt(e.target.value)})
    }

    const startOpt = (e) => {
        e.preventDefault()
        const crToken=selectedToken.split(",")[1]
        const values = Object.values(workingTime)
        if(!values.some((value) => value > 0 )){
            alert('At least one device should be selected for optimization by adding its working time')
            return
        }
        api.post('/api/task/',{workingTime,token:crToken}).then((res)=>{
            if(res.status===200){
                alert('Optimization started')
                api.post('/api/saveOptimizationResult/',{name: optimizationName,homeAttached:selectedToken.split(",")[2],homeToken:selectedToken.split(",")[1],result:workingTime}).then((res)=>{
                    if(res.status===201){
                        console.log('Optimization output saved')
                    } else {
                        console.log('Error in saving optimization output')
                    }
                }).catch((err)=>{alert(err)}) 
                window.location.href="/chart/"+JSON.stringify(res.data)+'|'+crToken
            } else {
                alert('Error in starting optimization')
            }
            
        }).catch((err)=>{alert(err)})     
    }

    function openModal() {
        setModalIsOpen(true);
      }
    
      function closeModal() {
        setModalIsOpen(false);
        getTokenList();
      }

    return <div>
                <div id='beforeOptStart'>
                    <div id="header">
                        <div>
                            <h2>Smart Home Optimization</h2>
                        </div>  
                        <div id="logoutButton">
                            <button onClick={()=>window.location.href="/optLogs"}>Automation Logs</button>
                            <button onClick={()=>window.location.href='/logout'}>Log Out</button>
                        </div>
                    </div>
                    <br />
                    <h3>Home Token</h3>
                    <div id="tokenDropdownAndButtons">
                        <div id="tokenDropdown">
                            <select 
                                defaultValue={tokenList[0]?.id+","+tokenList[0]?.token+","+tokenList[0]?.homeAttached}
                                onChange={(e) => {setSelectedToken(e.target.value)}}>
                                {tokenList.map((token, index) => (
                                <option key={index} value={token.id+","+token.token+","+token.homeAttached}>
                                {token.homeAttached}
                                </option>
                                ))}
                            </select>
                        </div>
                
                        <div id="tokenManipulation">
                            <button onClick={openModal}>Add Token</button>
                            <button onClick={() => deleteToken(selectedToken.split(",")[0])}>Delete Token</button>
                        </div>
                    </div>

                    { modalIsOpen && <div id="overlay"></div>}
                    <dialog open={modalIsOpen} onClose={closeModal}>
                        <TokenInputForm />
                        <button onClick={closeModal}>Close</button>
                    </dialog>
                    <br />
                    <button onClick={() => showMyDevices(selectedToken.split(",")[1])}>Show devices</button>

                    {
                        Object.keys(devices).length>0 &&
                            <><br />
                            <br />
                            <h3>List of devices</h3>

                            <form onSubmit={startOpt}>
                            <ul>
                                {devices.map((device, index) => (
                                <li key={index}>
                                    <input type="text" disabled defaultValue={device.entity_id.split(".")[1]}/>
                                    <input type="number" min="0" required defaultValue="0" max="24" onChange={(e) => setDevicesAndWorkingTimes(e,device.entity_id)}/>
                                </li>
                                ))}
                            </ul>
                            <br />
                            <h3>Optimization Name</h3>
                            <input type="text" required onChange={(e)=>(setOpimizationName(e.target.value))}/>
                            <br />
                            <br />
                            <br />
                            <button type="submit">Create optimiation model</button>
                            </form>
                        </>
                    }
                </div>
            </div>
}
export default Home;