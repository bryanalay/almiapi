const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const routesUser = require('../src/routes/user')
const cors = require('cors')
const PORT = process.env.PORT || 3003
const connectionString = process.env.MONGODB_URI
const app = express()
app.use(cors())
app.use(express.json())
app.use('/api',routesUser)

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(()=>{
    console.log('mongo conectado');
}).catch((error)=>console.log(error))

app.listen(PORT,()=>{
    console.log('Port 3003 runing...');
})