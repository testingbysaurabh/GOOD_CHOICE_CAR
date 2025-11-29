import React from 'react'
import { NavLink } from "react-router-dom";




const LeftSidebar = () => {
    return (
        <div className="flex justify-between flex-col relative z-10  w-[20%] border-2 bg-[#222831] min-h-screen">
            <NavLink
                to="/adminPanel"
                className={({ isActive }) =>
                    `flex items-center gap-1 ${isActive
                        ? "text-[#dfd0b8] font-bold"
                        : "text-gray-300 hover:text-[#48A6A7]"
                    } bg-red-400`
                }
            >
                <span>
                    <i className="fa-regular fa-house"></i>
                </span>{" "}
                Home
            </NavLink>

            <NavLink
                to="/posts"
                className={({ isActive }) =>
                    `flex items-center gap-1 ${isActive
                        ? "text-[#dfd0b8] font-bold"
                        : "text-gray-300 hover:text-[#48A6A7]"
                    }`
                }
            >
                <span>
                    <i className="fa-solid fa-border-none"></i>
                </span>{" "}
                Posts
            </NavLink>

            <NavLink
                to="/"
                className={({ isActive }) =>
                    `flex items-center gap-1 ${isActive
                        ? "text-[#dfd0b8] font-bold"
                        : "text-gray-300 hover:text-[#48A6A7]"
                    }`
                }
            >
                <span>
                    <i className="fa-solid fa-plus"></i>
                </span>{" "}
                Add Posts
            </NavLink>

            <NavLink
                to="/"
                className={({ isActive }) =>
                    `flex items-center gap-1 ${isActive
                        ? "text-[#dfd0b8] font-bold"
                        : "text-gray-300 hover:text-[#48A6A7]"
                    }`
                }
            >
                <span>
                    <i className="fa-solid fa-people-carry-box"></i>
                </span>{" "}
                Enquiry
            </NavLink>

            <NavLink
                to="/"
                className={({ isActive }) =>
                    `flex items-center gap-1 ${isActive
                        ? "text-[#dfd0b8] font-bold"
                        : "text-gray-300 hover:text-[#48A6A7]"
                    }`
                }
            >
                <span>
                    <i className="fa-solid fa-user"></i>
                </span>
                Accounts
            </NavLink>

            <NavLink
                to="/"
                className={({ isActive }) =>
                    `flex items-center gap-1 ${isActive
                        ? "text-[#dfd0b8] font-bold"
                        : "text-gray-300 hover:text-[#48A6A7]"
                    }`
                }
            >
                <span>
                    <i className="fa-solid fa-gear"></i>
                </span>
                Settings
            </NavLink>
        </div>
    )
}

export default LeftSidebar