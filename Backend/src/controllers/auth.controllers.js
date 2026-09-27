const userModel =require("../models/user.model")
const bcrypt =require('bcryptjs');
const jwt =require('jsonwebtoken');
const tokenBlacklistModel=require('../models/blacklistmodel')

async function registerUser(req,res){
    const { fullName, username, email, password } = req.body;
    const name = fullName || username;
    if(!name || !email || !password){
        return res.status(400).json({
            message:"Please provide name, email, and password"
        })
    }
    const isUserAlreadyExists = await userModel.findOne({ email })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await userModel.create({
        fullName: name, email, password:hashedPassword
    })

    const token = jwt.sign(
        {id:user._id, username:user.fullName},
        process.env.JWT_SECRET || "default_secret",
        {expiresIn:"1d"})
    res.cookie("token",token, { httpOnly: true })

    res.status(201).json({
        message:"User registered successfully",
        user:{
            id:user._id,
            username:user.fullName,
            fullName:user.fullName,
            email:user.email
        }
    })
}

async function loginUser(req,res) {
    const {email,password}=req.body
    const user=await userModel.findOne({email})
    if(!user){
        return res.status(400).json({
            msg:"Invalid email or password",
            message:"Invalid email or password"
        })
    }
    const isPasswordValid=await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            msg:"Invalid email or password",
            message:"Invalid email or password"
        })
    }
    const token =jwt.sign(
        {id:user._id,username:user.fullName},
        process.env.JWT_SECRET || "default_secret",
        {expiresIn:"1d"})
    res.cookie("token",token, { httpOnly: true })
    res.status(200).json({
        msg:"user loggedIn successfully",
        message:"user loggedIn successfully",
        user:{
            id:user._id,
            username:user.fullName,
            fullName:user.fullName,
            email:user.email
        }
    })
}

async function logoutUser(req,res) {
    const token=req.cookies.token
    if(token){
        await tokenBlacklistModel.create({token})
    }
    res.clearCookie("token")
    res.status(200).json({
        msg:"User logged out successfully.",
        message:"User logged out successfully."
    })
}

async function getMeController(req,res) {
    const user=await userModel.findById(req.user.id)
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
        message:"User details fetched successfully",
        user:{
            id:user._id,
            username:user.fullName,
            fullName:user.fullName,
            email:user.email
        }
    })
}
module.exports={
    registerUser,loginUser,logoutUser,getMeController
}