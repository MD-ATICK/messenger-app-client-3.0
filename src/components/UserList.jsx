import React, { useContext, useEffect, useRef, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { TbLogout2 } from 'react-icons/tb'
import { UserContext } from '../../provider/ContextPorvider'
import { PulseLoader } from 'react-spinners'
import moment from 'moment'
import { MdOutlineDoneAll, MdToken } from 'react-icons/md'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import Me from './Me'
import { CgMenu } from 'react-icons/cg'
import { MdDashboard } from 'react-icons/md'
import DashBoard from './DashBoard'

function UserList({ onlineUsers, setonlineUsers, socket }) {

    const { offlineUsers, secureemail, LogoutUser, users, setindexSet, user, reset, setreset, nijerchatLoading, FriendchatBoxFetch, messageSendLoading, chats, setopenedChat, openedChat, search, setsearch, chatLoading, setchatLoading, seen } = useContext(UserContext)

    const Localstg_offline_users = localStorage.getItem('20m_ago_u')
    let xyz = null;
    if (Localstg_offline_users) {
        xyz = JSON.parse(Localstg_offline_users)
    }

    const [usersnew, setusersnew] = useState(users ? users : null);
    const [userListActivetap, setuserListActivetap] = useState(1);
    const [resetcount, setresetcount] = useState(xyz);
    const unreadArray = ''

    const navigate = useNavigate()


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
        // localStorage.setItem('notice', 'new')
        alert('are you sure?')
        LogoutUser(socket)
    }

    const chatHanlder = async (chat) => {
        if (openedChat && socket) {
            socket.emit('leaveRoom', openedChat._id)
        }
        const token = localStorage.getItem('v3token')
        let chater = chats.find((c) => c._id === chat._id)
        if (user && chater.unseenMessages.length > 0 && user && chater.unseenMessages[0].sender !== user._id.toString()) {
            setindexSet(null)
            chater.unseenMessages = []
            setopenedChat(chater)
            socket.emit('unempty', { chat: chat, userid: user._id })
            const { data, status } = await axios.put('https://faltu-serverside.vercel.app/chat/unseenRemove', { chatid: chat._id }, { headers: { Authorization: `Bearer ${token}` } })
        } else {
            setopenedChat(chat)
        }

    }

    const onlineUserHanlder = async (un) => {
        if (openedChat && socket) {
            socket.emit('leaveRoom', openedChat._id)
        }
        if (chats && socket) {
            const token = localStorage.getItem('v3token')
            // let chater = chats.find((c) => c._id === chat._id)
            const chater = chats.find(({ users }) => users[0]._id === un._id || users[1]._id === un._id)
            if (user && chater && chater.unseenMessages.length > 0 && user && chater.unseenMessages[0].sender !== user._id.toString()) {
                setindexSet(null)
                chater.unseenMessages = []
                setopenedChat(chater)
                socket.emit('unempty', { chat: chater, userid: user._id })
                const { data, status } = await axios.put('https://faltu-serverside.vercel.app/chat/unseenRemove', { chatid: chater._id }, { headers: { Authorization: `Bearer ${token}` } })
            } else {
                setopenedChat(chater)
            }
        }
    }

    const [detailsShow, setdetailsShow] = useState(false);

    if (socket) {
        socket.on('offlineUser', (users) => {
            setonlineUsers(users)
        })

    }

    if (xyz) {
        setInterval(() => {
            setresetcount(prev => prev + 1)
        }, 1000);
    }


    const noticeX = localStorage.getItem('notice')
    useEffect(() => {
        if (noticeX && noticeX === 'new') {
            return setdetailsShow(true)
        }
    }, []);



    return (
        userListActivetap === 1 &&
        <div className=' relative '>

            {
                detailsShow &&
                <div className=' h-[100vh] z-[9999] fixed w-full bg-[#090909a9] grid place-items-center'>
                    <div data-aos="fade-left" data-aos-duration="2000" className='sm:h-[330px] relative h-[260px] w-[250px] sm:w-[350px] bg-white rounded-[25px] p-3 sm:p-4 text-black shadow-lg'>
                        <button onClick={() => {
                            localStorage.setItem('notice', 'old')
                            setdetailsShow(false)
                        }} className=' absolute top-3 right-5 duration-300 transform hover:bg-[#e0e0e0] rounded-full p-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>

                        </button>
                        <h1 className='font-bold text-[22px] sm:text-[27px] text-gradient-white'>Dark Chat</h1>

                        <h1 className=' tracking-wide text-[13px] sm:text-[15px]'>Assalamualaikum, <span className='text-[15px] sm:text-[18px] font-[500] capitalize'>{user && user.username}</span></h1>
                        <p className='text-[11px] sm:text-[15px] text-[#525252] tracking-wide pt-3'>I am a normal Programmer not be any big others. I made many project before but i didn't publish it publicaly. As it is my first publishing website , EveryBody pls try to use all features of my website. If a user come my website , there have no bounds to explain my happiness. <br /> <br /> Sobai Valo takien. Allah hafez❤️</p>
                    </div>
                </div>
            }

            <div className='p-1  h-screen sm:p-3 relative'>
                <div className='flex px-3 pt-2 justify-between items-center'>
                    <div className=' flex items-center gap-x-3'>
                        <button onClick={() => setuserListActivetap(2)} title={user && user._id} className='p-[5px] bg-[#eeeeee] text-black text-[23px] rounded-full shadow-sm shadow-teal-500'>
                            <CgMenu />
                        </button>
                        <h1 className='font-bold text-[24px] sm:text-[27px] text-gradient'>Dark Chat</h1>
                    </div>
                    <div className='flex items-center gap-x-3'>
                        {
                            user && user.email === secureemail &&
                            <button title='logout' onClick={() => setuserListActivetap(3)} className='p-[8px] text-xl list-gradient cursor-pointer rounded-lg'>
                                <MdDashboard className='text-[#white]' />
                            </button>
                        }
                        <button title='dashboard' onClick={logoutkorle} className='p-[8px] text-xl list-gradient pr-[9px] cursor-pointer rounded-lg'>
                            <TbLogout2 className='text-[#fe6827]' />
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
                <div className={`${onlineUsers.length > 1 || xyz ? 'p-4' : 'p-1'} flex items-center gap-x-2`}>
                    <div className='flex items-center gap-x-2'>
                        {user && chats && onlineUsers.map((u, index) => {
                            if (u._id.toString() !== user._id.toString() && chats.find((chat) => chat.users[0]._id === u._id || chat.users[1]._id === u._id)) {
                                return <div onClick={() => onlineUserHanlder(u)} key={index} title='online user' className=' relative mr-2 cursor-pointer'>
                                    <img className='h-10 w-10 shadow-sm shadow-white rounded-full object-cover' src={u.avatar} alt="" />
                                    <p className='h-[10px] w-[10px] absolute top-[2px] -right-[1px] bg-green-500 rounded-full'></p>
                                </div>
                            }
                        })}
                    </div>
                    <div className={`${xyz ? 'flex' : 'hidden'} items-center gap-x-2`}>
                        {user && chats && resetcount && offlineUsers && xyz && xyz.length > 0 && xyz.map((u, index) => {
                            const valid = onlineUsers.length > 0 && onlineUsers.find((user) => user._id.toString() === u._id.toString())
                            if (!valid) {
                                const sec = (Date.now() - u.offlinedtime) / 1000
                                const min = sec / 60
                                if (Math.floor(min) < 20) {
                                    return <div onClick={() => onlineUserHanlder(u)} key={index} title='online user' className=' relative mr-2 cursor-pointer'>
                                        <img className='h-10 w-10 shadow-sm shadow-white rounded-full object-cover' src={u.avatar && u.avatar} alt="" />
                                        <p className={`h-[16px] w-[16px] text-[6px] shadow-sm shadow-white  flex justify-center items-center letters absolute top-[0px] -right-[4px] bg-stone-800 text-white rounded-full`}>
                                            {Math.floor(min) + 'm'}
                                        </p>
                                    </div>
                                }
                                const s = localStorage.getItem('20m_ago_u')
                                const parseS = JSON.parse(s)
                                const filterOfflineUsers = parseS && parseS.filter((user) => user._id !== u._id)
                                Math.floor(min) === 20 && parseS && localStorage.setItem('20m_ago_u', JSON.stringify(filterOfflineUsers))
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
                <div className='h-[450px]  sm:h-[580px] md:h-[480px] scroll-smooth  overflow-scroll userlist flex flex-col gap-y-[4px]'>
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
                            return <div key={index} onClick={() => chatHanlder(chat)} title={_id} className={` ${openedChat && openedChat._id.toString() === chat._id.toString() ? 'list-gradient' : ' bg-transparent'} flex items-center gap-x-3  relative cursor-pointer p-[9px] px-3  rounded-lg`}>
                                {userUnseened ? <p className='h-[18px] w-[18px] rounded-md bg-sky-600 absolute top-[35px] right-5 flex justify-center items-center font-sans font-[500] text-[11px]'>{chat.unseenMessages.length}</p>
                                    :
                                    <div className={` ${chat.latestMessage && chat.latestMessage.sender._id === user._id ? 'block' : 'hidden'} absolute top-8 right-5`}>
                                        {user && chat.unseenMessages.length === 0 ? <img src={chat.users.find((c) => c._id.toString() !== user._id.toString()).avatar} className='h-[18px] w-[18px] rounded-full object-cover' alt="" /> : !messageSendLoading ? <MdOutlineDoneAll className='text-[16px] text-[#00b822]' /> : <MdOutlineDoneAll className='text-[16px] text-[#6d6d6d]' />}
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
                                        <h1 className={` font-jo tracking-wide ${chat.latestMessage ? ' ' : 'text-white'} ${userUnseened ? 'text-white font-[500]' : 'text-[#b5b5b5] font-[500]'} text-[14px] sm:text-[16px] capitalize `}>{username}</h1>
                                        <div className={` ${chat.latestMessage ? ' uppercase text-[11px] sm:text-[14px]' : 'lowercase text-white text-[11px] sm:text-[12px]'} ${userUnseened ? ' text-white' : 'text-[#b5b5b5]'}  tracking-wide pl-2 `}>
                                            {chat.latestMessage
                                                ? moment(chat.latestMessage.createdAt).format('LT')
                                                : moment(chat.createdAt).startOf('min').fromNow()
                                            }
                                        </div>
                                    </div>
                                    <div className={`text-[#cdcdcd] text-right flex items-center justify-between capitalize gap-x-1  tracking-wide`}>
                                        <span className={` lowercase   ${chat.latestMessage ? ' text-[12px] sm:text-[13px] ' : ' text-white text-[11px] sm:text-[12px] '}   ${userUnseened ? 'text-white' : 'text-[#b5b5b5]'} `} > {user && chat.latestMessage ? `${chat.latestMessage.sender._id === user._id ? 'you' : 'he'} : ${chat.latestMessage.content.text.length < 15 ? chat.latestMessage.content.text : chat.latestMessage.content.text.slice(0, 13) + '...'}` : `${user && user._id === chat.users[0]._id ? 'you contact to him.' : chat.users[0].username + ' want to contact you.'}`}</span>
                                        {/* <div>
                                        {chat.unseenMessages.length !== 0 ? chat.unseenMessages.length : 0}
                                    </div> */}
                                    </div>
                                    {/* <p className='capitalize tracking-wide font-[500] ml-1 text-[#989898] text-[14px] '>{chat.latestMessage ? `${chat.latestMessage.sender.username}: ${chat.latestMessage.content.text} ` : `${chat.users[0].name} contact with you`}</p> */}
                                </div>
                            </div>
                        })
                    }
                    <h1 className={`${search.length === 0 && chats && chats.length === 0 ? 'block' : 'hidden'}  m-3 bg-teal-700 text-center mt-4  py-2 px-4 rounded-lg font-sans tracking-wider `}>
                        Search Your Friends
                    </h1>
                </div>

                <div className='bg-[#002525] fixed md:absolute bottom-0 flex items-center justify-center left-0 h-[55px] w-full p-1'>
                    <div className='flex items-center gap-x-2 justify-center'>
                        <div className='flex items-center gap-x-2'>
                            <p className=' font-bold text-[17px] sm:text-[19px] text-gradient'>Dark Chat</p>
                            <p className='tracking-wide font-[500] text-[#9b9b9b] text-[12px] sm:text-[14px]'> maked by <Link title='facebook account' className=' underline text-[#cacaca]' to={'https://www.facebook.com/admin.atick69'}> Md. Atick</Link></p>
                        </div>
                    </div>
                </div>

            </div >
        </div >
        || userListActivetap === 2 &&
        <Me setuserListActivetap={setuserListActivetap} userListActivetap={userListActivetap} />
        || userListActivetap === 3 &&
        <DashBoard setuserListActivetap={setuserListActivetap} />
    )
}

export default UserList