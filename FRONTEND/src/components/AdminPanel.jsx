import { useGlobalContext } from "../utils/context/MyContext";
import car2 from "../assets/car2.svg";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
// import LeftSidebar from "./LeftSidebar";
import { useState } from "react";

export const AdminNavbar = () => {
    const fontStyle1 = { color: "#dfd0b8" };
    const backgroundColor = { backgroundColor: "#222831" };
    const userData = useSelector((store) => store.User);
    const navigate = useNavigate();
    // console.log("user:", userData);

    async function adminBtnHandler() {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_DOMAIN}/api/admin/logout`,
                {},
                { withCredentials: true }
            );
            console.log(res + "ek baar chala");
            toast.success(res.data.msg);
            navigate("/admin");
        } catch (error) {
            toast.error("Login Failed ❌ " + error.response.data.error);
        } finally {
        }
    }
    return (
        <div
            style={backgroundColor}
            className="flex justify-between fixed min-w-[100vw] p-2 z-10 top-0 left-0 shadow-2xs drop-shadow-cyan-800 "
        >
            <div id="left" className="flex justify-between items-center gap-5">
                <img src={car2} alt="GCC" className="h-12" />
                <h1 className="text-[#DFD0B8]">GOOD CHOICE CAR</h1>
            </div>
            <div id="right" className="flex justify-between items-center gap-5">
                <button
                    style={fontStyle1}
                    className="cursor-pointer flex  items-center gap-1"
                >
                    <i className="fa-solid fa-user-tie"></i>Welcome {userData.firstName}
                </button>
                <button
                    style={fontStyle1}
                    className="cursor-pointer mr-2 items-center gap-1 shadow-inner shadow-amber-100 p-1 rounded"
                    onClick={adminBtnHandler}
                >
                    <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
                </button>
            </div>
        </div>
    );
};




export const LeftSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen((prev) => !prev);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 sm:hidden z-20 "
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-16 z-50 py-2 px-2 shadow-inner bg-[#222831fa] h-[95vh] flex flex-col gap-3 transition-all duration-300
                             overflow-hidden ${isOpen ? "w-[60%] sm:w-[220px]" : "w-[70px]"} `}
            >
                {/* Toggle Button */}
                <div className="flex items-center justify-between px-2 py-3 ">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded hover:bg-[#48A6A7] text-gray-200 shadow-inner shadow-amber-100 "
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>

                    {isOpen && (
                        <button
                            onClick={toggleSidebar}
                            className="text-gray-200 text-lg hover:bg-[#48A6A7] p-2 rounded shadow-inner shadow-amber-100"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    )}
                </div>

                {/* Nav Menu Links */}
                {[
                    { link: "/adminPanel", icon: "fa-house", label: "Home", type: "regular", },
                    { link: "/posts", icon: "fa-border-none", label: "Posts" },
                    { link: "/", icon: "fa-plus", label: "Add Posts" },
                    { link: "/", icon: "fa-people-carry-box", label: "Enquiry" },
                    { link: "/", icon: "fa-user", label: "Accounts" },
                    { link: "/", icon: "fa-gear", label: "Settings" },
                ].map(({ link, icon, label, type }, i) => (
                    <NavLink
                        key={i}
                        to={link}
                        className={({ isActive }) =>
                            `flex items-center rounded px-3 py-3 shadow-inner shadow-amber-100 transition 
                              text-gray-300 hover:bg-[#48A6A7]
                              ${isActive ? "bg-[#48A6A7] text-white font-bold" : ""}
                              ${isOpen ? "gap-3 justify-start pl-3" : "justify-center"}`
                        }
                    >
                        <i className={`fa-${type || "solid"} ${icon} text-lg`}></i>
                        {isOpen && <span>{label}</span>}
                    </NavLink>
                ))}
            </div>
        </>
    );
};










export const AdminPanel = () => {
    const { isDark, setIsDark, isLoading, setIsLoading } = useGlobalContext();
    const fontStyle1 = { color: "#dfd0b8" };
    const backgroundColor = { backgroundColor: "#222831" };

    return (
        <div className=" absolute min-w-[100%] min-h-[100%] overflow-hidden">
            <AdminNavbar />
            <div className="absolute inset-0 ">
                <div className="h-99 w-99 bg-[#e8f6fea7] rounded-full absolute top-7 -right-20  "></div>
                <div className="h-99 w-99 bg-[#a695fd20] rounded-full absolute -bottom-10 -left-20  "></div>
            </div>
            <div >
                <div className="flex justify-between">
                    <LeftSidebar />
                    {/* <div id="left" className="left-0 top-1/3-translate-y-1/1 relative">
                       dfghjkytrewrtuyfjthrgfe
                    </div> */}
                </div>
            </div>
        </div>
    );
};
