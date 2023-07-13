import express from 'express'
import dotenv from 'dotenv'
import rootRouter from './Routes/root'
import cors from 'cors'
import handleRequestLogs from './Middleware/Logs/reqLogs'
import mongoose from 'mongoose'
import connectDB from './Models/dbConnect'
import cookieParser from 'cookie-parser'
import path from 'path'

const app = express()
dotenv.config()

connectDB()

mongoose.connection.once('open', ()=>{
   app.listen(3500, ()=> console.log('[ * ] Servidor iniciado'))
})

app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors({credentials: true, origin: ['http://192.168.2.52','http://localhost']}))
app.use(handleRequestLogs)
app.use("/uploads",express.static(path.join(__dirname,'..', 'public','uploads')))
app.use('/', rootRouter)
