import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom';

import './Signup.css'
const Signup = () => {
    const [username,setusername] = useState('')
    const [email,setemail] = useState('');
    const [password,setpassword] = useState('');
    const navigate=useNavigate();
    const handlesubmit=async(e)=>{
        e.preventDefault();
        try{
            const response=await fetch('http://localhost:5000/api/auth/signup',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({email,username,password}),
                credentials:'include',
            });
            if(!response.ok){
                console.log('there is an error');
            }
            const data=await response.json();
            console.log('signup is successful');
            navigate('/calender');
        }
        catch(err){
            console.log('there is an error oops',err);
        }
    }
  return (
    <div className='firstdiv'>
      <div className='signup'>
        <h5>Sign In now</h5>
      <form onSubmit={handlesubmit}>
        <input type="text" name="myname" id="myname" value={username} placeholder='enter your name' onChange={(e)=>setusername(e.target.value)}/>
        <input type="email" name="myemail" id="myemail" value={email} placeholder='enter your email' onChange={(e)=>setemail(e.target.value)}/>
        <input type="password" name="mypassword" id="mypassword" value={password} placeholder='enter your password' onChange={(e)=>setpassword(e.target.value)}/>
        <input type="submit" value="submit" />
      </form>
    </div>
    </div>
  )
}

export default Signup
