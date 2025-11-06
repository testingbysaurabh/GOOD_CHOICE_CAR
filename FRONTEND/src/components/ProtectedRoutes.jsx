import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { LoginSkeleton } from './Simmer';
import { addUserData } from '../utils/store/UserSlice';
import { useGlobalContext } from '../utils/context/MyContext';

const ProtectedRoutes = () => {
    const userData = useSelector(store => store.User);
    // const { isLoading, setIsLoading } = useGlobalContext()
    const dispatch = useDispatch()
    useEffect(() => {
        async function getData() {
            try {
                // setIsLoading(true)
                const res = await axios.get(
                    import.meta.env.VITE_DOMAIN + '/api/admin/get-user-data',
                    { withCredentials: true }
                )
                dispatch(addUserData(res.data.data))
                // console.log(res.data.data)
            } catch (error) {
                window.location = "/admin"
            } finally {
                // setIsLoading(false)
            }
        } getData()
    }, [])

    return !userData?.mail ? <LoginSkeleton /> : <Outlet />
};

export default ProtectedRoutes;