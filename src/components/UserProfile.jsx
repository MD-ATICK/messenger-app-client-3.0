import React, { useContext, useState } from 'react'
import { UserContext } from '../../provider/ContextPorvider'
import axios from 'axios';
import { PulseLoader } from 'react-spinners'
import { toast } from 'react-hot-toast';
import { AiFillUnlock } from 'react-icons/ai'


function UserProfile({ userProfileShow, setuserProfileShow, socket }) {

  const { openedChat, setopenedChat, onlineUsers, user, chatMessages, chats, setchats } = useContext(UserContext)

  const [ccShow, setccShow] = useState(false);
  const [ppShow, setppShow] = useState(false);
  const [blockLoading, setblockLoading] = useState(false);


  const otherUser = openedChat && user && openedChat.users.find((c) => c._id.toString() !== user._id.toString())


  const Blockchat = async (blockCondition) => {
    if (openedChat && socket && user && chats) {
      setblockLoading(true)
      const token = localStorage.getItem('v3token')
      const { data, status } = await axios.put('https://faltu-serverside-md-atick.vercel.app/chat/blockOrUnblock', { chatid: openedChat._id, blockCondition: blockCondition }, { headers: { Authorization: `Bearer ${token}` } })
      if (status === 201) {
        data.condition === true ? toast.success('User Blocked Succesfully') : toast.success('User UnBlocked Succesfully')
        setblockLoading(false)
        openedChat.chatBlockedBy = data.condition === true ? user._id : "none"
        setopenedChat(data.chat)
        socket.emit('blockStatus', { chat: data.chat, user })
        if (data.condition === true) {
          chats.find((c) => c._id === openedChat._id).chatBlockedBy = user._id
          return setchats(chats)
        }
        chats.find((c) => c._id === openedChat._id).chatBlockedBy = "none"
        setchats(chats)
      }
    }
  }

  return (
    openedChat &&
    <div className=' w-full flex z-[9999] justify-end light-teal'>
      <div className=' relative  h-screen overflow-y-scroll'>
        <button className=' text-white p-6 pb-2' onClick={() => {
          if (window.innerWidth <= 1100) {
            setuserProfileShow(false)
          }
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>

        </button>

        <div className='w-full px-8 pb-0 flex gap-x-5 justify-start'>
          <div className=' relative'>
            <img src={openedChat.users.find((c) => c._id.toString() !== user._id.toString()).avatar} className='w-[100px] shadow-white h-[100px] rounded-full object-cover' alt="" />
            <p className={` ${onlineUsers.find((i) => i._id === otherUser._id) ? 'bg-green-600' : 'bg-orange-800'} h-6 w-6 rounded-full absolute top-0 right-0 border-[4px] border-[#00393a]`}></p>
          </div>
          <div>
            <h1 className=' font-sans  capitalize tracking-wider text-white text-[16px] font-[500]'>{openedChat.users.find((c) => c._id.toString() !== user._id.toString()).username}</h1>
            {onlineUsers.length > 0 && <h1 className={` ${onlineUsers.find((i) => i._id === otherUser._id) ? 'text-green-500 font-[500]' : ' text-red-600 font-[600]'} font-sans capitalize tracking-wider  text-[14px] `}>{onlineUsers.find((i) => i._id === otherUser._id) ? 'Active' : 'In active'}</h1>}
            {openedChat && user && openedChat.chatBlockedBy !== 'none' && openedChat.chatBlockedBy === user._id && <p className='mt-3 font-sans tracking-wide text-[#d0cece] font-[500] text-[16px] flex items-center gap-x-1'>Blocked
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </p>}
          </div>
        </div>

        <div className='px-4'>
          {
            blockLoading ?
              <button className={` ${openedChat && openedChat.chatBlockedBy === 'none' ? 'block' : 'hidden'} pink-gradient mt-6 mx-auto font-[600] w-full rounded-xl py-4 px-4 text-white font-sans tracking-wide text-[16px] text-center`} onClick={() => Blockchat(true)}> <PulseLoader color='white' size={17} /></button>
              :
              <button className={` ${openedChat && openedChat.chatBlockedBy === 'none' ? 'block' : 'hidden'} pink-gradient flex gap-x-3 items-center justify-center mt-6 mx-auto font-[600] w-full rounded-xl py-4 px-4 text-white font-sans tracking-wide text-[16px] text-center`} onClick={() => Blockchat(true)}>Block User
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#565656" className="w-6 rounded-full bg-white h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                </svg>


              </button>
          }
        </div>
        <div className='px-4'>
          {
            blockLoading ?
              <button className={` ${openedChat && user && openedChat.chatBlockedBy !== 'none' && openedChat.chatBlockedBy === user._id ? 'flex' : 'hidden'} pink-gradient justify-center items-center mt-6 mx-auto font-[600] w-full rounded-xl py-4 px-4 text-white font-sans tracking-wide text-[16px] text-center`} onClick={() => Blockchat(false)}> <PulseLoader color='white' size={17} /></button>
              :
              <button className={` ${openedChat && user && openedChat.chatBlockedBy !== 'none' && openedChat.chatBlockedBy === user._id ? 'flex' : 'hidden'} pink-gradient flex gap-3 justify-center items-center mt-6 mx-auto font-[600] w-full rounded-xl py-4 px-4 text-white font-sans tracking-wide text-[16px] text-center`} onClick={() => Blockchat(false)}> UnBlock User
                <AiFillUnlock className='text-[25px]' />
              </button>
          }
        </div>


        <div className='mt-2 p-3 sm:p-6 flex flex-col gap-y-4'>
          <div>
            <div onClick={() => setccShow(!ccShow)} className='flex teal-gradient py-2 rounded-full px-4 items-center justify-between'>
              <h1 className=' font-sans capitalize tracking-wider text-white text-[16px] font-[500] whitespace-nowrap	'>Custromize Chat <span className='text-[12px] text-[#cecece] tracking-wide'>(comming soon)</span></h1>
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="" className={`w-5 ${ccShow ? ' rotate-0' : ' -rotate-90'}  transform duration-500 cursor-pointer h-5`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <div className={`${ccShow ? 'h-[90px] lg:h-[150px]   pt-3 pb-3' : 'h-0 overflow-hidden whitespace-nowrap'} transform duration-500`}>
              <h1 className='font-sans tracking-wide text-white font-[500] pb-[6px] text-[14px]'>Choose Chat Theme </h1>
              <div className='flex items-center gap-4 flex-wrap '>
                <p onClick={() => setccShow(false)} className='h-10 cursor-pointer w-10 bg-teal-200  rounded-full'></p>
                <p onClick={() => setccShow(false)} className='h-10 cursor-pointer w-10 bg-green-500  rounded-full'></p>
                <p onClick={() => setccShow(false)} className='h-10 cursor-pointer w-10 bg-red-600  rounded-full'></p>
                <p onClick={() => setccShow(false)} className='h-10 cursor-pointer w-10 bg-purple-600  rounded-full'></p>
                <p onClick={() => setccShow(false)} className='h-10 cursor-pointer w-10 bg-sky-600  rounded-full'></p>
                <p onClick={() => setccShow(false)} className='h-10 cursor-pointer w-10 bg-yellow-600  rounded-full'></p>
              </div>
            </div>
          </div>

          <div>
            <div className='flex teal-gradient py-2 rounded-full px-4 items-center justify-between' onClick={() => setppShow(!ppShow)}>
              <h1 className=' font-sans  capitalize tracking-wider text-white text-[16px] font-[500] whitespace-nowrap	'>Privacy and Support</h1>
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="" className={`w-5 ${ppShow ? ' rotate-0' : ' -rotate-90'}  transform duration-500 cursor-pointer h-5`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <div className={` transform duration-500  ${ppShow ? ' h-[200px] lg:h-[250px]' : 'h-0 overflow-hidden'} `}>
              <section id="privacy" className='text-white mt-3'>
                <h2 className=' font-sans tracking-wide font-[500] text-[15px]'>Privacy Policy : </h2>
                <p className=' text-[13px] pt-1 tracking-wide text-[#a4a4a4]'>This is the privacy policy section. You can provide details about how you handle user data, what information you collect, and how it is used and protected.</p>
              </section>

              <section id="support" className='text-white pt-2'>
                <h2 className=' font-sans tracking-wide font-[500] text-[15px]'>Support : </h2>
                <p className=' text-[13px] pt-1 tracking-wide text-[#a4a4a4]'>If users require support or assistance, provide them with the necessary information on how to contact your support team or find help.</p>
              </section>
            </div>
          </div>

          <div>
            <div className='flex teal-gradient py-2 rounded-full px-4 items-center justify-between'>
              <h1 className=' font-sans  capitalize tracking-wider text-white text-[16px] font-[500] whitespace-nowrap flex items-center gap-x-1	'>All Shared Media <p className='text-[11px] tracking-normal text-[#bdbdbd]'>(always showed)</p></h1>
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="" className="w-5 cursor-pointer h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <div className='-mt-4 flex pt-8  flex-wrap items-center gap-3'>
              {
                chatMessages && chatMessages.length > 0 && chatMessages.map((message) => {
                  const { content } = message
                  return content.images.map((i, index) => {
                    return <div key={index}>
                      <a href={i.image} target='_blank'  ><img className='h-[55px] hover:scale-105 duration-150 flex-grow rounded-lg' src={i.image} alt="" /></a>
                    </div>
                  })
                })
              }
            </div>
          </div>

        </div>
      </div>
    </div >
  )
}

export default UserProfile