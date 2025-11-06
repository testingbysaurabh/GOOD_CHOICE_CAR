import axios from 'axios'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addUserData } from '../utils/store/UserSlice'
import { useGlobalContext } from '../utils/context/MyContext'
import { LoginSkeleton } from './Simmer'




const AdminLogin = () => {
    const [mail, setMail] = useState("testingbysaurabh@gmail.com")
    const [password, setPassword] = useState("Password@123")
    const { isLoading, setIsLoading } = useGlobalContext()

    const nav = useNavigate()
    const dispatch = useDispatch()

    function LoginBtnHandler() {
        async function Login() {
            try {
                if (!mail || !password) {
                    toast.error("Enter all fields")
                    return
                }
                const payload = mail.includes("@") ? { mail: mail, password } : { phone: mail, password }
                setIsLoading(true)
                const res = await axios.post(
                    import.meta.env.VITE_DOMAIN + '/api/admin/login',
                    payload,
                    { withCredentials: true }
                )
                toast.success("Login Successful ✅")
                dispatch(addUserData(res.data.data))
                nav("/adminPanel")
                // console.log(res)
            } catch (error) {
                setMail("")
                setPassword("")
                toast.error("Login Failed ❌ " + error.response.data.error)
            } finally {
                setIsLoading(false)
            }
        }
        Login()
    }
    if (isLoading) return <LoginSkeleton />;

    return (
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: "#222831" }}>

            <div
                className="w-[90%] max-w-md p-8 rounded-2xl shadow-2xl"
                style={{ backgroundColor: "#393E46" }}
            >
                <div
                    className="text-3xl font-bold text-center mb-6 drop-shadow"
                    style={{ color: "#DFD0B8" }}
                >
                    <h2>Good Choice Car </h2><h3 className='text-2xl text-[#948983]'>Admin Login</h3>
                </div>

                {/* Mail */}
                <label htmlFor="mail" className="font-semibold" style={{ color: "#DFD0B8" }}>
                    User Name
                </label>
                <input
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    id="mail"
                    type="text"
                    placeholder="Enter username"
                    className="w-full p-3 mb-4 rounded-xl focus:outline-none focus:ring-2 shadow-inner"
                    style={{
                        backgroundColor: "#222831",
                        color: "#DFD0B8",
                        border: "1px solid #948979",
                        boxShadow: "inset 2px 2px 6px rgba(0,0,0,0.6), inset -2px -2px 6px rgba(255,255,255,0.05)"
                    }}
                />

                {/* Password */}
                <label htmlFor="password" className="font-semibold" style={{ color: "#DFD0B8" }}>
                    Password
                </label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    className="w-full p-3 mb-6 rounded-xl focus:outline-none focus:ring-2 shadow-inner"
                    style={{
                        backgroundColor: "#222831",
                        color: "#DFD0B8",
                        border: "1px solid #948979",
                        boxShadow: "inset 2px 2px 6px rgba(0,0,0,0.6), inset -2px -2px 6px rgba(255,255,255,0.05)"
                    }}
                />

                {/* Button */}
                <button
                    onClick={LoginBtnHandler}
                    className="w-full py-3 rounded-xl font-bold transition transform hover:scale-105"
                    style={{
                        backgroundColor: "#948979",
                        color: "#222831",
                        boxShadow: "0 6px 15px rgba(0,0,0,0.6)"
                    }}
                >
                    Login
                </button>
                <div className="flex justify-between mt-4 text-sm">
                    <span className="cursor-pointer " style={{ color: "#948979" }}>
                        Don’t have an account? <span onClick={() => nav("/adminSignUp")} className='text-blue-500 hover:underline'>Sign up</span>
                    </span>
                    <span onClick={() => nav("/adminForgetPassword")} className="cursor-pointer hover:underline" style={{ color: "#948979" }}>
                        Forgot password?
                    </span>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin
