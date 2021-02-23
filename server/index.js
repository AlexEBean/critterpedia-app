require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const authCtrl = require("./controllers/authController")
const postCtrl = require("./controllers/postController")
const picCtrl = require("./controllers/picController");

const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env

const app = express()

const path = require('path')

app.use(express.json())
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


app.get("/api/posts", postCtrl.getAllPosts)
app.get("/api/user_posts", postCtrl.getUserPosts) 
app.post("/api/post", postCtrl.addPost)
app.put("/api/user_posts/:post_id", postCtrl.editUserPost)
app.delete("/api/user_Post/delete/:post_id", postCtrl.deletePost)


app.get("/api/pic/:user_id", picCtrl.getProfilePic)
app.get("/api/signs3", picCtrl.config)
app.post("/api/signs3", picCtrl.deleteProfilePic)
app.put("/api/user", picCtrl.updateProfilePic)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'))
  })

app.listen(SERVER_PORT, () => console.log(`Server is listening on port ${SERVER_PORT}`))