import React, { useContext, useState } from 'react'
import { BsArrowLeftShort } from 'react-icons/bs'
import { PiPaintBrushBroad } from 'react-icons/pi'
import { UserContext } from '../../provider/ContextPorvider'
import axios from 'axios'
import { HashLoader, PulseLoader } from 'react-spinners'

function Me({ setuserListActivetap }) {

  const { user, setuser } = useContext(UserContext)
  const [selectedAvatar, setselectedAvatar] = useState(null);
  const [selectTheme, setselectTheme] = useState(null);

  const [avatarLoading, setavatarLoading] = useState(false);
  const [direct_avatar_loading, setdirect_avatar_loading] = useState(false);
  const [usernameLoading, setusernameLoading] = useState(false);

  const [selectName, setselectName] = useState(false);

  const [username, setusername] = useState(user && user.username);

  const avatars = [
    {
      _id: '1',
      avatar: 'https://d2pas86kykpvmq.cloudfront.net/images/humans-3.0/portrait-1.png'
    },
    {
      _id: '2',
      avatar: 'https://cdn.dribbble.com/users/363821/screenshots/14280024/media/80c576a39a8702953a75e981f840fe35.png?resize=400x0',
    },
    {
      _id: '3',
      avatar: 'https://cdn.dribbble.com/users/1382369/screenshots/17441428/media/e5212048b79794bde1f1b53e731a5454.png?compress=1&resize=1000x750&vertical=center',
    },
    {
      _id: '4',
      avatar: 'https://cdn.dribbble.com/userupload/4693627/file/original-3c23bf6da1a95a060cd5919f81bf0c33.png?compress=1&resize=400x300&vertical=center',
    },
    {
      _id: '5',
      avatar: 'https://openseauserdata.com/files/ab6abe222392e0f3aacf9a73269be39f.jpg'

    },
  ]


  const avatarHanlderDirect = async (e) => {
    const file = e.target.files[0]
    const token = localStorage.getItem('v3token')

    if (!file || !token) return;

    try {

      setdirect_avatar_loading(true)
      const form = new FormData()
      form.append('image', file)
      const { data: { data: { url } }, status: ibbStatus } = await axios.post(`https://api.imgbb.com/1/upload?key=6226ca30d95b139a79184223cfbc266a`, form)
      if (ibbStatus === 200) {
        const { data, status } = await axios.post(`https://mesender-serverside-3-0.onrender.com/api/messenger/avatarUpdate`, { avatar: url, userid: user._id }, { headers: { Authorization: `Bearer ${token}` } })
        if (status === 201) {
          setuser(data.user)
          setdirect_avatar_loading(false)
        }
      }
    } catch (error) {
      console.log(error)
      setdirect_avatar_loading(false)
    }

  }


  const AvatarHanlder = async (userid) => {
    const token = localStorage.getItem('v3token')
    if (!selectedAvatar || !token) return;
    setavatarLoading(true)

    try {
      const { data, status } = await axios.post(`https://mesender-serverside-3-0.onrender.com/api/messenger/avatarUpdate`, { avatar: avatars.find((avatar) => avatar._id === selectedAvatar).avatar, userid: userid }, { headers: { Authorization: `Bearer ${token}` } })
      if (status === 201) {
        setavatarLoading(false)
        setuser(data.user)
        setselectedAvatar(null)
      }

    } catch (error) {
      console.log(error)
      setavatarLoading(false)
    }
  }

  const usenameHanlder = async () => {
    const token = localStorage.getItem('v3token')
    if (username.length === user.username.length || !token) return;
    setusernameLoading(true)

    try {
      const { data, status } = await axios.post(`https://mesender-serverside-3-0.onrender.com/api/messenger/usrenameUpdate`, { username, userid : user && user._id }, { headers: { Authorization: `Bearer ${token}` } })
      if (status === 201) {
        setusernameLoading(false)
        setuser(data.user)
        setselectName(false)
      }

    } catch (error) {
      console.log(error)
      setusernameLoading(false)
    }
  }


  return (
    user && <div className='p-6 py-3'>
      <div className="top-nav flex items-center gap-x-5">
        <button className=' text-white' onClick={() => setuserListActivetap(1)}>
          <BsArrowLeftShort className='text-4xl' />
        </button>
        <p className=' font-jo text-lg tracking-wide font-[500]'>Me</p>
      </div>
      <div className='flex items-center flex-col justify-center'>
        <div className=' overflow-hidden relative'>
          {
            direct_avatar_loading &&
            <div className='bg-[#0000008f] h-full w-full flex justify-center items-center absolute top-0 left-0 z-[9999] rounded-full'>
              <PulseLoader color='orange' size={10} />
            </div>
          }
          <div className=' relative'>
            <img src={user.avatar} className='h-20 w-20 object-cover rounded-full ' alt="" />
            <label htmlFor="file" className='h-9 w-9 teal border-[4px] cursor-pointer flex justify-center items-center text-gray-100 border-[#00393a] absolute -right-1 bottom-1 rounded-full'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="black" className="w-6 h-6 p-[1px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </label>
          </div>
          <input type="file" onChange={avatarHanlderDirect} id='file' className=' hidden' />
        </div>
        <div className='flex items-center gap-x-2'>
          {
            selectName ?
              <input value={username} onChange={(e) => setusername(e.target.value)} type="text" className='pt-2 w-[100px] outline-none border-b-2 border-gray-300  bg-transparent font-sans  font-[500] text-2xl capitalize tracking-wide' />
              :
              <p className='pt-2 border-gray-300 font-sans  font-[500] text-2xl capitalize tracking-wide' >{user.username}</p>
          }

          <button onClick={() => setselectName(!selectName)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>
          {selectName &&
            <button onClick={usenameHanlder} disabled={user && username.length === user.username.length ? true : false} className={`p-1 mt-3 ml-5 px-2 text-[12px] border-2 ${user && username.length !== user.username.length ? 'border-green-500 cursor-pointer text-white' : "border-[#757575] text-[#9c9c9c] cursor-not-allowed"}  hover:scale-105 tracking-wide rounded-md`}>{usernameLoading ? <p className='flex items-center gap-x-2'><HashLoader size={20} color='white' />   save</p> : 'save'}</button>
          }
        </div>
      </div>
      <div className='mt-6 flex flex-col gap-y-4'>

        <div className='flex items-center gap-x-5'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 bg-pink-900 h-8 p-1 rounded-xl">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
          <div className='flex flex-col'>
            <p className=' text-[14px] tracking-wider'>Dark Mode</p>
            <p className=' text-[11px] font-jo tracking-wide text-[#bdbdbd]'>off</p>
          </div>
        </div>
        <div className='flex items-center gap-x-5'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 bg-green-500 h-8 p-1 rounded-xl">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
          <div className='flex flex-col'>
            <p className=' text-[14px] tracking-wider'>Active Status</p>
            <p className=' text-[11px] font-jo tracking-wide text-[#bdbdbd]'>on</p>
          </div>
        </div>
        <div className='flex items-center gap-x-5'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 bg-orange-700 h-8 p-1 rounded-xl">
            <path strokeLinecap="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
          </svg>

          <div className='flex flex-col'>
            <p className=' text-[14px] tracking-wider'>Username</p>
            <p className=' text-[11px] font-jo tracking-wide text-[#bdbdbd]'>@{user.username}</p>
          </div>
        </div>

      </div>

      <div className='mt-6'>
        <p className=' font-sans tracking-wide  text-[#cecece]'>Services</p>

        <div>
          <div className='flex mt-4 justify-between items-center '>
            <div className=' flex items-center gap-x-4'>
              <div className='h-10 w-10 flex items-center justify-center bg-teal-600 overflow-hidden rounded-full'>
                <img loading='lazy' className='h-full w-full scale-150 x' src="https://d2pas86kykpvmq.cloudfront.net/images/humans-3.0/portrait-1.png" alt="" />
              </div>
              <p className=' font-sans tracking-wide'>Avatar (select)</p>
            </div>
            <button onClick={() => AvatarHanlder(user._id)} disabled={selectedAvatar ? false : true} className={`p-1 px-2 text-[12px] border-2 ${selectedAvatar ? 'border-green-500 cursor-pointer text-white' : "border-[#757575] text-[#9c9c9c] cursor-not-allowed"}  hover:scale-105 tracking-wide rounded-md`}>{avatarLoading ? <p className='flex items-center gap-x-2'><HashLoader size={20} color='white' />   save</p> : 'save'}</button>
          </div>
          <div className=' flex items-center gap-3 mt-3 flex-wrap'>
            {
              avatars.map((i, index) => {
                return <img key={index} onClick={() => setselectedAvatar(selectedAvatar === i._id ? null : i._id)} loading='lazy' className={` ${selectedAvatar === i._id && 'border-2 border-[#00393a] outline-2 outline-double outline-lime-500'} h-16 w-16 bg-orange-400 rounded-lg object-cover`} src={i.avatar} alt="" />
              })
            }
          </div>
        </div>

        <div>
          <div className='flex mt-8 justify-between items-center '>
            <div className=' flex items-center gap-x-4'>
              <div className='h-10 w-10 flex items-center justify-center bg-teal-600 overflow-hidden rounded-full'>
                <PiPaintBrushBroad className='text-2xl' />
              </div>
              <p className=' font-sans tracking-wide'>Theme (select)</p>
            </div>
            <button className={`p-1 px-2 text-[12px] border-2 ${selectTheme ? 'border-green-500 cursor-pointer text-white' : "border-[#757575] text-[#9c9c9c] cursor-not-allowed"}  hover:scale-105 tracking-wide rounded-md`}>Save</button>
          </div>
          <div className='flex mt-3 items-center gap-3 flex-wrap '>
            <p onClick={() => setselectTheme(1)} className={`h-10 ${selectTheme === 1 && 'border-[3px] border-[#00393a] outline-2 outline-double outline-lime-500'} cursor-pointer w-10 bg-teal-200  rounded-full`}></p>
            <p onClick={() => setselectTheme(2)} className={`h-10 ${selectTheme === 2 && 'border-[3px] border-[#00393a] outline-2 outline-double outline-lime-500'} cursor-pointer w-10 bg-green-500  rounded-full`}></p>
            {/* <p onClick={() => setselectTheme(3)} className={`h-10 ${selectTheme === 3 && 'border-[3px] border-[#00393a] outline-2 outline-double outline-lime-500'} cursor-pointer w-10 bg-red-600  rounded-full`}></p> */}
            <p onClick={() => setselectTheme(4)} className={`h-10 ${selectTheme === 4 && 'border-[3px] border-[#00393a] outline-2 outline-double outline-lime-500'} cursor-pointer w-10 bg-purple-600  rounded-full`}></p>
            <p onClick={() => setselectTheme(5)} className={`h-10 ${selectTheme === 5 && 'border-[3px] border-[#00393a] outline-2 outline-double outline-lime-500'} cursor-pointer w-10 bg-sky-600  rounded-full`}></p>
            <p onClick={() => setselectTheme(6)} className={`h-10 ${selectTheme === 6 && 'border-[3px] border-[#00393a] outline-2 outline-double outline-lime-500'} cursor-pointer w-10 bg-yellow-600  rounded-full`}></p>
            <p onClick={() => setselectTheme(null)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-11 text-gray-400 cursor-pointer h-11">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </p>

          </div>
        </div>

      </div>
    </div >
  )
}

export default Me