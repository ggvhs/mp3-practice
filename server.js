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

const uploadAudio = (mp3filename, bucketname, file) => {

  return new Promise((resolve,reject) =>{
    const params = {
        Key: mp3filename,
        Bucket: bucketname,
        Body: file,
        ContentType: 'audio/mpeg',
        // ACL: 'public-read'
    }

    s3.upload(params, (err,data) =>{
        if (err){
            reject (err)
        } else {
            resolve (data)
        }
    })
  })
}

const deleteAudio = (mp3filename, bucketname) => {
    return new Promise((resolve, reject) => {
      const params = {
        Key: mp3filename,
        Bucket: bucketname
      };
      
      s3.deleteObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };

const bucket = 'mp3-practice'

app.post('/upload' , upload.single('audiofile'), async (req,res) =>{
    const filename = 'test upload'
    const bucketname = 'mp3-practice'
    const file = req.file.buffer
    console.log(file)
    const link = await uploadAudio(filename, bucketname, file)
    console.log(link)
    res.send('uploaded successfully :)')
})

app.delete('/delete', async (req, res) => {
    console.log('Delete request received'); // Log that a request has been received
    const { filename, bucketname } = req.body; // Expecting filename and bucketname in request body
  
    if (!filename || !bucketname) {
      console.log('Filename or bucketname missing'); // Log if filename or bucketname are missing
      return res.status(400).send('Filename and bucketname are required');
    }
  
    try {
      console.log(`Attempting to delete ${filename} from ${bucketname}`); // Log which file is being deleted
      await deleteAudio(filename, bucketname);
      console.log('Deletion successful'); // Log if deletion is successful
      res.send('Deleted successfully :)');
    } catch (error) {
      console.log('Error deleting file:', error); // Log any error that occurs during deletion
      res.status(500).send('Error deleting file');
    }
  });


app.listen(3000, () => {
    console.log('serving on 8000')
})