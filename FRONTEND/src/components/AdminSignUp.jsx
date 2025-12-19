import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../utils/context/MyContext";
import toast from "react-hot-toast";
import validator from "validator";
import axios from "axios";
import { SendOtpSkeleton, SignupSkeleton, VerifyOtpSkeleton, } from "./Simmer";
import { useNavigate } from "react-router-dom";


const AdminSignUp = () => {
    const { ui } = useGlobalContext();

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ backgroundColor: "#222831" }}
        >
            <div
                className="w-full max-w-md p-8 rounded-2xl shadow-2xl"
                style={{
                    backgroundColor: "#393E46",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.6)",
                }}
            >
                {ui === 0 ? (
                    <SendOtp />
                ) : ui === 1 ? (
                    <VerifyOtp />
                ) : (
                    <Signup />
                )}
            </div>
        </div>
    );
};

export default AdminSignUp;







//////SEND OTP 
// ===============================
export const SendOtp = () => {
    const { mail, setMail, setUi, isLoading, setIsLoading } = useGlobalContext();
    const navigate = useNavigate();

    async function handleSend() {
        try {
            if (!mail) return toast.error("Please enter email");
            const isEmail = validator.isEmail(mail);
            if (!isEmail) return toast.error("Please enter a valid email");

            setIsLoading(true);
            const res = await axios.post(
                `${import.meta.env.VITE_DOMAIN}/api/otp/send-otp`,
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








//// ==========================
//// VERIFY OTP COMPONENT
/// ===============================
export const VerifyOtp = () => {
    const { mail, setUi, isLoading, setIsLoading } = useGlobalContext();
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    async function handleVerify() {
        try {
            if (!otp) return toast.error("Enter OTP");
            if (!validator.isNumeric(otp)) return toast.error("Enter valid OTP");

            setIsLoading(true);
            const res = await axios.post(
                `${import.meta.env.VITE_DOMAIN}/api/otp/verify-otp`,
                { mail: String(mail).trim(), otp },
                { withCredentials: true }
            );

            toast.success(res.data.message || "OTP Verified ✅");
            setUi(2);
        } catch (error) {
            setOtp("");
            toast.error("❌ " + (error.response?.data?.error || error.message));
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) return <VerifyOtpSkeleton />;

    return (
        <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold mb-4 text-[#DFD0B8]">Verify OTP</h2>

            <input
                type="text"
                placeholder="Enter OTP"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
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
                    onClick={handleVerify}
                    className="w-full py-3 rounded-xl font-bold transition transform hover:scale-105"
                    style={{
                        backgroundColor: "#948979",
                        color: "#222831",
                        boxShadow: "0 6px 15px rgba(0,0,0,0.6)",
                    }}
                >
                    Verify OTP
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





//// =========================
///// SIGNUP COMPONENT
/// ===============================
export const Signup = () => {
    const { mail, isLoading, setIsLoading, setUi, setMail } = useGlobalContext();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPass, setVerifyPass] = useState("");
    const navigate = useNavigate();

    async function handleSignup() {
        if (!firstName || !lastName || !mail || !password || !verifyPass || !phone) {
            toast.error("Please fill all fields");
            return;
        }
        if (password !== verifyPass) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setIsLoading(true);
            const res = await axios.post(
                `${import.meta.env.VITE_DOMAIN}/api/admin/signup`,
                { firstName, lastName, mail, password, phone },
                { withCredentials: true }
            );

            toast.success(res.data.msg || "Signup Successful ✅");
            setUi(0);
            setMail("");
            navigate("/admin");
        } catch (error) {
            toast.error("❌ " + (error.response?.data?.error || error.message));
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) return <SignupSkeleton />;

    return (
        <div className="space-y-6">
            <h2
                className="text-center text-3xl font-bold mb-2"
                style={{ color: "#DFD0B8" }}
            >
                Create Account
            </h2>

            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Verified Email"
                    value={mail}
                    readOnly
                    className="w-full text-center rounded-xl p-3 outline-none shadow-inner bg-[#222831] text-[#b3aca1]"
                />
                <InputField placeholder="First Name" value={firstName} setValue={setFirstName} />
                <InputField placeholder="Last Name" value={lastName} setValue={setLastName} />
                <InputField placeholder="Phone Number" value={phone} setValue={setPhone} maxLength={10} />
                <InputField placeholder="Password" type="password" value={password} setValue={setPassword} />
                <InputField placeholder="Confirm Password" type="password" value={verifyPass} setValue={setVerifyPass} />
            </div>

            <div className="flex flex-col gap-3">
                <button
                    onClick={handleSignup}
                    className="w-full py-3 rounded-xl font-bold transition transform hover:scale-105"
                    style={{
                        backgroundColor: "#948979",
                        color: "#222831",
                        boxShadow: "0 6px 15px rgba(0,0,0,0.6)",
                    }}
                >
                    Sign Up
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








////// REUSABLE INPUT COMPONENT
const InputField = ({ placeholder, type = "text", value, setValue, maxLength }) => (
    <input
        type={type}
        placeholder={placeholder}
        value={value}
        maxLength={maxLength}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-xl p-3 outline-none focus:ring-2 shadow-inner"
        style={{
            backgroundColor: "#222831",
            color: "#DFD0B8",
            border: "1px solid #948979",
            boxShadow:
                "inset 2px 2px 6px rgba(0,0,0,0.6), inset -2px -2px 6px rgba(255,255,255,0.05)",
        }}
    />
);
