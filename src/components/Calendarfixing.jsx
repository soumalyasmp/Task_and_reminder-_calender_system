import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import io from 'socket.io-client';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoX } from "react-icons/go";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendarfixing.css';


import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);
const socket = io(process.env.NODE_ENV === 'production' 
    ? 'https://task-and-reminder-calender-system-4tefwq2t5.vercel.app/' // Replace with your production backend URL
    : 'http://localhost:5000' // Local development URL
);


const Calendarfixing = () => {
    const [date, setDate] = useState(new Date());
    const [user, setUser] = useState({ _id: '', username: '', email: '', password: '', events: [], daysleft: [] });
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [taskType, setTaskType] = useState('event');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showChatbot, setShowChatbot] = useState(false);
    const [chatMessages, setChatMessages] = useState([{ text: "Hello! Do you want to add an event or task? (Yes/No)", sender: "bot" }]);
    const [chatStep, setChatStep] = useState(0);



    const navigate=useNavigate();

    useEffect(() => {
        const checkauthentication=async()=>{
            try{
                const response= await fetch('http://localhost:5000/api/auth/check-auth',{
                    method:'GET',
                    credentials:'include',
                })
                if(!response.ok){
                    navigate('/');
                }
                console.log('cookies is present');
            }
            catch(err){
                console.log('there is error in here');
            }
        }
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/profile/', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) {
                    console.log('Error fetching data');
                    return;
                }
                const data = await response.json();
                console.log(data);
                setUser(data);
                                // Check events for task due today
                                data.events.forEach((event) => {
                                  const eventDate = moment(event.date);
                                  const currentDate = moment().startOf('day'); // Get current date without time
              
                                  if (eventDate.isSame(currentDate, 'day')) {
                                      setNotifications((prev) => [...prev, `Reminder: ${event.title} is scheduled for today!`]);
                                      socket.on('taskDue', (message) => {
                                        console.log('message is', message);
                                        setNotifications((prev) => [...prev, message]);
                                                // alert(`Task reminder ${event.title}`);
                                    });
                                    return () => {
                                      socket.off('taskDue');
                                  };

                                  }
                             
            });
            } catch (err) {
                console.log(err);
            }
        };
        checkauthentication();
        fetchProfile();
        return () => {
          socket.off('taskDue');
      };
    }
    , []);
  //   useEffect(() => {
  //     socket.on('taskDue', (message) => {
  //         console.log('message is', message);
  //         setNotifications((prev) => [...prev, message]);
  //                 alert(`Task reminder: ${events.title}`);
  //     });
  
  //     return () => {
  //         socket.off('taskDue');
  //     };
  // }, [user.events]);  // Make sure `user.events` is available and updated
  

    const handleSelect = (slotInfo) => {
        setSelectedDate(moment(slotInfo.start).format('YYYY-MM-DDTHH:mm:ss.SSSZ'));
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const response = await fetch('http://localhost:5000/api/profile/addevent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskType, title, description, date: selectedDate }),
                credentials: 'include',
            });

            if (!response.ok) {
                console.log('Error adding event');
                return;
            }

            const data = await response.json();
            console.log('Event added:', data);
            toast.success('Event added successfully!', { position: "top-right" });
            setShowModal(false);
            fetchProfile();

            // socket.emit('newTask', data); // Notify backend about the new task
        } catch (err) {
            console.log('Error:', err);
        }
    };
    const handlelogout=async()=>{
        try{
            const response=await fetch('http://localhost:5000/api/auth/logout',{
                method:'GET',
                credentials:'include',
            })
            if(!response.ok){
                console.log('there is error');
            }
            else{
                navigate('/');
            }
        }
        catch(err){
            console.log('there is error in logout',err);
        }
    }
    console.log('events are',user.events);
    console.log('length is',user.events.length);
    const handleChatResponse = (response) => {
        const lowerCaseResponse = response.toLowerCase();
        let newMessages = [...chatMessages];

        if (chatStep === 0) {
            if (lowerCaseResponse === 'yes') {
                newMessages.push({ text: "Is it an event or task?", sender: "bot" });
                setChatStep(1);
            } else {
                newMessages.push({ text: "Okay, let me know if you need anything!", sender: "bot" });
                setChatStep(0);
            }
        } else if (chatStep === 1) {
            if (lowerCaseResponse === 'event' || lowerCaseResponse === 'task') {
                setTaskType(lowerCaseResponse);
                newMessages.push({ text: "What is the title?", sender: "bot" });
                setChatStep(2);
            } else {
                newMessages.push({ text: "Please type 'event' or 'task'.", sender: "bot" });
            }
        } else if (chatStep === 2) {
            setTitle(response);
            newMessages.push({ text: "Provide a description.", sender: "bot" });
            setChatStep(3);
        } else if (chatStep === 3) {
            setDescription(response);
            newMessages.push({ text: "Event added successfully!", sender: "bot" });
            setChatStep(0);
            handleSubmit();
        }

        setChatMessages(newMessages);
    };

    return (
        <div className='calendar'>
                        <ToastContainer /> {/* Add ToastContainer here */}
                        <button className='logout-button' onClick={handlelogout}>Logout</button>
                  {/* Display events */}
            <Calendar localizer={localizer} selectable={true} onSelectSlot={handleSelect} />

                        {/* Floating Chatbot Button */}
                        <button className='chatbot-button' onClick={() => setShowChatbot(!showChatbot)}>💬</button>

{/* Chatbot Window */}
{showChatbot && (
    <div className='chatbot-window'>
        <div className='chatbot-messages'>
            {chatMessages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.sender === 'bot' ? 'bot' : 'user'}`}>
                    {msg.text}
                </div>
            ))}
        </div>
        <input
            type='text'
            className='chat-input'
            placeholder='Type here...'
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    handleChatResponse(e.target.value);
                    e.target.value = '';
                }
            }}
        />
    </div>
)}
            {showModal && (
                <div className='modal'>
                    <form onSubmit={handleSubmit} className='modal-form'>
                        <GoX onClick={() => setShowModal(false)} className='cls-btn' />
                        <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
                            <option value="event">Event</option>
                            <option value="task">Task</option>
                        </select>
                        <input type="text" value={title}  onChange={(e) => setTitle(e.target.value)} placeholder='Add title'/>
                        <textarea value={description} rows={5} cols={50} onChange={(e) => setDescription(e.target.value)} placeholder='Description'></textarea>
                        <input type="submit" value="Save" />
                    </form>
                </div>
            )}
    <div className="event-list">
    {notifications.length > 0 && (
    <div className='notifications'>
        {notifications.map((notif, index) => {
            // Ensure each notification is a string and handle any potential undefined or invalid data
            if (typeof notif !== 'string') {
                return null; // Avoid rendering invalid notifications
            }
            return (
                <p key={index} className='notification'>{notif}</p>
            );
        })}
        </div>
        )}
        <h3>Your Events</h3>
        <ul>
            {user.events.map((events, index) => (
                <li key={index} className="event-item">
                    <h4>Title: {events.title}</h4>
                    <p>Description: {events.description}</p>
                    <p><strong>Date: </strong> {moment(events.date).format('MMMM Do YYYY, h:mm:ss a')}</p>
                </li>
            ))}
        </ul>
    </div>



        </div>
    );
};

export default Calendarfixing;

