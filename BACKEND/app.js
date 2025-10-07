require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const { OtpRouter } = require("./src/routes/OtpRoutes")
const { AuthRoutes } = require("./src/routes/AuthRoutes")
const { Post } = require("./src/models/Posts")
const cookieParser = require("cookie-parser")
const { PostRoutes } = require("./src/routes/PostRoutes")

// Middleware
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser());

// Routes
app.use("/api", OtpRouter)
app.use("/api", AuthRoutes)
app.use("/api", PostRoutes)


// Database connection
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("GCC db Connect ")
}).catch(() => {
    console.log("DB Connection fail")
})


// Server 
app.listen(process.env.PORT, () => {
    console.log(`SERVER connected Succesful ${process.env.PORT}`)
})
