import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Register from "./components/Auth/Register"
import Login from './components/Auth/Login'
import Dash from './components/Dash/Dash'
import ForgotPassword from "./components/Auth/ForgotPassword/Forgot"
import Reset from './components/Auth/ForgotPassword/Reset'

export default (
    <Switch>
        <Route exact path = '/' component = {Login}/>
        <Route path = '/register' component = {Register}/>
        <Route path = '/forgotpassword' component = {ForgotPassword}/>
        <Route path='/reset/:resetid' component = {Reset}/>
        <Route path = '/dash' component = {Dash}/>
    </Switch>
)