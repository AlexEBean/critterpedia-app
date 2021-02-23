import React, {useState} from "react"
import {connect} from "react-redux"
import axios from "axios"
import {useHistory, Link} from "react-router-dom"
import "./CreatePost.css"

const CreatePost = (props) => {

    const {user_id} = props
    const [content, setContent] = useState("")
    const history = useHistory()

    const addPost = async (e) => {
        e.preventDefault()
        try {
            await axios.post("/api/post", {user_id, content})
            history.push("/userposts")
        } catch (err) {
            console.log(err)
        }
    }

    return(
        <div className='push'>
            <form className = "create-post">
                <textarea className = "post-input"
                    name = "content"
                    value = {content}
                    placeholder = "Enter your post"
                    onChange = {e => setContent(e.target.value)}
                />
                <Link
                    className = "submit"
                    onClick = {(e) => {
                        addPost(e)
                    }}
                > 
                    Submit Post
                </Link>
            </form>
            </div>
    )
}

const mapStateToProps = state => state
export default connect(mapStateToProps)(CreatePost)