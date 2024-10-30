import React, {useState} from 'react'
import axios from 'axios'
import api from '../api'

function TokenInputForm() {
  const [token, setToken] = useState('')
  const [homeAttached, setHome] = useState('')

  
  const addLongLivedToken = (e) => {
    e.preventDefault()
    api.post('/api/longLivedToken/',{token,homeAttached}).then((res)=>{
        if(res.status===201){
            alert('LLT Added Successfully')
            setToken('')
            setHome('')
        } else {
            alert('Error in adding LLT')
        }
    }).catch((err)=>{alert(err)})
    
  }
  return <div id="dialog">
          <h3>Add Long Lived Token</h3>
  	      <br />
          <form onSubmit={addLongLivedToken}>
              <label>Long Lived Token</label>
              <input type="text" value={token} onChange={(e)=>setToken(e.target.value)}/>
              <br />
              <br />
              <label>Home Name</label>
              <input type="text" value={homeAttached} onChange={(e)=>setHome(e.target.value)}/>
              <br />
              <br />
              <button type="submit">Add Token</button>
          </form>
        </div>
    
}
export default TokenInputForm;