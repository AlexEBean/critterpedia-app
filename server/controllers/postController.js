module.exports = {

    getAllPosts: async (req, res) => {
        const db = req.app.get('db')
        const posts = await db.post.get_all_posts()
        res.status(200).send(posts)
    },

    getUserPosts: async (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.session.user
      
        const userPosts = await db.post.get_user_posts(+user_id)
        return res.status(200).send(userPosts)
      },
    addPost: async (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.session.user
        const {content} = req.body
  
        try {
            await db.post.add_post([+user_id, content])
            res.sendStatus(200)
        } catch(err) {
            console.log("Error in adding post", err)
            res.sendStatus(404)
        }
    },
  
      editUserPost: async (req, res) => {
        const db = req.app.get('db')
        const {post_id} = req.params
        const {content} = req.body

        const newPost = await db.post.edit_user_post([post_id, content])
        return res.status(200).send(newPost)
      },

      deletePost: async (req, res) => {
        const db = req.app.get('db')
        const {post_id} = req.params

        await db.post.delete_comments([post_id])

        await db.post.delete_post([post_id])
        return res.status(200).send("deleted")
      },
}