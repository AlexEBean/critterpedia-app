import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import {useHistory, Link} from 'react-router-dom'
import copyicon from '../../media/copyicon.png'
import trashicon from '../../media/trashicon.png'
import './Edit.css';

const Edit = (props) => {

    const [post, setPost] = useState({})
    const [comments, setComments] = useState([])
    const [input, setInput] = useState("")
    const [toggleDelete, setDelete] = useState(false)
    const history = useHistory()

    useEffect(() =>{
        getPost()
        getComments() 
    }, [])

    const getPost = async () => {
        const res = await axios.get(`/dash/posts/${props.match.params.post_id}`)
        setPost(res.data[0])
        setInput(res.data[0].content)
    }

    const getComments = async () => {
        const res = await axios.get(`/api/comments/${props.match.params.post_id}`)
        setComments(res.data)
    }

    const copyCodeToClipboard = (commentID) => {
          var copyText = document.getElementById(commentID)

          copyText.select();
          
          document.execCommand("copy")
    }

    const  handleCancel = () => {
        setInput(post.content)
    }

    const handleSave =  async () => {
        const res = await axios.put(`/api/post/${post.post_id}`, {content: input})
        setPost(res.data[0])
        history.push('/userposts')
    }

    const handleDelete = async () => {
        await axios.delete(`/api/post/${post.post_id}`)
        history.push('/userposts');
    }

    const handleCommentDelete = async (comment_id) => {
        await axios.delete(`/api/comments/${comment_id}`)
        getComments()
    }

    const mappedComments = comments.map((comment, index) => {
        return(
            <div key={comment.comment_id} className="editComments">
                <textarea name="" className="comment" id={`comment ${comment.comment_id}`} value={comment.comment} readOnly></textarea>
                <button 
                    className="copyButton" 
                    onClick={() => copyCodeToClipboard(`comment ${comment.comment_id}`)}>
                    <img alt="copy" src={copyicon}/>
                </button>

                <button 
                    className="copyButton" 
                    onClick={() => handleCommentDelete(comment.comment_id)}>
                    <img alt="trash" src={trashicon}/>
                </button>
            </div>
        )
    })


    return(
        <div className='push'>
            <div className="Edit">
                <div className="topOfEdit">
                    <Link  
                        to="/userposts">
                        <button className="backLink">{'<-Back'}</button>
                    </Link>
                </div>
                <div>
                    <textarea 
                        onChange={ e => setInput(e.target.value)} 
                        name="input" 
                        type="text" 
                        className="editContent" 
                        value={input}>
                    </textarea>
                </div>
                <div className="editButtons">
                    <button onClick={() => setDelete(true)}>Delete</button>
                    <div>
                        <button onClick={handleCancel}>Undo</button>
                        <button onClick={handleSave}>Save</button>
                    </div>
                </div>
                <div className={toggleDelete ? "confirmBackground" : "hideConfirm"}></div>
                <div className={toggleDelete ? "confirmDelete" : "hideConfirm"}>
                    <h5>Are you sure you want to delete? This cannot be undone.</h5>
                    <div className="confirmDeleteButtons">
                        <button onClick={() => setDelete(false)}>
                            Cancel
                        </button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                </div>

                <div>
                    {mappedComments}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => state
export default connect(mapStateToProps)(Edit)