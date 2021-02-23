require('dotenv').config()
const aws = require("aws-sdk")
const {AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET} = process.env

module.exports = {
    getProfilePic: async (req, res) => {
        const db = req.app.get('db')
        const {user_id} = req.params
        const profilePic = await db.picture.get_pic([user_id])
        res.status(200).send(profilePic[0].profile_pic)
    },

    config: (req, res) => {
        aws.config = {
            region: "us-west-2",
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY
        }

        const s3 = new aws.S3()
        const fileName = req.query["file-name"]
        const fileType = req.query["file-type"]
        const s3Params = {
            Bucket: S3_BUCKET,
            Key: fileName,
            Expires: 60,
            ContentType: fileType,
            ACL: "public-read"
        }

        s3.getSignedUrl("putObject", s3Params, (err, data) => {
            if (err) {
                console.log(err)
                return res.end()
            }
            const returnData = {
                signedRequest: data,
                url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
            }

            return res.send(returnData)
        })
    },
    deleteProfilePic: (req, res) => {
       
        aws.config = {
          region: "us-west-2",
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        };
  
        const {picUrl} = req.body

        const fileName = picUrl.replace(
            `https://${S3_BUCKET}.s3.amazonaws.com/`, ""
          )

        const s3 = new aws.S3();
        const params = {
          Bucket: S3_BUCKET,
          Key: fileName
        }
        s3.deleteObject(params, (err, data) => {
          if (err){
            console.log(err, err.stack)
          } 
          else{
            console.log("Sucess deleting from bucket")
          }
        })
    },

    updateProfilePic: async (req, res) => {
        const db = req.app.get("db")
        const {user_id, url} = req.body
        let update = await db.picture.update_profile_pic(+user_id, url)
        update = update[0]
        res.status(200).send(update)
    }

}