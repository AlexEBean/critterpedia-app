import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Register from "./components/Auth/Register"
import Login from './components/Auth/Login'
import Dash from './components/Dash/Dash'

export default (
    <Switch>
        <Route exact path='/' component = {Login}/>
        <Route path='/register' component = {Register}/>
        <Route path='/dash' component = {Dash}/>
    </Switch>
)