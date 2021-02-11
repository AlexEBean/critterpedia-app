import React, {useState} from "react"
import axios from "axios"
import {Link} from "react-router-dom"
import "./Forgot.css"
import "../Login.css"

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [toggle, setToggle] = useState(false)

    const sendResetLink = async () => {
        await axios.post('/forgotpassword', {email})
        setToggle(true)
    }

    return (
        <div className = 'forgot-password'>
            <div
                className = 'form password-form'>
                <p className = 'password-p'>{toggle ? "Email has been sent" :"An email will be sent to reset your password"}</p>
                <input 
                    className = 'input'
                    name = 'email'
                    value = {email}
                    placeholder = 'Email'
                    onChange = {e => setEmail(e.target.value)}
                />
                <button className = 'auth-btn password-btn' onClick = {sendResetLink}>Send Link</button>
            </div>

            <div className = 'space'>
                <img className = 'authLogo' alt = 'logo' src='https://cdn.discordapp.com/attachments/789196106965319750/794260091326824499/writersblocklogo.png'></img>
                <Link className = 'backToLogin' to = '/'>Back to Login</Link>
            </div>
        </div>
    )
}

export default ForgotPassword