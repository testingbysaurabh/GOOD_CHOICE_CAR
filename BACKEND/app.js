require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const { OtpRouter } = require("./src/routes/OtpRoutes")



app.use(express.json())
app.use("/api", OtpRouter)



mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("GCC db Connect ")
}).catch(() => {
    console.log("DB Connection fail")
})
app.listen(process.env.PORT, () => {
    console.log(`SERVER connected Succesful ${process.env.PORT}`)
})


