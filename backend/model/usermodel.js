const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const moment=require('moment');
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        unique:true,
    },
    username:{
        type:String,
        required:true,
    },
    events:[{
            type:{
                type:String,
                enum:['event','task'],
                // required:true,
            },
            title:{
                type:String,
                // required:true,
            },
            description:{
                type:String,
                // required:true,
            },
            date:{
                type:Date,
                // required:true,
            }
        }]
    
});
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();
});
userSchema.virtual('taskdaysleft').get(function(){
    return this.events.map(events => ({
        ...events._doc, // Keep existing fields
        daysLeft: moment(events.date).diff(moment().startOf('day'), 'days') // Calculate days left
    }));
});
const User=mongoose.model('User',userSchema);
module.exports=User;