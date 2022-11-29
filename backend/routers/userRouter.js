import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from '../models/userModel.js';
import { generateToken, isAuth, isAdmin } from "../utils";

const userRouter = express.Router();

userRouter.get(
  '/createAdmin',
  expressAsyncHandler(async (res,req)=>{
    try{
      const user = new User({
        name: 'admin',
        email: 'admin@exa.com',
        password: '123456',
        isAdmin: true,
      });
      const createUser = await user.save();
      res.send(createUser);
    }
    catch(err){
      res.status(500).send({
        message: err.message
      });
    }
  })
)

userRouter.get(
  '/createUser',
  expressAsyncHandler(async (res,req)=>{
    try{
      const user = new User({
        name: 'User',
        email: 'user@exa.com',
        password: '123456',
      });
      const createUser = await user.save();
      res.send(createUser);
    }
    catch(err){
      res.status(500).send({
        message: err.message
      });
    }
  })
)

userRouter.post(
  '/login',
  expressAsyncHandler(async (req,res)=>{
    const user = await User.findOne({email: req.body.email, password:req.body.password});
    if(user){
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      })
    } else {
      res.status(401).send({
        message: 'Invalid Email or Password',
      })
    }
  })
)

userRouter.get(
  'profile',
  isAuth,
  expressAsyncHandler(async (req,res)=>{
    const user = await User.findOne({email: req.body.email});
    if(user){
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      })
    } else {
      res.status(401).send({
        message: 'Something Error',
      })
    }
  })
)
userRouter.get(
  'listuser',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req,res)=>{
    const user = await User.find();
    if(user){
      res.send(user)
    } else {
      res.status(401).send({
        message: 'Something Error',
      })
    }
  })
)

export default userRouter;