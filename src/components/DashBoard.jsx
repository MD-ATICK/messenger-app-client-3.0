import React, { useContext, useEffect } from 'react'
import { BsArrowLeftShort } from 'react-icons/bs'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { TbTextSize } from 'react-icons/tb'
import { RiLockPasswordLine } from 'react-icons/ri'
import { AiFillUnlock } from 'react-icons/ai'
import { MdAppBlocking, MdAccessTime, MdOutlineMailOutline } from 'react-icons/md'
import { UserContext } from '../../provider/ContextPorvider'
import axios from 'axios'
import { useState } from 'react'
import { HashLoader } from 'react-spinners'
import moment from 'moment'
import { toast } from 'react-hot-toast'

function DashBoard({ setuserListActivetap }) {

    const token = localStorage.getItem('v3token')
    const { user, securecode, secureemail } = useContext(UserContext)

    const [usersDetailsLoading, setusersDetailsLoading] = useState(false);
    const [blockloading, setblockloading] = useState(false);
    const [usersAll, setusersAll] = useState([]);



    const usersFetch = async () => {
        try {
            setusersDetailsLoading(true)
            const { data, status } = await axios.get(`https://faltu-serverside-md-atick.vercel.app/api/messenger/usersDetails?securecode=${securecode}`, { headers: { Authorization: `Bearer ${token}` } })
            if (status === 200) {
                setusersDetailsLoading(false)
                setusersAll(data.usersAll)
            }
        } catch (error) {
            console.log(error)
        }
    }


    const BlockUserHanlder = async (email) => {
        try {
            setblockloading(true)
            if (email === secureemail) return toast.error('admin ke restriced deoya jabe na.')
            if (token) {
                const { data, status } = await axios.put(`https://faltu-serverside-md-atick.vercel.app/api/messenger/restriction`, { email }, { headers: { Authorization: `Bearer ${token}` } })
                if (status === 201) {
                    setblockloading(false)
                    toast.success(data.toast)
                    const user = usersAll.find((u) => u.email === email)
                    user.restriction = !user.restriction
                    setusersAll(usersAll)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (user && token && user.email === secureemail) {
            usersFetch()
        }
    }, []);

    return (
        <div className=' h-screen w-full flex flex-col overflow-y-scroll pb-3 bg-gray-200 text-stone-600'>
            <div className="top-nav  px-6 bg-white py-2 shadow-lg flex items-center gap-x-3">
                <button className=' text-stone-500' onClick={() => setuserListActivetap(1)}>
                    <BsArrowLeftShort className='text-[30px]' />
                </button>
                <p className='text-[15px] font-sans font-[600] tracking-wide'>Admin Dashboard</p>
            </div>
            <div className='p-2 flex-grow overflow-y-scroll border-black '>
                <p className=' text-[13px] tracking-wide text-stone-500 text-right'>total users : {usersAll && usersAll.length}</p>

                <div className='mt-3 flex flex-col w-full gap-y-2 justify-center'>
                    {
                        usersDetailsLoading && <div className=' w-full flex justify-center'>
                            <HashLoader color='#002a2a' />
                        </div> || usersAll.length >= 1 &&
                        usersAll.map((u, index) => {
                            const { email, username, location, password, avatar, createdAt } = u

                            return <div key={index} className='bg-white relative p-2 flex items-center w-full gap-x-1 rounded-lg'>
                                {email === secureemail && <img src="./crown.png" className='h-4 w-4 absolute top-[10px] bg-white rounded-full left-[2px] ' alt="" />}
                                <div className='border-r border-stone-300 pr-2'>
                                    <img src={avatar} className='h-6 w-6 shadow-sm object-cover shadow-gray-500 rounded-full' alt="" />
                                </div>
                                <div className=' flex-grow  border-stone-300 border-r mr-[2px]'>
                                    <div className='flex items-center '>
                                        <p className='text-[11px] flex items-center gap-x-[4px] flex-[0.5] tracking-wide text-center text-stone-600'>
                                            <TbTextSize className='text-[15px] border-stone-300 ' />
                                            {username}</p>

                                        <p className='text-[11px] flex-[0.5] flex items-center  gap-x-[4px] tracking-wide w-2/3 text-center text-stone-600'>
                                            <RiLockPasswordLine />
                                            {password}</p>
                                    </div>
                                    <div className='flex items-center justify-evenly '>
                                        <p className='text-[11px] flex flex-[0.6] items-center gap-x-[4px] tracking-wide text-center text-stone-600'>
                                            <MdOutlineMailOutline />
                                            {email}</p>
                                        <p className='text-[11px] flex flex-[0.5] items-center gap-x-[4px] tracking-wide w-full pl-2 text-stone-500'>
                                            <MdAccessTime className='text-[14px]' />
                                            {moment(createdAt).startOf('min').fromNow()}
                                        </p>
                                    </div>
                                    <div className='flex items-center gap-x-2'>
                                        <p className='text-[10px] flex items-center gap-x-[2px] tracking-wide flext-[1] w-full text-stone-500'>
                                            <HiOutlineLocationMarker className='text-[14px]' />
                                            {location}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => BlockUserHanlder(email)} className={`border-stone-300 flex justify-center items-center ${!u.restriction ? 'bg-orange-800' : 'bg-green-600'} text-white rounded-lg p-[5px]`}>
                                    {
                                        u.restriction === false ?
                                            <MdAppBlocking /> :
                                            <AiFillUnlock />
                                    }
                                </button>
                            </div>

                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default DashBoard