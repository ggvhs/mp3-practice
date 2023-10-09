import express from 'express'

const app = express()

app.use(express.static('front'))

app.get('s3Url', (req,res) =>{
    
})

app.listen(3000, () => console.log('listening on port 3000'))