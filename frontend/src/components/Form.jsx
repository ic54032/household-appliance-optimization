import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";

function Form({ route, method }) {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [confirmPassword, setConfirmPassword] = useState("");
const navigate = useNavigate();

const name = method === "login" ? "Login" : "Register";

const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
        const res = await api.post(route, { username, password });
        if (method === "login") {
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            navigate("/");
        } else {
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
            navigate("/login");
        }

    } catch (error){
        if (error.response && error.response.status === 400) {
            alert("Username already exists!");
        } else {
            alert(error);
        }
    } finally {
        setLoading(false);
    }
}


return <form onSubmit={handleSubmit} className="form-container">
    <h1>{name}</h1>
    <input className="form-input" 
    type="text"
    value={username}
    onChange={e=>setUsername(e.target.value)}
    placeholder="Username">
    </input>

    <input className="form-input" 
    type="password"
    value={password}
    onChange={e=>setPassword(e.target.value)}
    placeholder="Password">
    </input>

    {method === "register" && (
    <input 
        className="form-input" 
        type="password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
    />
    )}

    <button className="form-button" type="submit">{name}</button>

    {name=="Login" && <p>Don't have an account? Click <a onClick={()=>navigate("/register")}>here</a> to register.</p>}
    {name=="Register" && <p>Already have an account? Click <a onClick={()=>navigate("/login")}>here</a> to login.</p>}

    </form>
}
export default Form;