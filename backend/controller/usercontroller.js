const express=require('express');
const User=require('../model/usermodel');
const fetchprofile=async(req,res,io)=>{
    try{
  const user=req.user;
  const taskswithdaysleft=user.taskdaysleft;
  const duetasks=taskswithdaysleft.filter(events=>events.daysLeft===0);
  if(duetasks.length>0){
    console.log('due tasks remaining');
    io.emit('taskDue', {
      title: 'Task Reminder',
      date: new Date(),  // Use the appropriate date
      description: 'This is a reminder for your task.',
  });
  }
  res.json({
    _id:user._id,
    username:user.username,
    email:user.email,
    password:user.password,
    events:user.events,
    taskdaysleft:user.taskdaysleft,
  })
  // console.log(user);
}
catch(err){
    console.log('there is error',err);
}
}
const addevent=async(req,res,io)=>{
  const{taskType,title,description,date}=req.body;
  try{
    const user=req.user;
    console.log('event adding user',user);
    const newevent={
      type:taskType,
      title:title,
      description:description,
      date:date,
    }
    console.log('event is adding',newevent);
    user.events.push(newevent);
    await user.save();
    res.status(200).json({message:'event added successfully for user'});
  }
  catch(err){
    res.status(400).json({message:'there is error'});
  }
}
module.exports={fetchprofile,addevent}
