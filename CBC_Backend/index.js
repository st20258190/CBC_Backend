import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import userRouter from "./routers/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./routers/productRouter.js";

const app = express();
app.use(bodyParser.json());
app.use((req,res,next)=>{
  const value = req.header("Authorization")
  if (value!=null) {
    const token = value.replace("Bearer ","")
    jwt.verify(token,"cbc-6503",(err,decoded)=>{
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
const connectionString =
  "mongodb+srv://admin:123@cluster0.j9rpomg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Database Connected");
  })
  .catch(() => {
    console.log("fail to connect");
  });

app.use("/users", userRouter);
app.use("/products",productRouter)
app.listen(4000, () => {
  console.log("Server is Running on port 5000 ");
});
