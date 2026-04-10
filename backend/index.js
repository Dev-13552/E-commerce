import express from 'express'
import 'dotenv/config'
import connectDB from './database/connectDb.js'
import userRoute from './routes/userRoute.js'
import productRoute from './routes/productRoute.js'
import cartRoute from './routes/cartRoute.js'
import orderRoute from './routes/orderRoute.js'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"]
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))
app.get("/", (req, res) =>{
    res.send("This is the homepage")
})

app.use("/api/v1/user", userRoute)
app.use("/api/v1/product", productRoute)
app.use("/api/v1/cart", cartRoute)
app.use("/api/v1/orders", orderRoute)

app.listen(port, ()=>{
    connectDB()
    console.log("Server Started Successfully at", port)
})
