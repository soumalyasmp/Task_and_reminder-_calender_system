const User=require('../model/usermodel');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

require('dotenv').config();
const signup=async(req,res)=>{
    const{username,email,password}=req.body;
    if(!username||!email||!password){
        return res.status(400).json({message:'email or password missing'});
    }
    try{
        const existinguser=await User.findOne({email});
        if(existinguser){
            return res.status(400).json({message:'user already exists'});
        }
        const user = new User({username,email,password});
        console.log('signup data of user',user);
        await user.save();
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'1d'});
        console.log('authentication controller token is',token);
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:'strict',
            maxAge:24*60*60*1000
        }
        )
        res.cookie('userid',user._id,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:'strict',
            maxAge:24*60*60*1000,
        })
        res.status(200).json({message:'user created successfully'});
    }
    catch(err){
        console.log('thre is an error in signup',err);
    }
}
const login=async(req,res)=>{
    const{email,password}=req.body;
    console.log('request arrived in login is',req.body);
    if(!email||!password){
        res.status(400).json({message:'all fields are required'});
    }
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:'email is not correct'});
        }
        const ispasswordcorrect=await bcrypt.compare(password,user.password);
        if(!ispasswordcorrect){
            res.status(400).json({message:'password is not correct'});
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'1d'});
        console.log('authentication controller token is',token);
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:'strict',
            maxAge:24*60*60*1000
        }
        )
        res.cookie('userid',user.id,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:'strict',
            maxAge:24*60*60*1000,
        })
        res.status(200).json({message:'user is successfully logged in'});
    }
    catch(err){
        console.log('there is error in login');
    }
}
const checkauthentication=async(req,res)=>{
    const token=req.cookies.token;
    if(!token){
        res.status(400).json({message:'authentication failed of calendar'});
    }
    else{
        res.status(200).json({message:'token is found'});
    }
}
const logout=async(req,res)=>{
    res.clearCookie('token');
    res.clearCookie('userid');
    res.status(200).json({message:'go to main page'});
}
module.exports={signup,login,checkauthentication,logout};