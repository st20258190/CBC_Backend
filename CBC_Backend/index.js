import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./routers/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./routers/productRouter.js";
import dotenv from "dotenv";
dotenv.config()

const app = express();
app.use(bodyParser.json());
app.use((req,res,next)=>{
  const value = req.header("Authorization")
  if (value!=null) {
    const token = value.replace("Bearer ","")
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
      if (decoded==null) {
        res.status(403).json({
          message:"unAuthorized User"
        })
      } else {
        
        req.user=decoded
        next()
      }

    })
  }else{
    next()
  }
  

})
const connectionString = process.env.MONGO_URI;
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Database Connected");
  })
  .catch(() => {
    console.log("fail to connect");
  });

app.use("/api/users", userRouter);
app.use("/api/products",productRouter)
app.listen(4000, () => {
  console.log("Server is Running on port 5000 ");
});
