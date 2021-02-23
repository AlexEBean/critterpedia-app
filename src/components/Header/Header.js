import React, {useEffect, useState, useCallback} from 'react'
import {Link, useHistory} from "react-router-dom"
import {connect, useDispatch} from "react-redux"
import {logoutUser, getUser} from "../../redux/reducer"
import axios from "axios"
import { v4 as randomString } from 'uuid'
import {useDropzone} from 'react-dropzone'
import {GridLoader} from 'react-spinners'
import {NavDropdown} from 'react-bootstrap'
import "./Header.css"

const Header = (props) => {

    const {user_id} = props.user
    const history = useHistory()
    const dispatch = useDispatch()
    const [pic, setPic] = useState("")
    const [isUploading, setUploading] = useState(false)
    const [show, setShow] = useState(false)
    const [del, setDelete] = useState(false)

    const logout = async () => {
        try {
            await axios.post('/auth/logout')
                dispatch(logoutUser())
                history.push('/')
                setShow(false)
        } catch (err){
            console.log(err)
        }
    }

    const getMe = useCallback(async () => {
        try{
            const res = await axios.get('/auth/refresh')
            if (res.data.user_id){
                dispatch(getUser(res.data))
                setPic(res.data.profile_pic) 
            }
        }catch(err){
            alert(err)
        }
    }, [dispatch])

    const getPic = useCallback(async () => {
        try {
            const res = await axios.get(`/api/pic/${+user_id}`)
            setPic(res.data)
          } catch (err) {
            console.log(err)
          }
      }, [user_id])

    useEffect(() =>{
        if(user_id){
            getPic()   
        }
        getMe() 
    }, [getPic, user_id, getMe])

    const getSignedReq = ([file]) => {
        setUploading(true)
        
        const fileName = `${randomString()}-${file.name.replace(/\s/g, '-')}`
        axios.get('/api/signs3', {
            params: {
                'file-name': fileName,
                'file-type': file.type
            }
        }).then(res => {
            const {signedRequest, url} = res.data
            uploadFile(file, signedRequest, url)
        }).catch(err => {
            console.log(err)
        })
    }

    const uploadFile = (file, signedRequest, url) => {
        const options = {
            headers: {
                'Content-Type': file.type
            }
        }
            
        deleteProfilePic()


        axios.put(signedRequest, file, options).then(() => {
            setPic(url)
            axios.put("/api/user", {user_id, url}).then((res) => {
            })
            setUploading(false)
        }).catch(err => {
            setUploading(false)
            if (err.response.status === 403){
                alert(`Your request for a signed URL failed with a status 403. Double check the CORS config and bucket policy in Matts repo.\n${err.stack}`)
            } else {
                alert(`Error: ${err.status}\n ${err.stack}`)
            }
        })
    }

    const deleteProfilePic = () => {
        try {
            axios.post("/api/signs3", {picUrl: pic})
        } catch (err) {
            console.log(err)
        }
    }

    const {getRootProps, getInputProps} = useDropzone({
        accept: "image/*",
        multiple: false,
        onDrop: (file) => {
            getSignedReq(file)
        }
    })

    const showDropdown = () => {
        setShow(true)
    }

    const hideDropdown = () => {
        setShow(false)
    }

    const deleteUser = async () => {
        await axios.delete (`auth/delete`)
        try {
            dispatch(logoutUser())
            setDelete(false)
            history.push("/")
        } catch (err) {
            console.log(err)
        }
    }

    const showDelete = () => {
        setDelete(true)
    }

    const cancelDelete = () => {
        setDelete(false)
    }

        return (
            <div>
                {user_id
                ?
                <div className = "header">
                    <Link to='/dash'><img className='logo' alt='logo' src='https://cdn.discordapp.com/attachments/789196106965319750/794260091326824499/writersblocklogo.png'></img>
                    </Link>
                    <Link to = "/createpost"
                        className = "link"
                        id = "createpost"
                    >
                        Add Post
                    </Link>
                    <Link to = "/userposts"
                        className = "link"
                        id = "userposts"
                    >
                        Your Posts
                    </Link>
                    <Link to = "/dash"
                        className = "link"
                        id = "dash"
                    >
                        All Posts
                    </Link>
                    <div className='drop'>
                    <NavDropdown title = {isUploading 
                        ? 
                            <GridLoader/> 
                        : 
                            
                            <img className = "profile-pic" alt = "profile-pic" src = {`${pic}`}/>
                        }  
                            id="basic-nav-dropdown" 
                            className = "dropdown"
                            show={show}
                            onMouseEnter={showDropdown} 
                            onMouseLeave={hideDropdown}
                            >
                            <div className = "dropdown-menu">
                                <NavDropdown.Item>
                                        <div className = "update-button">
                                            <div {...getRootProps({className: "drop-zone"})}>
                                                <input {...getInputProps()} />
                                                <h3 className='h3'>Update Profile Picture</h3>
                                            </div>
                                        </div>
                                </NavDropdown.Item>
                                <hr className='hrHeader'></hr>
                                <NavDropdown.Item
                                        to = "/"
                                        className = "dropdown-btn"
                                        id = "logout"
                                        onClick = {logout}
                                    >
                                        Logout
                                </NavDropdown.Item>
                                <hr className='hrHeader'></hr>
                                <NavDropdown.Item
                                        className = "dropdown-btn"
                                        id = "delete"
                                        onClick = {showDelete}
                                    >
                                        Delete Account?
                                </NavDropdown.Item>
                            </div>
                    </NavDropdown>
                        <div className = {del ? "confirmBackground" : "hideConfirm"}></div>
                        <div className = {del ? "confirmDelete" : "hideConfirm"}>
                            <h5>Are you sure you want to delete your account? This cannot be undone</h5>
                            <div className="confirmDeleteButtons">
                                <button onClick = {cancelDelete} >Cancel</button>
                                <button onClick = {deleteUser} >Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
                :
                    null
                }
            </div>
        )
}

const mapStateToProps = state => state

export default connect(mapStateToProps, {logoutUser, getUser})(Header)