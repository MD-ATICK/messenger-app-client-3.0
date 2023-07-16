import React, { useContext, useEffect, useRef } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { UserContext } from '../../provider/ContextPorvider'
import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { ClipLoader, PulseLoader, ScaleLoader } from 'react-spinners'
import moment from 'moment'
import { MdOutlineDoneAll } from 'react-icons/md'

function UserChatBox({ socket, chatBoxRef, setuserProfileShow, userProfileShow }) {

  const { openedChat, setopenedChat, messageSent, messageSendLoading, onlineUsers, nijerChats, chatMessages, user, allmsgLoading, seen, chats, setchats } = useContext(UserContext)

  const sendRef = useRef()

  const [messageText, setmessageText] = useState('');
  const [images, setimages] = useState([]);
  const [imageLoading, setimageLoading] = useState(false);
  const [typeing, setTypeing] = useState('');
  const [ishow, setishow] = useState(false);

  const randomGenerate = () => {
    const array = ['a', '#', '@', '&', 'f', 's', 'a', 'e', 'w', 'b', 'n', '1', '5', '8', '3']
    let generated = 'atick';
    for (let i = 0; i <= 10; i++) {
      const regx = Math.floor(Math.random() * 15)
      generated += array[regx]
    }
    return generated;
  }

  const changeHanlder = (e) => {
    const v = e.target.files
    for (let a = 0; a < v.length; a++) {
      const form = new FormData()
      form.append("image", v[a]);
      axios.post(`https://api.imgbb.com/1/upload?key=6226ca30d95b139a79184223cfbc266a`, form)
        .then((res) => setimages(prev => [...prev, { _id: randomGenerate(), image: res.data.data.url }]))
    }
  }

  const closeHanlder = (_id) => {
    const updatedimages = images.filter((each) => each._id !== _id)
    setimages(updatedimages)
  }

  const handleMessageSent = () => {
    setimages([])
    setmessageText('')
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
    if (socket) {
      socket.emit('nijerMessageSend', { sender: user._id, chat: openedChat, content: { text: messageText, images }, createdAt: new Date().toLocaleString() })
      socket.emit('stopTypeing', openedChat._id)
    }
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
    messageSent({ text: messageText, images })
    sendRef.current.play()
  }

  const hanldeMessageText = (e) => {

    if (messageText === '') return;

    if (e.key === 'Enter') {
      setimages([])
      setmessageText('')
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
      if (socket) {
        socket.emit('nijerMessageSend', { sender: user._id, chat: openedChat, content: { text: messageText, images }, createdAt: new Date().toLocaleString() })
        socket.emit('stopTypeing', openedChat._id)
      }
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
      messageSent({ text: messageText, images }, chatBoxRef)
      sendRef.current.play()
    }
  }

  const textsendHanler = (e) => {
    setmessageText(e.target.value)
    if (e.target.value.length > 0) {
      socket.emit('typeingMessage', { chatid: openedChat._id, sender: user })
    } else {
      setTimeout(() => {
        socket.emit('stopTypeing', openedChat._id)
      }, 1500);
    }

  }

  const BackHanlder = () => {
    if (socket) {
      openedChat && socket.emit('leaveRoom', openedChat._id)
      setopenedChat(null)
    }

  }

  const unseenFetch = async ({ message, chatid }) => {
    const token = localStorage.getItem('v3token')
    const { data, status } = await axios.post(`https://mesender-serverside-3-0.onrender.com/chat/unseen/${chatid}`, {
      thisMessage: {
        chat: message.chat._id,
        content: message.content,
        createdAt: message.createdAt,
        sender: message.sender
      }
    },
      { headers: { Authorization: `Bearer ${token}` } })
    if (status === 201) {
    }
  }


  useEffect(() => {

    if (socket) {

      socket.on('typeingStill', (sender) => {
        setTypeing(sender);
      });

      socket.on('newFriend', () => {
        nijerChats()
      })

      socket.on('stopTypeing', () => {
        setTypeing('');
      });

      socket.on('unseenOfflilne', ({ message, chatid }) => {
        unseenFetch({ message, chatid })
      })

      socket.on('unseen', ({ message, chatid }) => {
        if (chats) {
          const updatedChats = chats.map((chat) => {
            if (chat._id.toString() === chatid.toString()) {
              chat.unseenMessages.push(message);
              chat.latestMessage = message;
            }
            return chat;
          });
          setchats(updatedChats);
          unseenFetch({ message, chatid });
        }
        // if (chats) {
        //   let x = chats.find((chat) => chat._id.toString() === chatid.toString())
        //   if (x) {
        //     x.unseenMessages.push(message)
        //     x.latestMessage = message
        //     // setchats(chats)
        //     setchats([x])
        //   }
        // }
      })

      socket.on('sender', (message) => {
        if (openedChat) {
          openedChat.unseenMessages = [...openedChat.unseenMessages, message];
          openedChat.latestMessage = { content: message.content, sender: { _id: message.sender }, chat: message.chat, createdAt: message.createdAt }
          setopenedChat(openedChat);
        }
      });

      socket.on('test', (props) => {
        if (openedChat) {
          let chat = chats.find((c) => c._id === props.chat._id)
          // chat.latestMessage = props
          openedChat.latestMessage = { content: props.content, sender: { _id: props.sender }, chat: props.chat, createdAt: props.createdAt };
          setopenedChat(openedChat);
        }
      })

      socket.on('emptykor', (chatid) => {
        if (chats) {
          const updatedChats = chats.map((chat) => {
            if (chat._id.toString() === chatid.toString()) {
              chat.unseenMessages = []
            }
            return chat;
          });
          setchats(updatedChats);
        }
      })

      return () => {
        socket.off('typeingStill');
        socket.off('stopTypeing');
        socket.off('unseen');
        socket.off('sender');
        socket.off('test');
        socket.off('emptykor')
        socket.off('unseenOfflilne')
        socket.off('newFriend')
      };
    }
  }, [socket, chats, openedChat, setopenedChat]);

  const FindotherUser = openedChat && user && openedChat.users.find((c) => c._id.toString() !== user._id.toString())

  useEffect(() => {
    if (!allmsgLoading && chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }

  }, [allmsgLoading]);

  const otherUser = openedChat && user && openedChat.users.find((c) => c._id.toString() !== user._id.toString())

  return (
    <>
      {
        openedChat ?
          (
            <div className=' relative flex flex-col justify-between  h-full'>

              {/* <===>   Navbar   <===> */}
              <div className='flex h-[75px] py-2  bg-[#003435] px-4 justify-between items-center'>
                <audio ref={sendRef} src="./wp-message-send.mp3"></audio>
                <div className='flex items-center gap-x-1'>
                  <button onClick={BackHanlder} className='list-gradient py-[8px] px-4 rounded-md text-white  shadow-[#166a64] font-sans tracking-wide mr-4'>back</button>
                  <div className='h-9 w-9 relative'>
                    <img loading='lazy' src={openedChat && openedChat.users.find((c) => c._id.toString() !== user._id.toString()).avatar} className='w-full shadow-sm shadow-white h-full rounded-full object-cover' alt="" />
                    <p className={`h-4 w-4 rounded-full ${onlineUsers && onlineUsers.find((u) => u._id === otherUser._id) ? 'bg-green-500 block' : 'hidden'}  absolute  border-[3.5px] border-[#00393a] -top-1 -right-1 `}></p>
                  </div>
                  <h1 className=' font-jo tracking-[0.05em] capitalize text-white font-[500]'>{user && openedChat.users.find((c) => c._id.toString() !== user._id.toString()).username}</h1>
                </div>
                <div className='flex items-center gap-x-2'>
                  <button className='p-2 teal cursor-pointer rounded-lg'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="" className="w-5 h-5 hover:scale-105 duration-150">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>

                  </button>
                  <button className='p-2 teal cursor-pointer rounded-lg' >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="" className="w-5 h-5 hover:scale-105 duration-150">
                      <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </button>
                  <button onClick={() => setuserProfileShow(!userProfileShow)} className='p-1 teal cursor-pointer rounded-lg'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>

                  </button>
                </div>
              </div>


              {/* <===> chatBox <===> */}
              <div ref={chatBoxRef} className='overflow-y-scroll h-[700px] pb-12 lg:pb-16 mb-20  px-8 border-white'>
                <p className='  text-[#bebebe] mt-3 mb-6 text-[14px] lg:text-[18px] text-center  tracking-wide'>You aren't friends but you are able to start messeageing with <span className=' capitalize text-white font-[600] font-sans tracking-wide text-[16px]'>{user && openedChat.users.find((c) => c._id.toString() !== user._id.toString()).username}.</span></p>
                {
                  allmsgLoading ?
                    <p className='text-center'><PulseLoader color='teal' /></p> :
                    user && chatMessages && chatMessages.length !== 0 && chatMessages.map((message, index) => {
                      const { content, sender, createdAt } = message

                      // <==> Right Side -- Sender <==>
                      // <==> Right Side -- Sender <==>
                      if (sender._id.toString() === user._id.toString()) {

                        return <div key={index} className='flex items-end mb-3 flex-col justify-end relative'>
                          {
                            index === (chatMessages.length - 1) &&
                            <div className={`absolute rounded-full flex justify-center items-center ${onlineUsers && user && FindotherUser && onlineUsers.find((u) => u._id === FindotherUser._id) ? 'border-[#00a906]' : 'border-[#002a2a]'}  p-[2px] bottom-5 -right-[26px] text-[#cacaca]`} >
                              {
                                openedChat && openedChat.unseenMessages.length === 0 ?
                                  <img loading='lazy' src={openedChat.users.find((c) => c._id.toString() !== user._id.toString()).avatar} className={` h-4 w-4 rounded-full object-cover`} alt="" />
                                  :
                                  !messageSendLoading ? <MdOutlineDoneAll className='text-[18px] text-[#00b822]' /> : <MdOutlineDoneAll className='text-[18px] text-[#6d6d6d]' />
                              }
                            </div>
                          }
                          {
                            openedChat && chatMessages.length !== openedChat.unseenMessages.length && openedChat.unseenMessages.length > 0 && index === (messageSendLoading ? chatMessages.length - (2 + openedChat.unseenMessages.length) : chatMessages.length - (1 + openedChat.unseenMessages.length)) &&
                            <div className={`absolute rounded-full flex justify-center ${onlineUsers && user && FindotherUser && onlineUsers.find((u) => u._id === FindotherUser._id) ? 'border-[#00a906]' : 'border-[#002a2a]'} items-center p-[2px] bottom-5 -right-[26px] `} >
                              <img loading='lazy' src={openedChat.users.find((c) => c._id.toString() !== user._id.toString()).avatar} className={`h-4 w-4 rounded-full object-cover`} alt="" />
                            </div>
                          }

                          <div className='flex items-center justify-end flex-wrap gap-x-3'>
                            {
                              content.images.length > 0 && content.images.map((i, index) => {
                                return <Link to={i.image} key={index} target='_blank' >
                                  <img src={i.image} className='h-[70px] mb-1 lg:h-[150px] object-cover rounded-xl' alt="" />
                                </Link>
                              })
                            }
                          </div>
                          <p className='teal-gradient font-sans tracking-wide rounded-lg rounded-tr-none text-[14px] lg:text-[16px] py-2 px-3 text-white p-1'>{content.text}</p>
                          <p className=' text-[#8c8c8c] tracking-wide pr-2 pt-[2px] text-[10px]'>{moment(createdAt).format('LT')}</p>
                        </div>

                      } else {

                        // <==> Left Side -- Reciver <==>
                        // <==> Left Side -- Reciver <==>
                        return <div key={index} className='flex items-start mb-3 gap-x-2 justify-start'>
                          <img loading='lazy' className='h-9 w-9 rounded-full object-cover' src={sender.avatar} alt="" />
                          <div className='flex items-start flex-col justify-start'>
                            <div className='flex items-center gap-x-3'>
                              {
                                content.images.length > 0 && content.images.map((i, index) => {
                                  return <img loading='lazy' src={i.image} key={index} className='h-[70px] mb-1 lg:h-[150px] object-contain shadow-sm shadow-gray-300 bg-transparent rounded-xl' alt="" />
                                })
                              }
                            </div>
                            <p className=' white font-sans shadow-lg tracking-wide font-[600] rounded-lg rounded-tl-none text-[14px] lg:text-[16px] px-3 text-stone-600 py-2'>{content.text}</p>
                            <p className=' text-[#8c8c8c] tracking-wide pl-3 pt-[2px] text-[10px]'>{moment(createdAt).format('LT')}</p>
                          </div>
                        </div>

                      }
                    })
                }
                {
                  typeing !== '' &&
                  <div className='flex items-start gap-x-2 mt-4 justify-start'>
                    <img loading='lazy' className='h-9 w-9 rounded-full object-cover' src={typeing.avatar} alt="" />
                    <div className='flex items-start flex-col justify-start'>
                      <p className='light-teal flex items-center gap-x-2 font-sans tracking-wide rounded-xl px-3 text-white p-1'>typeing <PulseLoader color='white' size={8} /></p>
                    </div>
                  </div>
                }
              </div>


              <div className='flex absolute gap-5 items-center bottom-16 flex-wrap left-2 lg:left-52'>
                {
                  images && images.length > 0 && images.map((info, index) => {
                    const { _id, image } = info
                    return <div key={index} onMouseEnter={() => setishow(true)} onMouseLeave={() => setishow(false)} className='relative  bg-white rounded-lg shadow-gray-300'>
                      <img loading='lazy' src={image} alt="" className='  h-16 flex-grow  lg:h-20 overflow-hidden bg-transparent   rounded-lg object-cover' />

                      <div className={` ${ishow ? 'h-full' : 'h-0 overflow-hidden'} hidden rounded-lg lg:flex image-selected whitespace-nowrap justify-center transform duration-500 items-center text-[#ebe9e9]  absolute bottom-0 left-0 w-full`}>
                        <button className=''>
                          <p className=' font-sans tracking-wide font-[400]' onClick={() => closeHanlder(_id)} >close</p>
                        </button>
                      </div>
                      <div className={`block lg:hidden absolute -top-1 -right-3 teal-gradient py-[2px] px-1 text-[14px] z-50  rounded-md text-white`}>
                        <button className=' block lg:hidden'>
                          <p className=' font-sans tracking-wide font-[500]' onClick={() => closeHanlder(_id)}>close</p>
                        </button>
                      </div>

                    </div>
                  })
                }
              </div>

              {/* <==> Search bar <==> */}
              <div className='text-white  h-[55px] px-2 flex items-center justify-center list-gradient absolute bottom-0 left-0 w-full '>
                <div className='flex items-center gap-x-[4px]'>


                  <label htmlFor="filesvai">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[38px] h-[38px] rounded-lg hover:bg-teal-900 cursor-pointer p-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                    </svg>
                  </label>

                  <input multiple className='hidden' type="file" onChange={changeHanlder} id='filesvai' />



                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[38px] h-[38px] rounded-lg hover:bg-teal-900 cursor-pointer p-2 hidden lg:block">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[38px] h-[38px] rounded-lg hover:bg-teal-900 cursor-pointer p-2 hidden lg:block">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[38px] h-[38px] rounded-lg hover:bg-teal-900 cursor-pointer p-2 hidden lg:block">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>

                </div>


                <div className=' relative h-[40px] mx-1 flex-grow flex'>

                  {/* <==> search box <==> */}
                  <input type="text" value={messageText} onChange={textsendHanler} onKeyDown={hanldeMessageText} placeholder='send message ...' className=' font-sans tracking-wide teal font-[500] h-full px-12 text-[15px] outline-none placeholder:text-[#a7a7a7]  w-full rounded-full' />
                  <button className=' absolute rounded-full top-1/2 -translate-y-1/2 left-4 '><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  </button>

                  <button className=' absolute rounded-full top-1/2 -translate-y-1/2 right-3 '>
                    <img loading='lazy' className='h-6 w-6 cursor-pointer' src="./happy.png" alt="" />
                  </button>
                </div>
                <button onClick={handleMessageSent} className={`${messageText !== '' || images.length !== 0 ? 'block' : "hidden"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 p-[9px] rounded-lg ml-2 bg-[#002222] h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>

                <img loading='lazy' className={`sendbtn ${messageText === '' && images.length === 0 ? 'block' : 'hidden'} h-7 w-7 cursor-pointer`} src="./happy.png" alt="" />
              </div>
            </div >
          ) :
          (
            <div className='h-full w-full flex justify-center items-center'>
              <div className=' w-[450px] flex justify-center gap-y-4 items-center flex-col'>
                <img loading='lazy' className='w-[250px] mb-10' src="./messenger.svg" alt="" />
                <p className='text-white text-4xl font-bold'>Messenger App</p>
                <p className='text-[13px] text-[#878787] tracking-wide leading-6 text-center '>Lorem elit. Asperiores delectus ipsum dolor sit amet consectetur adipisicing elit. Hic eum itaque omnis quo, magni aspernatur illum consequuntur laborum facilis nihil</p>
              </div>
            </div>
          )
      }
    </>
  )
}

export default UserChatBox