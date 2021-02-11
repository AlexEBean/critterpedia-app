import React, {useState} from 'react'
import axios from "axios"
import {useDispatch} from "react-redux"
import {useHistory} from "react-router-dom"
import {loginUser} from "../../redux/reducer"
import "./Register.css"

const Register = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const register = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post("/auth/register", {username, email, password})
            dispatch(loginUser(res.data))
            history.push("/dash")
            console.log(res.data)
        }
        catch(err) {
            console.log(err)
            alert("Email account already registered")
        }
    }

    const backToLogin = async (e) => {
        history.push("/")
    }

    return (
        <div className = "register">
            <form className = 'form'>
                <input className = 'input'
                        name = 'username'
                        value = {username}
                        placeholder = 'Username'
                        onChange = {e => setUsername(e.target.value)}
                        />
                <input className = 'input'
                        name = 'Email'
                        value = {email}
                        placeholder = 'Email'
                        onChange = {e => setEmail(e.target.value)}
                        />
                    <input className='input'
                        name = 'password'
                        type = 'password'
                        value = {password}
                        placeholder = 'Enter Password'
                        onChange = {e => setPassword(e.target.value)}
                        />
                    <button className='registerBtn' onClick = {register} > Register </button>
            </form>
            <div className='space'>
                <img className='authLogo' alt='logo' src='https://cdn.discordapp.com/attachments/789196106965319750/794260091326824499/writersblocklogo.png'></img>
                <button onClick={backToLogin} className='toLogin'>Already have an account?</button>
            </div>
        </div>
    )
}

export default Register