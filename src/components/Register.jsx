import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { PulseLoader } from 'react-spinners'
import { UserContext } from '../../provider/ContextPorvider';


function Register() {

    const navigate = useNavigate()

    const [username, setusername] = useState('atick1');
    const [email, setemail] = useState('atick1@gmail.com');
    const [password, setpassword] = useState('atick1');
    const [avatar, setavatar] = useState('https://i.ibb.co/g6p9NsG/profilepic.jpg');


    const [registerLoading, setregisterLoading] = useState(false);

    const { setuser, reset, setreset } = useContext(UserContext)


    const RegisterHanlder = async () => {
        try {
            setregisterLoading(true)
            const form = new FormData();
            form.append("image", avatar);
            const { data: { data: { url } }, status: ibbStatus } = await axios.post(`https://api.imgbb.com/1/upload?key=6226ca30d95b139a79184223cfbc266a`, form)
            if (ibbStatus === 200) {
                const { data, status } = await axios.post(`http://localhost:4000/api/messenger/register`, { username, email, password, avatar: url })
                if (status === 201) {
                    setuser(data.createUser)
                    localStorage.setItem('v3token', data.v3token)
                    setregisterLoading(false)
                    setreset(!reset)
                    navigate('/')
                }
            }
        } catch (error) {
            console.log(error)
            setregisterLoading(false)
        }

    }

    const imgref = useRef()

    const avatarHanlder = (e) => {
        const file = e.target.files[0];
        setavatar(file)

        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result;
            imgref.current.src = base64String
        };

        reader.readAsDataURL(file);
    }


    return (
        <div className="w-full bg-[#00393a] p-6 relative h-screen clippath grid place-items-center">
            <div className='max-w-5xl bg-[#003031] flex justify-between shadow-lg rounded-2xl w-full border-white mx-auto'>
                <div className='flex-[0.6] p-6 justify-center items-center hidden md:flex rounded-2xl'>
                    <img src="/hero_img.png" alt="" />
                </div>
                <div className=' flex-[1] md:flex-[0.4] flex flex-col gap-y-5 rounded-2xl p-10'>
                    <h1 className='text-4xl font-bold text-white'>Register</h1>
                    <div className='flex flex-col'>
                        <label htmlFor="one" className=' font-sans tracking-wider font-[600] text-white mb-1 text-[15px]'>* Username</label>
                        <input value={username} onChange={(e) => setusername(e.target.value)} type="text" placeholder='Enter Username' className='border-[2px] outline-none text-white py-2 px-4 font-sans tracking-wider font-[500] border-[#00797b] rounded-sm bg-[#003031]' />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="one" className=' font-sans tracking-wider font-[600] text-white mb-1 text-[15px]'>* Email</label>
                        <input value={email} onChange={(e) => setemail(e.target.value)} type="text" placeholder='Enter Email' className='border-[2px] outline-none text-white py-2 px-4 font-sans tracking-wider font-[500] border-[#00797b] rounded-sm bg-[#003031]' />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="one" className=' font-sans tracking-wider font-[600] text-white mb-1 text-[15px]'>* Passowrd</label>
                        <input value={password} onChange={(e) => setpassword(e.target.value)} type="text" placeholder='Enter Password' className='border-[2px] outline-none text-white py-2 px-4 font-sans tracking-wider font-[500] border-[#00797b] rounded-sm bg-[#003031]' />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="one" className=' font-sans tracking-wider font-[600] text-white mb-1 text-[15px]'>* File</label>
                        <div className='py-1 flex items-center gap-x-4'>
                            <img ref={imgref} src={avatar} className='h-12 object-cover w-12 rounded-full' alt="" />
                            <label htmlFor='file' className='w-auto py-[10px] hover:bg-[#2d9b8af1] duration-150 px-6 rounded-lg text-white font-sans tracking-wide font-[600] bg-[#209e8bf1] cursor-pointer'>Upload Image</label>
                        </div>
                        <input onChange={avatarHanlder} type="file" id='file' placeholder='Enter Username' className=' hidden border-[2px] outline-none text-white py-2 px-4 font-sans tracking-wider font-[500] border-[#00797b] rounded-sm bg-[#003031]' />
                    </div>
                    <button onClick={RegisterHanlder} className='w-full py-[12px] hover:bg-[#2d9b8af1] duration-150 px-6 rounded-lg mt-2 text-white font-sans tracking-wide font-[600] bg-[#10baa0f1]'>{registerLoading ? <PulseLoader color='white' size={12} /> : 'Register'}</button>
                    <Link to='/messenger/login' className='text-center underline text-gray-200 hover:text-white font-sans tracking-wide' >already register?</Link>
                </div>
            </div>
        </div>
    )
}

export default Register