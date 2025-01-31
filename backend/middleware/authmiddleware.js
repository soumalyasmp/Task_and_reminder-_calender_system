const jwt=require('jsonwebtoken');
const user=require('../model/usermodel');
const asynchandler=require('express-async-handler');
const { compare } = require('bcrypt');
const protect=asynchandler(async(req,res,next)=>{
    let token;
    if(req.cookies&&req.cookies.token){
        try{
            token=req.cookies.token;
            console.log('token',token)
            const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
            console.log('decoded is',decoded);
            req.user=await user.findById(decoded.id).select('-password');
            console.log('authentication',req.user);
            next();
        }
        catch(err){
            res.status(401).json({message:'authorization failed:token error'});
        }
    }
})
module.exports={protect};