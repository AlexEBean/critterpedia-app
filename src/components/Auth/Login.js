import React, {useState} from "react"
import axios from "axios"
import {loginUser} from "../../redux/reducer"
import {useDispatch } from "react-redux"
import {useHistory, Link} from "react-router-dom"
import "./Login.css"

const Login = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const history = useHistory()
    const dispatch = useDispatch()

    const login = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post("/auth/login", {username, password})
            dispatch(loginUser(res.data))
            history.push("/dash")
        }
        catch(err) {
            console.log(err)
            alert("Invalid email or password")
        }
    }

    return (
        <div className = "login">
            <form className = "form">
                <input className = "input"
                    name = "username"
                    value = {username}
                    placeholder = "Username"
                    onChange = {e => setUsername(e.target.value)}                
                />
                <input className = "input"
                    name = "password" 
                    type = "password"
                    value = {password} 
                    placeholder = "Enter Password" 
                    onChange = {e => setPassword(e.target.value)}
                />

                <Link to='/forgotpassword' className='forgotPasswordLink'>Forgot Password?</Link>
                <button className = "auth-btn" onClick = {login} > Login </button>
            </form>
            <div className = "space">
            <img className='authLogo' alt='logo' src='https://cdn.discordapp.com/attachments/789196106965319750/794260091326824499/writersblocklogo.png'></img>
                <Link to = "/register" className = "toRegister"> Need an account? </Link>
            </div>
        </div>
    )
}

export default Login