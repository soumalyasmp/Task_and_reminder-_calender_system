const express=require('express');
const{fetchprofile,addevent}=require('../controller/usercontroller');
const{protect}=require('../middleware/authmiddleware');
const router=express.Router();
// router.get('/getdays',protect,getdays)
module.exports=(io)=>{
    router.get('/',protect,(req,res)=>fetchprofile(req,res,io));
    router.post('/addevent',protect,(req,res)=>addevent(req,res,io));
    return router;
};