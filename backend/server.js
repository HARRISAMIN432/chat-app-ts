import dotenv from 'dotenv'
dotenv.config({quiet: true})

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import { connectDB } from './utils/db'

connectDB()

const app = express()
const httpServer = http.createServer(app)

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
}))

app.use(cookieParser())

try {
    const PORT = process.env.PORT || 4000
    httpServer.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
    })
}
catch(error) {
    console.error("The server failed to start", error);
    process.exit(1);
}