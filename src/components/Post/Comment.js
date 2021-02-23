import React from 'react'

const Comment = (props) => {

    const {comment} = props.comment

    return(
        <div>
            <p className = "comment">{comment}</p>
        </div>
    )
}

export default Comment