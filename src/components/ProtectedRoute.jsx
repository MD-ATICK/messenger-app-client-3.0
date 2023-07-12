import React, { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Loader from './Loader';
import axios from 'axios';
import { UserContext } from '../../provider/ContextPorvider';

function ProtectedRoute({ children }) {

    const navigate = useNavigate()
    const location = useLocation()
    const v3token = localStorage.getItem('v3token')

    const { user, authLoading } = useContext(UserContext)


    if (authLoading && !user) {
        return <Loader />
    } else {
        if (v3token && user && !authLoading) {
            return children
        } else {
            // => Aikane Component Use korte hobe tay navigate() function ar jonne ata use na kore <Navigate /> use korci <==
            return <Navigate to='/messenger/login' state={{ form: location }} replace={true}></Navigate>
        }
    }

}
export default ProtectedRoute;