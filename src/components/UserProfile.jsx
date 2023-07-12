import React, { useContext } from 'react'
import { UserContext } from '../../provider/ContextPorvider'

function UserProfile(props) {

  const { userProfileShow, setuserProfileShow } = props

  const { openedChat, onlineUsers , user} = useContext(UserContext)


  return (
    openedChat &&
    <div className='p-6 relative'>

      <button onClick={() => setuserProfileShow(!userProfileShow)} className={`p-2 teal w-[40px] outline-none shadow-sm shadow-white absolute -left-8 top-16 h-[40px] justify-center items-center rounded-lg`}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <div className='w-full flex gap-x-5 justify-start'>
        <img src={openedChat.users.find((c) => c._id.toString() !== user._id.toString()).avatar} className='w-[100px] shadow-white h-[100px] rounded-2xl object-cover' alt="" />
        <div>
          <h1 className=' font-sans  capitalize tracking-wider text-white text-[16px] font-[500]'>{openedChat.users.find((c) => c._id.toString() !== user._id.toString()).username}</h1>
          {onlineUsers.length > 0 && <h1 className=' font-sans text-green-500 capitalize tracking-wider  text-[14px] font-[500]'>{onlineUsers.find((i) => i._id === openedChat.users[1]._id) ? 'Active' : 'Offline'}</h1>}
        </div>
      </div>


      <div className='mt-6 flex flex-col gap-y-3'>
        <div className='flex teal py-2 rounded-full px-4 items-center justify-between'>
          <h1 className=' font-sans capitalize tracking-wider text-white text-[16px] font-[500] whitespace-nowrap	'>Custromize Chat</h1>
          <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="" className="w-5 cursor-pointer h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
        <div className='flex teal py-2 rounded-full px-4 items-center justify-between'>
          <h1 className=' font-sans  capitalize tracking-wider text-white text-[16px] font-[500] whitespace-nowrap	'>Privacy and Support</h1>
          <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="" className="w-5 cursor-pointer h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
        <div className='flex teal py-2 rounded-full px-4 items-center justify-between'>
          <h1 className=' font-sans  capitalize tracking-wider text-white text-[16px] font-[500] whitespace-nowrap	'>Shared Media</h1>
          <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="" className="w-5 cursor-pointer h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

    </div>
  )
}

export default UserProfile