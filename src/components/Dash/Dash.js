import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import './Dash.css'
import {Link} from 'react-router-dom'

const Dash = (props) => {
    const [posts, setPosts] = useState([])
    const [search, setSearch] = useState("")

    useEffect(() =>{
        getAllPosts()
    }, [])

    const getAllPosts = async () => {
        try{
            const res = await axios.get(`/api/posts`)
            setPosts(res.data)
        } catch(err){
            console.log(err)
        }
    }

    const getPostsBySearch = async () => {
        try{
            const res = await axios.get(`/api/posts?search=${search}`)
            setPosts(res.data)
        } catch (err){
            console.log(err)
        }
    }

    const reset = () => {
        setSearch("")
        getAllPosts()
    }

    const mappedPosts = posts.map((post, index) => {
        return(
            <div className='dash-background' key={index} >
                <div className='container' >
                    <div className='post-container'>
                        <h5>{post.content}</h5>
                    </div>
                    <div className='username'>
                        <div className='link-box'>
                        <Link style={{textDecoration: "none", color: "white"}} to={post.user_id === props.user_id ? `/edit/${post.post_id}` : `/post/${post.post_id}`}>Go To Post</Link>
                        </div>
                        <h3> - {post.username} </h3>
                    </div>
                    <hr className='seperating-line'></hr>
                    <br></br>
                </div>
            </div>
            
        )
    })
    return(
        <div className='push'>
            <div
                className = "search-box"
            >
                <input 
                    name = "search"
                    value = {search}
                    placeholder = "Search..."
                    onChange = { e => setSearch(e.target.value)}
                />
                <button 
                    onClick = {getPostsBySearch} 
                    className = "search-btn"
                    >
                    Search
                    </button>
                <button 
                    onClick = {reset} 
                    className = "search-btn"
                    >
                    Reset Search
                </button>
            </div>
        <ul>{mappedPosts}</ul>
        </div>
    )
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(Dash)