import React, { useContext, useEffect, useRef, useState } from 'react'
import UserList from './components/UserList'
import UserChatBox from './components/UserChatBox'
import UserProfile from './components/UserProfile'
import io from 'socket.io-client'
import { UserContext } from '../provider/ContextPorvider'
import axios from 'axios'

let socket;

function Messenger() {

  const { offlineUsers, setofflineUsers, user, onlineUsers, setonlineUsers, openedChat, setchatMessages, setopenedChat, setseen } = useContext(UserContext)
  const [userProfileShow, setuserProfileShow] = useState(false);

  useEffect(() => {
    if (socket && openedChat) {
      socket.emit('join', openedChat._id)
    }
  }, [openedChat]);

  const chatBoxRef = useRef()

  const reciveRef = useRef()





  useEffect(() => {
    socket = io('https://mesender-serverside-3-0.onrender.com')

    if (socket && user) {

      socket.emit('addUser', user)

      socket.on('sobUsers', ({ users, activeUser }) => {
        setonlineUsers(users)
      })

      socket.on('pullUsers', (users) => {
        setonlineUsers(users)
      })

      socket.on('seen2', (props) => {
        setseen(props)
      })

      socket.on('reciveMessage', (props) => {
        reciveRef.current.play()
        setchatMessages(prev => [...prev, props])
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      })

      return () => {
        socket.off('sobUsers')
        socket.off('pullUsers')
        socket.off('seen2')
        socket.off('reciveMessage')
      }

    }

  }, []);



  return (
    <div className='flex h-screen overflow-hidden w-full relative justify-center'>

      <audio ref={reciveRef} className='' src="./wp-message-recive.mp3"></audio>

      {/* 1024 768*/}
      <div className={`${openedChat ? 'hidden  lg:block' : "block"} w-full  md:w-[430px] overflow-hidden text-white light-teal`}>
        <UserList socket={socket} onlineUsers={onlineUsers} setonlineUsers={setonlineUsers} />
      </div>
      <div className={`${openedChat ? 'block' : "hidden lg:block"} flex-grow teal h-screen`}>
        <UserChatBox setuserProfileShow={setuserProfileShow} userProfileShow={userProfileShow} chatBoxRef={chatBoxRef} socket={socket} />
      </div>
      <div className={` ${userProfileShow ? ' w-full lg:w-[320px]' : 'w-0'} tikkoren h-screen overflow-y-scroll duration-500 transform `}>
        <UserProfile setuserProfileShow={setuserProfileShow} userProfileShow={userProfileShow} />
      </div>

    </div>
  )
}

export default Messenger