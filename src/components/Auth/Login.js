import React, {useState, useEffect} from "react"
import axios from "axios"
import {loginUser} from "../../redux/reducer"
import {useDispatch } from "react-redux"
import {useHistory, Link} from "react-router-dom"
import logo from "../../media/logo.png"
import "./Login.css"

const Login = () => {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const history = useHistory()
    const dispatch = useDispatch()

    const login = async (e) => {
        e.preventDefault()
        try {
            if (!username || !password) {
                alert("Please fill out all fields.")
            } else {
                const res = await axios.post("/auth/login", {username, password})
                dispatch(loginUser(res.data))
                history.push("/dash")
            }
        }
        catch(err) {
            console.log(err)
            alert("Invalid email or password")
        }
    }

    useEffect (() => {
        updateViews()
    }, [])

    const updateViews = async () => {
        try{
            const page = "Login"
            await axios.post("/auth/view", {page})
        } catch(err) {
            console.log(err)
            alert("Error in updating view count")
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
                <img className ='authLogo' alt = 'logo' src = {logo}></img>
                <Link to = "/register" className = "toRegister"> Need an account? </Link>
            </div>
        </div>
    )
}

export default Login