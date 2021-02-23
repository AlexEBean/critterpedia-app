module.exports = {
    getComments: async (req, res) => {
        const db = req.app.get('db')
        const {postId} = req.params
        const allComments = await db.comment.get_comments(postId)
        res.status(200).send(allComments)
    },

    addComment: async (req, res) => {
        const db = req.app.get('db')
        const {postId} = req.params
        const {comment} = req.body
  
        try {
            await db.comment.add_comment([+postId, comment])
            res.sendStatus(200)
        } catch(err) {
            console.log("Error in adding comment", err)
            res.sendStatus(404)
        }
    },
    getOnePost: async (req, res) => {
        const db = req.app.get('db')
        const {postId} = req.params
        const onePost = await db.comment.get_one_post(postId)
        res.status(200).send(onePost)
    },
    
    deleteComment: async (req, res) => {
        const db = req.app.get('db')
        const {comment_id} = req.params
        await db.comment.delete_comment([comment_id])
        res.status(200).send("Deleted")
    }
}