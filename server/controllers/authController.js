const bcrypt = require("bcrypt")

module.exports = {

    register: async (req, res) => {
        const db = req.app.get('db')
        const {username, email, password} = req.body
        const existingUsername = await db.auth.check_username(username)
        const existingEmail = await db.auth.check_email(email)
        if (existingUsername[0]) {
            return res.status(409).send("User already exists with that email")
          }
        if (existingEmail[0]) {
          return res.status(409).send("User already exists with that email")
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        let profile_pic = `https://avatars.dicebear.com/api/identicon/${username}.svg`
        const [newUser] = await db.auth.register_user([username, email, profile_pic, hash])

        req.session.user = newUser

        res.status(200).send(req.session.user)
    },

    login: async (req, res) => {
        const db = req.app.get('db')
        const {email, password} = req.body
        const [foundUser] = await db.auth.check_email(email)
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
}