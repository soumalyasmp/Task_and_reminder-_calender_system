import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Calendarfixing from './components/Calendarfixing'
import Loginpage from './components/Loginpage'
import Signup from './components/Signup'
import { BrowserRouter,Routes,Route } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Loginpage/>}/>
      <Route path="/calender" element={<Calendarfixing/>}/>
      <Route path="/Signup" element={<Signup/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
