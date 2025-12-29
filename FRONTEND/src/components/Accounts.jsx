import React, { useState } from 'react'
import { AdminPanel } from './AdminPanel'
import { useSelector } from 'react-redux'
import logo from '../assets/logo2.png'
import axios from 'axios'
import validator from 'validator'
import toast from 'react-hot-toast'

const Accounts = () => {
  const userData = useSelector((store) => store.User)

  // ✅ controlled states
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [disableBtn, setDisableBtn] = useState(false)
  const [message, setMessage] = useState("")

  async function changePasswordHandler() {
    if (disableBtn) return // safety

    setDisableBtn(true)
    setMessage("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      const msg = "All fields are required"
      toast.error(msg)
      setMessage(msg)
      setDisableBtn(false)
      return
    }

    if (newPassword !== confirmPassword) {
      const msg = "Passwords do not match"
      toast.error(msg)
      setMessage(msg)
      setDisableBtn(false)
      return
    }

    if (!validator.isStrongPassword(newPassword)) {
      const msg =
        "Password must be at least 8 characters and include uppercase, lowercase, number & symbol"
      toast.error(msg)
      setMessage(msg)
      setDisableBtn(false)
      return
    }

    try {
      await axios.patch(
        `${import.meta.env.VITE_DOMAIN}/api/admin/change-password`,
        { currentPassword, newPassword, confirmPassword },
        { withCredentials: true }
      )

      toast.success("Password changed successfully")

      // ✅ clear only on success
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setMessage("")

    } catch (error) {
      const errMsg =error.response?.data?.message || "Password change failed"
      setMessage(errMsg)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setMessage("")
    } finally {
      setDisableBtn(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-100">
      <AdminPanel />

      <div className="w-full h-[100vh] mt-40 px-3 sm:px-6 md:ml-24 md:mr-6 md:fixed md:h-[80vh] md:w-[calc(100%-6rem)]">

        <div className="relative w-full bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-6">

          {/* LEFT */}
          <div className="w-full md:w-[35%] bg-white/30 backdrop-blur-lg rounded-xl border border-white/20 shadow-sm p-4 flex flex-col gap-4">
            <img src={logo} alt="profile" className="w-full h-full rounded-full shadow object-cover" />

            <div className="shadow p-3 rounded-xl">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">
                Account Details
              </h2>
              <div className="text-sm sm:text-base text-slate-600 flex flex-col gap-1">
                <p>User : {userData.firstName} {userData.lastName}</p>
                <p>Mail : <span className="max-md:text-xs">{userData.mail}</span></p>
                <p>Phone : {userData.phone}</p>
                <p>Total Posts : {userData.posts.length}</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full md:w-[65%] bg-white/30 backdrop-blur-lg rounded-xl border border-white/20 shadow-sm p-4 sm:p-6 flex items-center justify-center">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-2xl font-semibold text-slate-700 text-center mb-4">
                Change Password
              </h2>

              <div className="flex flex-col gap-3">
                <input
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type="password"
                  placeholder="Old Password"
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-50"
                />

                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  placeholder="New Password"
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-50"
                />

                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="Confirm Password"
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-50"
                />

                {message && (
                  <p className="text-red-500 text-xs text-center">{message}</p>
                )}



                <button
                  disabled={disableBtn}
                  onClick={changePasswordHandler}
                  className={`mt-2 py-2.5 rounded-lg text-white font-medium transition
                    ${
                      disableBtn
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 active:scale-95"
                    }`}
                >
                  {disableBtn ? "Please wait..." : "Change Password"}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Accounts
