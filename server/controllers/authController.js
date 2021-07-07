const bcrypt = require("bcrypt")
const nodeOutlook = require('nodejs-nodemailer-outlook')
const crypto = require('crypto');

module.exports = {

    register: async (req, res) => {
        const db = req.app.get('db')
        const {username, email, password} = req.body
        const existingUsername = await db.auth.check_username(username)
        const existingEmail = await db.auth.check_email(email)
        if (existingUsername[0]) {
            return res.status(409).send("User already exists with that username")
          }
        if (existingEmail[0]) {
          return res.status(409).send("User already exists with that email")
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const profile_pic = `https://avatars.dicebear.com/api/identicon/${username}.svg`
        const [newUser] = await db.auth.register_user([username, email, profile_pic, hash])

        nodeOutlook.sendEmail({
            auth: {
                user: "writers-block-heroes@outlook.com",
                pass: "WB9Password!"
            },
            from: "writers-block-heroes@outlook.com",
            to: email,
            subject: "Welcome to Writers Block",
            html: `<p>Welcome to Writer's Block, ${username}!</p>` + 
                "<p>You're ready to get and give advice, expand your writing skills, improve your novels, and interact with other authors. We're happy you joined. Enjoy.</p>"
                ,

            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i)
            
        })

        req.session.user = newUser

        res.status(200).send(req.session.user)
    },

    login: async (req, res) => {
        const db = req.app.get('db')
        const {username, password} = req.body
        const [foundUser] = await db.auth.check_username(username)
        if(!foundUser){
            return res.status(401).send("Incorrect login information")
        }
        const authenticated = bcrypt.compareSync(password, foundUser.password)
        if( authenticated ){
            req.session.user = foundUser
            res.status(200).send(req.session.user)
        } else {
            res.status(401).send('Incorrect login information')
        }
    },

    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    },

    refresh: async (req, res) => {
        if (req.session.user){
           try{
                const {user_id} = req.session.user    
                const db = req.app.get('db')
                const [user] = await db.auth.refresh_user(+user_id)
                res.status(200).send(user)
           }  catch(err) {
                console.log("Error in refreshing", err)
                res.sendStatus(500)
            }
        }  else {
            res.sendStatus(200)
        }
    },

    deleteUser: async (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.session.user

        try {
            await db.auth.delete_user([+user_id])
            res.sendStatus(200)
        } catch(err) {
            console.log("Error in deleting account", err)
            res.sendStatus(500)
        }
    },

    forgotPassword: async (req, res) => {
        const db = req.app.get('db')
        const {email} = req.body
        const newEmail = await db.auth.check_email(email)

        if(!newEmail[0]){
            res.status(404).send("Email not recognized")
        } else {
            const token = crypto.randomBytes(20).toString('hex')
            await db.auth.forgot_password([token, email])
            nodeOutlook.sendEmail({
                auth: {
                    user: "writers-block-heroes@outlook.com",
                    pass: "WB9Password!"
                },
                from: 'writers-block-heroes@outlook.com',
                to: email,
                subject: "Reset Password",
                html: "<p>Hello,</p>" +
                    "<p>You are receiving this because you have requested to reset the password for your account. If you did not request this, please ignore this email and your password will remain unchanged.</p>"+

                    '<p>Click <a href="https://writers-block.xyz/#/reset/' + token + '">here</a> to reset your password.</p>' 
                    // +
                    // `<p>If link does not work copy and paste this into your browser:    http://writers-block.xyz/#/reset/${token}</p>`
                    ,
    
                onError: (e) => console.log(e),
                onSuccess: (i) => console.log(i)
                
            })

            res.status(200).send("Email sent");
        }
        
    },

    resetPassword: async (req,res) => {
        const db = req.app.get('db')
        const {passwordToken} = req.params
        const {password} = req.body

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const user = await db.auth.reset_password([passwordToken, hash])
        return res.status(200).send(user)
    }
}