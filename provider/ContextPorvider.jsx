import axios from "axios";
import Swal from 'sweetalert2'
import { Navigate, useNavigate } from 'react-router-dom'
import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null)


const ContextProvider = ({ children }) => {

    const [users, setusers] = useState(null);
    const [onlineUsers, setonlineUsers] = useState([]);

    const [reset, setreset] = useState(false);
    // const navigate = useNavigate()

    const [openedChat, setopenedChat] = useState(null);
    const [chats, setchats] = useState(null);
    const [search, setsearch] = useState('');
    const [chatMessages, setchatMessages] = useState([]);
    const [user, setuser] = useState(null);
    const [authLoading, setauthLoading] = useState(true);
    const [chatLoading, setchatLoading] = useState(false);
    const [messageSendLoading, setmessageSendLoading] = useState(false);
    const [allmsgLoading, setallmsgLoading] = useState(false);
    const [seen, setseen] = useState(false);

    const [nijerchatLoading, setnijerchatLoading] = useState(false);

    const token = localStorage.getItem('v3token')

    let x = false;

    const authUser = async () => {
        try {
            const { data, status } = await axios.get(`https://mesender-serverside-3-0.onrender.com/api/messenger/me`, { headers: { Authorization: `Bearer ${token}` } })
            if (status === 200) {
                setuser(data.user)
                setauthLoading(false)
            }
        } catch (error) {
            console.log(error)
            setauthLoading(false)
        }
    }

    const LogoutUser = (socket) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You would want to Logout!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Logout!'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('v3token')
                if (socket) {
                    openedChat && socket.emit('leaveRoom', openedChat._id)
                    socket.emit('removeAction', user._id)
                }
                setuser(null)
                setopenedChat(null)
            }
        })

    }

    const Users = async () => {
        try {
            const { data, status } = await axios.get(`https://mesender-serverside-3-0.onrender.com/api/messenger/users`, { headers: { Authorization: `Bearer ${token}` } })
            if (status === 200) {
                setusers(data.users)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const nijerChats = async () => {
        setnijerchatLoading(true)
        try {
            const { data, status } = await axios.get(`https://mesender-serverside-3-0.onrender.com/nijer-chats`, { headers: { Authorization: `Bearer ${token}` } })
            if (status === 200) {
                setnijerchatLoading(false)
                setchats(data.nijer_chats)
            } else if (status === 223) {
                localStorage.removeItem('v3token')
                window.location.href = '/messenger/register'
            }
        } catch (error) {
            console.log(error)
        }
    }

    const FriendchatBoxFetch = async (user, socket) => {
        try {
            // setchatLoading(true)
            const { data, status } = await axios.post(`https://mesender-serverside-3-0.onrender.com/chat`, { user }, { headers: { Authorization: `Bearer ${token}` } })
            if (status === 201) {
                // setchatLoading(false)
                setopenedChat(data.chat)
                setsearch('')
                if (data.new === true) {
                    setchats([...chats, data.chat])
                    if (socket) {
                        socket.emit('newFriend', user._id)
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const messageSent = async (content, chatBoxRef) => {
        try {
            setchatMessages([...chatMessages, { content, sender: { _id: user._id }, createdAt: new Date().toLocaleString() }])
            setmessageSendLoading(true)
            openedChat.latestMessage = { content, sender: { _id: user._id }, createdAt: new Date().toLocaleString() }
            setopenedChat(openedChat)
            if (chatBoxRef.current) {
                chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
            }
            const { data, status } = await axios.post(`https://mesender-serverside-3-0.onrender.com/send-message?chatid=${openedChat._id}`, { content }, { headers: { Authorization: `Bearer ${token}` } })
            if (status === 201) {
                setmessageSendLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const chatAllMessages = async () => {
        try {
            setallmsgLoading(true)
            const { data, status } = await axios.get(`https://mesender-serverside-3-0.onrender.com/chat-allmessages?chat=${openedChat._id}`, { headers: { Authorization: `Bearer ${token}` } })
            if (status === 200) {
                setallmsgLoading(false)
                setchatMessages(data.messages)
            }
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        token && openedChat ? chatAllMessages() : setchatMessages([])
    }, [openedChat]);

    useEffect(() => {
        const v3token = localStorage.getItem('v3token')
        v3token ? authUser() : setauthLoading(false);
        v3token ? Users() : setusers([])
        v3token ? nijerChats() : setchats([])
    }, [reset]);


    const content = {
        user,
        setuser,
        authLoading,
        setauthLoading,
        users,
        LogoutUser,
        openedChat,
        setopenedChat,
        FriendchatBoxFetch,
        chats,
        setchats,
        messageSent,
        search,
        setsearch,
        chatLoading,
        setchatLoading,
        messageSendLoading,
        setmessageSendLoading,
        chatMessages,
        setchatMessages,
        allmsgLoading,
        setallmsgLoading,
        onlineUsers,
        setonlineUsers,
        reset,
        setreset,
        nijerchatLoading,
        setnijerchatLoading,
        seen,
        setseen,
        nijerChats,
        x
    }

    return (
        <UserContext.Provider value={content} >
            {children}
        </UserContext.Provider>
    )
}

export default ContextProvider;