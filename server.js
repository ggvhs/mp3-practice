require('dotenv').config()
const express = require('express');
const AWS = require('aws-sdk');

const multer = require('multer');
const { memoryStorage } = require('multer')
const storage = memoryStorage()
const upload = multer({ storage })

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//make a bucket 
// route post
//data

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID
})

const uploadAudio = () => {

    const params = {
        Key: mp3filename,
        Bucket: bucketname,
        Body: file,
        ContentType: ';audio/mpeg',
        ACL: 'public-read'
    }

    s3.upload(params, (err,data) =>{
        if (err){
            return (err)
        } else {
            return (data)
        }
    })
}

const bucket = "mp3-practice"

app.post('/upload' , (req,res) =>{
    console.log('uploaded')
})

app.listen(3000, () => {
    console.log('serving on 8000')
})