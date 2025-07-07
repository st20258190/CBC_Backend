import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function createUser(req, res) {
  const passwordHash = bcrypt.hashSync(req.body.password, 10);
  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: passwordHash,
  };
  const user = new User(userData);
  user
    .save()
    .then(() => {
      res.json({ message: "User created successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Failed to create user" });
    });
}

export function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    email: email,
  }).then((user) => {
    if (user == null) {
      res.status(404).json({
        message: "User not found",
      });
    } else {
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (isPasswordCorrect) {
        const token = jwt.sign(
          {
            id: user._id,
            email: user.email,
            role: user.role,
            isBlocked: user.isBlocked,
            isEmailVerified: user.isEmailVerified,
            image: user.image
          },process.env.JWT_SECRET)
        res.json({
          token:token,
          message: "login successful",
        });
      } else {
        res.status(403).json({
          message: "Incorrect Password",
        });
      }
    }
  });
}

export function isAdmin(req){
  if (req.user==null) {
    return false
  }
  if (req.user.role=="admin") {
    return true
  }else{
    return false
  }
}
