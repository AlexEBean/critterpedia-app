import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import axios from 'axios'
import './UserPosts.css'

const UserPosts = () => {

    const [myPosts, setMyPosts] = useState([])

    useEffect(() =>{
        getUserPosts() 
    }, [])

    const getUserPosts = async () => {
        const res = await axios.get("/api/user_posts")
        setMyPosts(res.data)
    }

    const mappedPosts = myPosts.map((post, index) => {
        return(
            <div key={index}>
                <Link key={index} to={`/post/${post.post_id}`} className="myPostLink">
                    <div className="userPost">
                        <p>{post.content}</p>
                    </div>
                </Link>
                    <div className="userPostButtons">
                        <h1> </h1> 
                        <Link to={`/edit/${post.post_id}`}><button>Revise</button></Link>
                    </div>
            </div>
        )
    })

    return(
        <div className='push'>
            <div className='userPosts'>
                {!myPosts[0] ? 
                    <div className="noPosts">
                        <h1>You don't have any posts</h1>
                        <Link  
                            to="/createpost">
                            <button className="startWriting">{'Start Writing Now'}</button>
                        </Link>
                    </div>
                :
                    <div className="usersPost">
                        <h1>Your Writings</h1>
                        {mappedPosts}
                    </div>
                }
            </div>
        </div>
    )
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(UserPosts)