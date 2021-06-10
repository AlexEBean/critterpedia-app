import React, {useState, useEffect} from 'react'
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
    const [passCheck, setPassCheck] = useState("")
    const [filledOut, setFilledOut] = useState(false)
    const [passMatch, setPassMatch] = useState(false)

    useEffect(() => {
        if (password === passCheck) {
            setPassMatch(true)
        } else {
            setPassMatch(false)
        }
        if (username && email && password && passCheck) {
            setFilledOut(true)
        } else {
            setFilledOut(false)
        }

    }, [username, email, password, passCheck, passMatch])

    const register = async (e) => {
        e.preventDefault()
        try {
            if (!filledOut){
                alert("Please fill out all fields.")
            } else if (!passMatch){
                alert("Your passwords do not match.")
            } else {
                const res = await axios.post("/auth/register", {username, email, password})
                dispatch(loginUser(res.data))
                history.push("/dash")
            }
        }
        catch(err) {
            console.log(err)
            alert("Email account already registered")
        }
    }

    const backToLogin = async (e) => {
        history.push("/")
    }

    const inputsArr = [
        {name: "Username", type: "text", setState: setUsername},
        {name: "Email", type: "email", setState: setEmail},
        {name: "Password", type: "password", setState: setPassword},
        {name: "Confirm password", type: "password", setState: setPassCheck}
    ]

    return (
        <div className = "register">
            <form className = 'form'>
                <div className = "inputs">
                    {inputsArr.map(input => (
                            <input className = "input" placeholder = {input.name} type = {input.type} onChange={e => input.setState(e.target.value)} />
                            
                    ))}
                </div>
                <h4 className = "passwords-do-not-match" style = {{visibility: passMatch ? "hidden" : "visible"}}>
                    Passwords do not match.
                </h4>
                <button className = 'registerBtn' onClick = {register} > Register </button>
            </form>
            <div className = 'space'>
                <img className ='authLogo' alt='logo' src='https://cdn.discordapp.com/attachments/789196106965319750/794260091326824499/writersblocklogo.png'></img>
                <button onClick = {backToLogin} className='toLogin'>Already have an account?</button>
            </div>
        </div>
    )
}

export default Register