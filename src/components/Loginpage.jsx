import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Signup.css'
const Loginpage = () => {
      const [email,setemail] = useState('');
      const [password,setpassword] = useState('');
      const navigate=useNavigate();
      const handlesubmit=async(e)=>{
          e.preventDefault();
          try{
              const response=await fetch('http://localhost:5000/api/auth/login',{
                  method:'POST',
                  headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({email,password}),
                  credentials:'include',
              });
              if(!response.ok){
                  console.log('there is an error');
              }
              const data=await response.json();
              console.log('login is successful');
              navigate('/calender');
          }
          catch(err){
              console.log('there is an error oops',err);
          }
      }
  return (
    <div className='firstdiv'>
      <div className='signup'>
        <h5>Login now</h5>
      <form onSubmit={handlesubmit}>
        <input type="email" name="myemail" id="myemail" value={email} placeholder='enter your email' onChange={(e)=>setemail(e.target.value)}/>
        <input type="password" name="mypassword" id="mypassword" value={password} placeholder='enter your password' onChange={(e)=>setpassword(e.target.value)}/>
        <input type="submit" value="submit" />
        <p>don't have an account <Link to={'/signup'}>Sign up</Link> now</p>
      </form>
      </div>
    </div>
  )
}

export default Loginpage

