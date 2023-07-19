import React, { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { PulseLoader } from 'react-spinners'
import { UserContext } from '../../provider/ContextPorvider';
import axios from 'axios';
import { toast } from 'react-hot-toast'


function Login() {

    const navigate = useNavigate()
    const [email, setemail] = useState('atick@gmail.com');
    const [password, setpassword] = useState('atick');
    const [loginLoading, setLoginLoading] = useState(false);

    const { setuser, reset, setreset } = useContext(UserContext)


    const LoginHanlder = async () => {
        try {
            setLoginLoading(true)
            const currectDevice = window.navigator.userAgent
            const { data, status } = await axios.post(`https://mesender-serverside-3-0.onrender.com/api/messenger/login`, { email, password, currectDevice })
            if (status === 201) {
                setuser(data.user)
                localStorage.setItem('v3token', data.v3token)
                setLoginLoading(false)
                setreset(!reset)
                navigate('/')
            } else if (status === 207) {
                toast.error(data.error)
                setLoginLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const [x, setx] = useState(true);


    return (
        <div className="w-full bg-[#00393a] p-6 relative h-screen clippath grid place-items-center">
            <div className='max-w-5xl bg-[#003031] p-6 flex justify-between shadow-lg rounded-2xl w-full border-white mx-auto'>
                <div className='flex-[0.6] p-6 justify-center items-center hidden md:flex rounded-2xl'>
                    <img src="/hero_img.png" alt="" />
                </div>
                <div className=' flex-[1] md:flex-[0.4] flex flex-col gap-y-5 rounded-2xl p-10'>
                    <h1 className='text-4xl font-bold text-white'>Login</h1>
                    <div className='flex flex-col'>
                        <label htmlFor="one" className=' font-sans tracking-wider font-[600] text-white mb-1 text-[15px]'>* Email</label>
                        <input value={email} onChange={(e) => setemail(e.target.value)} type="text" placeholder='Enter Email' className='border-[2px] outline-none text-white py-2 px-4 font-sans tracking-wider font-[500] border-[#00797b] rounded-sm bg-[#003031]' />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="one" className=' font-sans tracking-wider font-[600] text-white mb-1 text-[15px]'>* Passowrd</label>
                        <input value={password} onChange={(e) => setpassword(e.target.value)} type="text" placeholder='Enter Password' className='border-[2px] outline-none text-white py-2 px-4 font-sans tracking-wider font-[500] border-[#00797b] rounded-sm bg-[#003031]' />
                    </div>

                    <button onClick={LoginHanlder} className='w-full py-[12px] hover:bg-[#2d9b8af1] duration-150 px-6 rounded-lg mt-2 text-white font-sans tracking-wide font-[600] pt-[14px] bg-[#10baa0f1]'> {loginLoading ? <PulseLoader color='white' size={12} /> : 'Login'}</button>
                    <Link to='/messenger/register' className='text-center underline text-gray-200 hover:text-white font-sans tracking-wide' >create an account?</Link>
                </div>
            </div>
        </div>
    )
}

export default Login