import React, { useState } from "react";
import { useGlobalContext } from "../utils/context/MyContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { PasswordChangeSkeleton, SendOtpSkeleton } from "./Simmer";
import validator from "validator"

export const AdminForgetPass = () => {
    const { ui } = useGlobalContext();

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ backgroundColor: "#222831" }}
        >
            <div
                className="w-full max-w-md p-8 rounded-2xl shadow-2xl transition-all duration-300"
                style={{
                    backgroundColor: "#393E46",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.6)",
                }}
            >
                {ui === 0 ? <SendOtpF /> : <PasswordChange />}

            </div>
        </div>
    );
};







export const SendOtpF = () => {
    const { mail, setMail, setUi, isLoading, setIsLoading } = useGlobalContext();
    const navigate = useNavigate();

    async function handleSend() {
        try {
            if (!mail) return toast.error("Please enter email");
            const isEmail = validator.isEmail(mail);
            if (!isEmail) return toast.error("Please enter a valid email");

            setIsLoading(true);
            const res = await axios.post(
                `${import.meta.env.VITE_DOMAIN}/api/admin/sendOtp`,
                { mail: String(mail).trim() },
                { withCredentials: true }
            );
            toast.success(res.data.message || "OTP sent successfully ✅");
            setUi(1);
        } catch (error) {
            toast.error("❌ " + (error.response?.data?.error || error.message));
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) return <SendOtpSkeleton />;

    return (
        <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold mb-4 text-[#DFD0B8]">Send OTP</h2>

            <input
                type="email"
                placeholder="Enter your email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                className="w-full rounded-xl p-3 outline-none focus:ring-2 shadow-inner"
                style={{
                    backgroundColor: "#222831",
                    color: "#DFD0B8",
                    border: "1px solid #948979",
                    boxShadow:
                        "inset 2px 2px 6px rgba(0,0,0,0.6), inset -2px -2px 6px rgba(255,255,255,0.05)",
                }}
            />

            <div className="flex flex-col gap-3">
                <button
                    onClick={handleSend}
                    className="w-full py-3 rounded-xl font-bold transition transform hover:scale-105"
                    style={{
                        backgroundColor: "#948979",
                        color: "#222831",
                        boxShadow: "0 6px 15px rgba(0,0,0,0.6)",
                    }}
                >
                    Send OTP
                </button>

                <button
                    onClick={() => navigate("/admin")}
                    className="self-start cursor-pointer px-2 py-1 rounded-lg transition transform hover:scale-105 hover:text-[#948979]"
                    style={{ color: "#DFD0B8" }}
                >
                    <i className="fa-solid fa-chevron-left"></i> Back to Login
                </button>
            </div>
        </div>
    );
};







// PASSWORD CHANGE COMPONENT
// ====
export const PasswordChange = () => {
    const { mail, isLoading, setIsLoading, setUi, setMail } = useGlobalContext();
    const [newPassword, setNewPassword] = useState("");
    const [rePass, setRePass] = useState("");
    const [otp, setOtp] = useState("")
    const navigate = useNavigate();
    // mail, otp, newPassword


    function UpdateBtnHandler() {
        if (!mail || !newPassword || !rePass || !otp) {
            return toast.error("please full filled all")
        }
        if (newPassword !== rePass) {
            return toast.error("Password & verfypassword was not matching")
        }
        async function upadtePass() {
            try {
                setIsLoading(true)
                const res = await axios.post(`${import.meta.env.VITE_DOMAIN}/api/admin/forgetpassword`, { mail, otp, newPassword }, { withCredentials: true })
                // console.log(res)
                toast.success(res.data.msg)
                setUi(0)
                setMail("")
                navigate("/admin")
            } catch (error) {
                toast.error("❌ " + (error.response?.data?.error || error.message));
            } finally {
                setIsLoading(false)
            }
        } upadtePass()

    }
    if (isLoading) return <PasswordChangeSkeleton />;


    return (
        <div className="space-y-6 text-center">
            {/* Heading */}
            <h2 className="text-3xl font-bold mb-4 text-[#DFD0B8]">
                Change Password
            </h2>

            {/* Inputs */}
            <div className="space-y-3">
                <input
                    type="email"
                    value={mail}
                    readOnly
                    className="w-full rounded-xl p-3 outline-none shadow-inner"
                    style={{
                        backgroundColor: "#222831",
                        color: "#DFD0B8",
                        border: "1px solid #948979",
                        boxShadow:
                            "inset 2px 2px 6px rgba(0,0,0,0.6), inset -2px -2px 6px rgba(255,255,255,0.05)",
                    }}
                />

                <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full rounded-xl p-3 outline-none shadow-inner"
                    style={{
                        backgroundColor: "#222831",
                        color: "#DFD0B8",
                        border: "1px solid #948979",
                        boxShadow:
                            "inset 2px 2px 6px rgba(0,0,0,0.6), inset -2px -2px 6px rgba(255,255,255,0.05)",
                    }}
                />

                <input
                    type="password"
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl p-3 outline-none shadow-inner"
                    style={{
                        backgroundColor: "#222831",
                        color: "#DFD0B8",
                        border: "1px solid #948979",
                        boxShadow:
                            "inset 2px 2px 6px rgba(0,0,0,0.6), inset -2px -2px 6px rgba(255,255,255,0.05)",
                    }}
                />

                <input
                    type="password"
                    placeholder="Re-enter Password"
                    value={rePass}
                    onChange={(e) => setRePass(e.target.value)}
                    className="w-full rounded-xl p-3 outline-none shadow-inner"
                    style={{
                        backgroundColor: "#222831",
                        color: "#DFD0B8",
                        border: "1px solid #948979",
                        boxShadow:
                            "inset 2px 2px 6px rgba(0,0,0,0.6), inset -2px -2px 6px rgba(255,255,255,0.05)",
                    }}
                />

            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
                <button
                    onClick={UpdateBtnHandler}
                    className="w-full py-3 rounded-xl font-bold transition transform hover:scale-105"
                    style={{ backgroundColor: "#948979", color: "#222831", boxShadow: "0 6px 15px rgba(0,0,0,0.6)", }}
                >
                    Update Password
                </button>

                <div className="flex justify-between">
                    <button
                        onClick={() => setUi(0)}
                        className="self-start flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg transition transform hover:scale-105 hover:text-[#948979]"
                        style={{ color: "#DFD0B8", alignSelf: "flex-start", }}
                    >
                        <i className="fa-solid fa-chevron-left"></i> Send OTP
                    </button>
                </div>
            </div>
        </div>
    );
};
