import React, { useContext, useEffect, useRef, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { TbLogout2 } from 'react-icons/tb'
import { UserContext } from '../../provider/ContextPorvider'
import { PulseLoader } from 'react-spinners'
import moment from 'moment'
import { MdOutlineDoneAll, MdToken } from 'react-icons/md'
import axios from 'axios'


function UserList({ onlineUsers, setonlineUsers, socket }) {

    const { LogoutUser, users, user, reset, setreset, nijerchatLoading, FriendchatBoxFetch, chats, setopenedChat, openedChat, search, setsearch, chatLoading, setchatLoading, seen } = useContext(UserContext)

    const [usersnew, setusersnew] = useState(users ? users : null);
    const unreadArray = ''


    const UserFilterHanlder = (e) => {
        if (users) {
            const searchValue = e.target.value.trim()
            setsearch(searchValue)
            if (searchValue.length > 0 && searchValue !== '' && searchValue) {
                const updateUsers = users.filter(({ username }) => username.toLowerCase().includes(searchValue.toLowerCase()))
                return setusersnew(updateUsers)
            }
            setusersnew(users)
        }
    }


    const logoutkorle = () => {
        LogoutUser(socket)
    }

    const chatHanlder = async (chat) => {
        if (openedChat && socket) {
            socket.emit('leaveRoom', openedChat._id)
        }
        const token = localStorage.getItem('v3token')
        let chater = chats.find((c) => c._id === chat._id)
        if (chater.unseenMessages.length > 0 && user && chater.unseenMessages[0].sender !== user._id.toString()) {

            chater.unseenMessages = []
            setopenedChat(chater)
            socket.emit('unempty', { chat, userid: user._id })
            const { data, status } = await axios.put('http://localhost:4000/chat/unseenRemove', { chatid: chat._id }, { headers: { Authorization: `Bearer ${token}` } })
        } else {
            setopenedChat(chat)
        }

    }

    if (socket) {
        socket.on('offlineUser', (users) => {
            setonlineUsers(users)
        })


    }

    return (
        <div className='p-4'>
            <div className='flex justify-between items-center'>
                <div title={user && user._id} className='flex items-center gap-x-3'>
                    <img src={user && user.avatar} className='w-10 shadow-sm shadow-white h-10 rounded-xl object-cover' alt="" />
                    <h1 className=' font-sans tracking-[0.01em] lowercase text-gray-200 font-[500]'>@{user && user.username}</h1>
                </div>
                <div className='flex items-center gap-x-2'>
                    <button className='p-2 teal cursor-pointer rounded-lg'>
                        <BsThreeDots className='text-white' />
                    </button>
                    <button className='p-[6px] teal cursor-pointer rounded-lg'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </button>
                    <button onClick={logoutkorle} className='p-[6px] text-xl teal cursor-pointer rounded-lg'>
                        <TbLogout2 className='text-orange-600' />
                    </button>
                </div>
            </div>
            <div className=' relative h-[50px] mt-6 flex'>
                <input type="text" value={search} onChange={UserFilterHanlder} placeholder='Search user ...' className=' font-sans tracking-wide teal font-[500] h-full px-4 pl-12 text-[15px] outline-none placeholder:text-[#a7a7a7]  w-full rounded-lg' />
                <button className=' absolute rounded-full top-1/2 -translate-y-1/2 left-4 '><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                </button>
            </div>
            <div className='py-2'>
                {/* <p className=' text-gray-200 pb-2 font-sans font-[500] tracking-wide text-[14px]'>Online Users</p> */}
                <div className='flex items-center gap-x-2'>
                    {user && chats && onlineUsers.map((u, index) => {
                        if (u._id.toString() !== user._id.toString() && chats.find((chat) => chat.users[0]._id === u._id || chat.users[1]._id === u._id)) {
                            return <div key={index} title='online user' className=' relative'>
                                <img className='h-10 w-10 shadow-sm shadow-white rounded-full object-cover' src={u.avatar} alt="" />
                                <p className='h-[10px] w-[10px] absolute top-[2px] -right-[1px] bg-green-500 rounded-full'></p>
                            </div>
                        }
                    })}
                </div>

            </div>
            <p className={`${search.length > 0 && usersnew.length > 0 ? 'flex' : 'hidden'} text-center text-[#a8a8a8] items-center justify-center gap-x-2 text-[13px] pt-1 tracking-wide`}>
                <span>{usersnew && usersnew.length}</span> user found .
            </p>
            <p className={`${search.length > 0 && usersnew.length === 0 ? 'flex' : 'hidden'} text-[#a8a8a8] text-right flex items-center justify-center gap-x-2 text-[13px] pt-1 tracking-wide`}>
                <span>No</span> user found .
            </p>


            <div className='mt-4 h-[540px] scroll-smooth  overflow-scroll userlist flex flex-col gap-y-[4px]'>
                <p className={`${search.length === '' && chats && chats.length > 0 ? 'flex' : 'hidden'} text-right text-[#c5c5c5] pb-1 font-[500] text-[14px] flex items-center  justify-end gap-x-2 font-sans tracking-wide`}>
                    <span>{chats && chats.length}</span>Chat Friend Here
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#c5c5c5" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#c5c5c5" className="w-5 h-5"> <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /> </svg>
                </p>
                {
                    chatLoading ?
                        <div className='text-cener flex justify-center'> <PulseLoader size={14} color='teal' /></div>
                        :
                        (!chatLoading && search !== '' && usersnew && usersnew.length > 0 && usersnew.map((user, index) => {
                            const { _id, username, avatar } = user
                            return <div key={index} onClick={() => FriendchatBoxFetch(user, socket)} title={_id} className='flex items-center gap-x-3 hover:bg-teal-800 cursor-pointer p-2 px-4 rounded-full'>
                                <div className='fetchCZuser relative w-9 h-9 title'>
                                    <img src={avatar ? avatar : "./img-1.webp"} className='w-full shadow-sm shadow-white h-full rounded-full object-cover' alt="" />
                                    {onlineUsers.find((i) => i._id === user._id) && <p className='h-[9px] w-[9px] bg-green-500 rounded-full absolute -top-[0px] -right-[2px]'></p>}
                                </div>
                                <h1 className=' lowercase font-sans tracking-wider text-white text-[14px] font-[500]'>@{username}</h1>
                            </div>
                        }))
                }

                {/* <==> Chat Box Users <==> */}
                {/* <==> Chat Box Users <==> */}
                {
                    search === '' && user && chats && chats.length > 0 && chats.map((chat, index) => {
                        const f = chat.users.find((x) => x._id.toString() !== user._id.toString())
                        const { avatar, username, _id } = f
                        let userUnseened = false;
                        if (chat.unseenMessages.length > 0 && user) {
                            userUnseened = chat.unseenMessages[0].sender.toString() === user._id.toString() ? false : true
                        }
                        console.log(userUnseened)
                        return <div key={index} onClick={() => chatHanlder(chat)} title={_id} className={` ${openedChat && openedChat._id.toString() === chat._id.toString() ? 'bg-teal-900' : ' bg-transparent'} flex items-center gap-x-3 hover:bg-teal-800 relative cursor-pointer p-[6px] px-4 pr-8 rounded-full`}>
                            {openedChat && openedChat._id.toString() === chat._id.toString() && <p className=' font-sans text-green-500 tracking-wide absolute top-1 right-10 font-[600] text-[14px]'>Actived Chat</p>}
                            {userUnseened ? <p className='h-[18px] w-[18px] rounded-md bg-sky-600 absolute top-[5px] right-4 flex justify-center items-center font-sans font-[500] text-[11px]'>{chat.unseenMessages.length}</p>
                                :
                                <div className={` ${chat.latestMessage && chat.latestMessage.sender._id === user._id ? 'block' : 'hidden'} absolute top-2 right-3`}>
                                    {user && chat.unseenMessages.length === 0 ? <img src={chat.users.find((c) => c._id.toString() !== user._id.toString()).avatar} className='h-[18px] w-[18px] rounded-full object-cover' alt="" /> : <MdOutlineDoneAll className='text-[17px] rounded-full text-white' />}
                                </div>
                            }
                            {/* {
                                    !userUnseened &&
                                } */}
                            <div className=' relative w-12 h-10 title'>
                                <img src={avatar ? avatar : "./img-1.webp"} className='w-full shadow-sm shadow-white h-full rounded-full object-cover' alt="" />
                                {onlineUsers.find((i) => i._id === _id) && <p className='h-[9px] w-[9px] bg-green-500 rounded-full absolute -top-[0px] -right-[2px]'></p>}
                            </div>
                            <div className='flex w-full flex-col'>
                                <div className=' flex justify-between items-center w-full'>
                                    <h1 className={`font-sans tracking-wider ${userUnseened ? 'text-white font-[600]' : 'text-[#b5b5b5] font-[600]'}  text-[14px] capitalize `}>{username}</h1>
                                </div>
                                <div className={`text-[#cdcdcd] text-right flex items-center justify-between capitalize gap-x-2 text-[12px]  tracking-wide`}>
                                    <span className={` lowercase fpmt  ${userUnseened ? 'text-white' : 'text-[#b5b5b5]'} `} > {user && chat.latestMessage ? `${chat.latestMessage.sender._id === user._id ? 'you' : 'he'} : ${chat.latestMessage.content.text.length < 15 ? chat.latestMessage.content.text : chat.latestMessage.content.text.slice(0, 13) + '...'}` : `${user && user._id === chat.users[0]._id ? 'you want to contact with him.' : chat.users[0].username + ' want to contant with you'}`}</span>
                                    <div className={` ${userUnseened ? ' text-white' : 'text-[#b5b5b5]'} tracking-wide pl-3 text-[13px] `}>
                                        {chat.latestMessage
                                            ? moment(chat.latestMessage.createdAt).format('LT')
                                            : moment(chat.createdAt).format('LT')}
                                    </div>
                                    {/* <div>
                                        {chat.unseenMessages.length !== 0 ? chat.unseenMessages.length : 0}
                                    </div> */}
                                </div>
                                {/* <p className='capitalize tracking-wide font-[500] ml-1 text-[#989898] text-[14px] '>{chat.latestMessage ? `${chat.latestMessage.sender.username}: ${chat.latestMessage.content.text} ` : `${chat.users[0].name} contact with you`}</p> */}
                            </div>
                        </div>
                    })
                }

                {/* <==> test <==> */}
                {/* <div className={` flex items-center gap-x-3 hover:bg-teal-800 relative cursor-pointer p-[6px] px-4 pr-8 rounded-full`}>
                <p className='h-[14px] w-[14px] rounded-md bg-sky-600 absolute top-[18px] right-3 flex justify-center items-center font-sans font-[500] text-[10px]'>5</p>
                <div className=' relative w-12 h-10 title'>
                    <img src={"./img-1.webp"} className='w-full shadow-sm shadow-white h-full rounded-full object-cover' alt="" />
                    <p className='h-[9px] w-[9px] bg-green-500 rounded-full absolute -top-[0px] -right-[2px]'></p>
                </div>
                <div className='flex w-full flex-col'>
                    <div className=' flex justify-between items-center w-full'>
                        <h1 className=' font-sans tracking-wider text-[#ffffff] text-[14px] capitalize font-[500]'>Borhan Uddin</h1>
                    </div>
                    <div className={`text-[#ffffff] text-right flex items-center justify-between capitalize gap-x-2 text-[12px]  tracking-wide`}>
                        <span className=' lowercase'>he : how you?</span>
                        <div className='text-[#ffffff] tracking-wide pl-3 text-[13px]'>
                            11:42 AM
                        </div>
                    </div>
                </div>
            </div> */}

                <h1 className={`${search.length === 0 && chats && chats.length === 0 ? 'block' : 'hidden'}  m-3 bg-teal-700 text-center mt-4  py-2 px-4 rounded-lg font-sans tracking-wider `}>
                    Search Your Friends
                </h1>
            </div>

        </div >
    )
}

export default UserList