require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const cors = require('cors')
const authCtrl = require("./controllers/authController")
const postCtrl = require("./controllers/postController")
const picCtrl = require("./controllers/picController")
const commentCtrl = require("./controllers/commentController")
const {checkUser} = require("./middleware")

const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env

const app = express()

const path = require('path')

app.use(express.json())
app.use(cors())
app.use(express.static(`${__dirname}/../build`))

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

massive({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
}).then(database => {
    app.set("db", database)
    console.log("Connected to DB")
})

app.post("/auth/register", authCtrl.register)
app.post("/auth/login", authCtrl.login)
app.post("/auth/logout", authCtrl.logout)
app.get('/auth/refresh', authCtrl.refresh)
app.delete("/auth/delete", authCtrl.deleteUser)
app.post("/forgotpassword", authCtrl.forgotPassword)
app.put("/resetpassword/:passwordToken", authCtrl.resetPassword)
app.post("/auth/view", authCtrl.addView)


app.get("/api/posts", postCtrl.getAllPosts)
app.get("/api/user_posts", checkUser, postCtrl.getUserPosts) 
app.post("/api/post", checkUser, postCtrl.addPost)
app.put("/api/post/:post_id", checkUser, postCtrl.editUserPost)
app.delete("/api/post/:post_id", checkUser, postCtrl.deletePost)

app.get("/api/comments/:postId", commentCtrl.getComments)
app.post("/api/comments/:postId", checkUser, commentCtrl.addComment)
app.get("/dash/posts/:postId", commentCtrl.getOnePost)
app.delete("/api/comments/:comment_id", checkUser, commentCtrl.deleteComment)


app.get("/api/pic/:user_id", picCtrl.getProfilePic)
app.get("/api/signs3", checkUser, picCtrl.config)
app.post("/api/signs3", checkUser, picCtrl.deleteProfilePic)
app.put("/api/user", checkUser, picCtrl.updateProfilePic)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'))
  })

app.listen(SERVER_PORT, () => console.log(`Server is listening on port ${SERVER_PORT}`))