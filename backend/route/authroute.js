const express=require('express');
const{signup,login,checkauthentication,logout}=require('../controller/authcontroller');
// const{protect}=require('./middleware/authmiddleware');
const router=express.Router();
router.post('/signup',signup);
router.post('/login',login);
router.get('/check-auth',checkauthentication);
router.get('/logout',logout);
module.exports=router;