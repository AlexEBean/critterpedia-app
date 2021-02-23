import React, {useState, useEffect} from 'react'
import {connect} from "react-redux"
import axios from "axios"
import Comment from "./Comment"
import "./Post.css"

const Post = (props) => {

    const [content, setContent] = useState("")
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState([])
    const [add, setAdd] = useState(false)

    useEffect(() =>{
        getUserPost()
        getComments() 
    }, [])

    const getUserPost = async () => {
        try {
            const res = await axios.get(`/dash/posts/${props.match.params.post_id}`)
            setContent(res.data[0].content)
        } catch (err) {
            console.log(err)
        }
    }

    const getComments = async () => {
        const res = await axios.get(`/api/comments/${props.match.params.post_id}`)
        setComments(res.data)
        console.log(res.data)
    }

    const addComment = async (e) => {
        e.preventDefault()
        try {
            await axios.post(`/api/comments/${props.match.params.post_id}`, {comment})
            setComment("")
            getComments()
        } catch (err) {
            console.log(err)
        }
    }

    const mappedComments = comments.map((comment) => (
        <Comment
            key = {comment.comment_id}
            comment = {comment}
        />
    ))

    return(
        <div className='push'>
            <div className = "post">
                <p className = "content">{content}</p>
                {add
                    ?
                    <form className = "comment-form">
                        <textarea 
                            className = "comment-input"
                            name = "comment"
                            value = {comment}
                            placeholder = "Enter your comment"
                            onChange = {e => setComment(e.target.value)}
                        />
                        <button className = "comment-button"
                            onClick = {(e) => {
                                addComment(e)
                                setAdd(!add)
                            }}
                            > 
                            Submit 
                        </button>
                        <button className = "comment-button"
                            onClick = {() => {
                                setAdd(!add)
                            }}
                        >
                            Cancel
                        </button>
                    </form>
                    :
                    <button className = "comment-button"
                        onClick = {() => {
                            setAdd(!add)
                        }}
                    >
                        Add Comment
                    </button>
                }
                <ul className = "comments">
                    {mappedComments}
                </ul>
            </div>
        </div>
    )
}

const mapStateToProps = state => state
export default connect(mapStateToProps)(Post)