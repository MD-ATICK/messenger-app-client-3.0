import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import ProtectedRoute from './components/ProtectedRoute'
import Messenger from './Messenger'
import ContextProvider from '../provider/ContextPorvider'
import Me from './components/Me'

function App() {

  return (
    <ContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/messenger/login' element={<Login />} />
          <Route path='/messenger/register' element={<Register />} />
          <Route path='/' element={<ProtectedRoute ><Messenger /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </ContextProvider>
  )
}

export default App
