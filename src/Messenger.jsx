import React, { useContext, useEffect, useRef, useState } from 'react'
import UserList from './components/UserList'
import UserChatBox from './components/UserChatBox'
import UserProfile from './components/UserProfile'
import io from 'socket.io-client'
import { UserContext } from '../provider/ContextPorvider'

let socket;

function Messenger() {

  const { user, onlineUsers, setonlineUsers, openedChat, setchatMessages, setopenedChat, setseen } = useContext(UserContext)
  const [userProfileShow, setuserProfileShow] = useState(false);

  useEffect(() => {
    if (socket && openedChat) {
      socket.emit('join', openedChat._id)
    }
  }, [openedChat]);

  const chatBoxRef = useRef()

  const reciveRef = useRef()





  useEffect(() => {
    socket = io('http://localhost:4000')

    if (socket && user) {
      socket.emit('addUser', user)

      socket.on('sobUsers', (users) => {
        setonlineUsers(users)
      })

      socket.on('pullUsers', (users) => {
        setonlineUsers(users)
      })

      socket.on('seen2', (props) => {
        setseen(props)
      })

      socket.on('reciveMessage', (props) => {
        // openedChat.latestMessage = props
        // setopenedChat(openedChat)'
        reciveRef.current.play()
        setchatMessages(prev => [...prev, props])
        if (chatBoxRef.current) {
          console.log('_')
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      })

    }
  }, []);

  return (
    <div className='flex h-screen overflow-hidden w-full relative justify-center'>

      <audio ref={reciveRef} className='' src="./wp-message-recive.mp3"></audio>


      <div className={`${openedChat ? 'hidden lg:block' : "block"} w-full  md:w-[430px] overflow-hidden text-white light-teal`}>
        <UserList socket={socket} onlineUsers={onlineUsers} setonlineUsers={setonlineUsers} />
      </div>
      <div className={`${openedChat ? 'block' : "hidden lg:block"} flex-grow teal h-screen`}>
        <UserChatBox chatBoxRef={chatBoxRef} socket={socket} />
      </div>
      <div className={` ${userProfileShow ? 'w-[320px]' : 'w-0'} tikkoren  h-screen duration-200 transform light-teal`}>
        <UserProfile setuserProfileShow={setuserProfileShow} userProfileShow={userProfileShow} />
      </div>

    </div>
  )
}

export default Messenger