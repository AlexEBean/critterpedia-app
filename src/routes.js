import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Register from "./components/Auth/Register"
import Login from './components/Auth/Login'
import ForgotPassword from "./components/Auth/ForgotPassword/Forgot"
import Reset from './components/Auth/ForgotPassword/Reset'
import Dash from './components/Dash/Dash'
import UserPosts from './components/UserPosts/UserPosts'
import CreatePost from './components/CreatePost/CreatePost'
import Post from './components/Post/Post'
import Edit from './components/Edit/Edit'

export default (
    <Switch>
        <Route exact path = '/' component = {Login}/>
        <Route path = '/register' component = {Register}/>
        <Route path = '/forgotpassword' component = {ForgotPassword}/>
        <Route path='/reset/:resetid' component = {Reset}/>
        <Route path = '/dash' component = {Dash}/>
        <Route path='/userposts' component = {UserPosts}/>
        <Route path='/createpost' component = {CreatePost} />
        <Route path='/post/:post_id' component = {Post}/>
        <Route path='/edit/:post_id' component = {Edit}/>
    </Switch>
)