// import { useGlobalContext } from "../utils/context/MyContext";
import logo from "../assets/logo2.png";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";





export const AdminNavbar = () => {
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
            
            className="flex justify-between fixed min-w-[100vw] p-2 z-10 top-0 left-0  shadow-lg min-lg:w-[100vw] bg-gray-100 max-md:w-svw"
        >
            <div id="left" className="flex justify-between items-center gap-5">
                <img src={logo} alt="GCC" className="h-8 rounded-full" />
                <h1 className="text-[#000000]">GOOD CHOICE CAR</h1>
            </div>
            <div id="right" className="flex justify-between items-center gap-5">
                <button
                    
                    className="cursor-pointer flex  items-center gap-1 max-md:hidden"
                >
                    <i className="fa-solid fa-user-tie"></i>Welcome {userData.firstName}
                </button>
                <button
                
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

            {isOpen && (<div className="fixed inset-0 bg-black/40 sm:hidden z-20 min-h-svh" onClick={toggleSidebar} />)}

            <div
                className={`fixed left-0 top-12 bg-gray-100 backdrop-blur-xs z-50 py-2 px-2 shadow-lg shadow-gray-500 h-[95vh] flex flex-col gap-3 transition-all duration-300
                             overflow-hidden ${isOpen ? "w-[60%] sm:w-[220px]" : "w-[70px] " } `}
            >

                <div className="flex items-center justify-between px-2 py-3 ">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded hover:bg-[#48A6A7] text-black shadow-inner shadow-gray-400 cursor-pointer"
                    >
                        <i className="fa-solid fa-bars"></i>
                    </button>

                    {isOpen && (
                        <button
                            onClick={toggleSidebar}
                            className="text-black text-lg hover:bg-[#48A6A7] p-2 rounded shadow-inner shadow-gray-400 cursor-pointer"
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    )}
                </div>


                {[
                    { link: "/", icon: "fa-house", label: "Home", type: "regular", },
                    { link: "/posts", icon: "fa-border-none", label: "Active Posts" },
                    { link: "/addpost", icon: "fa-plus", label: "Add Posts" },
                    { link: "/", icon: "fa-people-carry-box", label: "Enquiry" },
                    { link: "/accounts", icon: "fa-user", label: "Accounts" },
                    { link: "/", icon: "fa-gear", label: "Settings" },
                ].map(({ link, icon, label, type }, i) => (
                    <NavLink
                        key={i}
                        to={link}
                        className={({ isActive }) =>
                            `flex items-center rounded px-3 py-3 shadow-inner shadow-gray-500 transition 
                              text-black hover:bg-[#48A6A7]
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

    return (
        <div className=" absolute min-w-[100%] min-h-[100%] overflow-hidden">
            <AdminNavbar />
            <div className="fixed inset-0  ">
                <div className="h-99 w-99 bg-[#e8f6fef2] rounded-full absolute top-7 -right-20  "></div>
                <div className="h-99 w-99 bg-[#a695fd3e] rounded-full absolute -bottom-10 -left-20  "></div>
            </div>
            <div >
                <div className="flex justify-between">
                    <LeftSidebar />
                </div>
            </div>
            <div className="relative mt-18 ml-25 mr-8 border p-1 h-[90vh] overflow-y-scroll ">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Similique maiores aliquam, repellendus suscipit ducimus corrupti ea voluptates possimus fuga cum iusto beatae ratione asperiores culpa reprehenderit assumenda. Illum ea eum vel nesciunt sed nisi ipsum, nostrum hic ipsam esse minus voluptatibus in eius officiis, nobis sit veniam atque delectus, assumenda sapiente. Nesciunt consectetur quo quisquam. Odit nemo iste ratione pariatur ab quis, vel quam qui, illum veniam delectus? Obcaecati asperiores, distinctio a laborum ea sit. Minus quidem, voluptatibus architecto eius, debitis beatae fugit excepturi ratione a iste enim obcaecati recusandae corrupti, magni dolorum inventore. Inventore obcaecati vitae aspernatur ratione alias voluptas autem fugit soluta adipisci sed, amet facere, similique velit quibusdam iste maiores sequi voluptatibus eum quas magni non in? Totam ducimus animi quasi, repudiandae magni commodi quisquam nulla delectus sint aut. Quos repellat veritatis eligendi corrupti quo natus recusandae dignissimos esse sed hic, tempore doloremque et rem ipsa, illum illo itaque suscipit minima vitae excepturi quibusdam dolorum! Nihil vel, quas, at exercitationem iusto recusandae quae sapiente animi dolores magni saepe praesentium explicabo repellat perferendis quibusdam ex minima quisquam, mollitia temporibus enim hic expedita incidunt nisi officiis. Voluptatem, exercitationem? Voluptates architecto veritatis odio pariatur corporis fugiat velit deleniti aspernatur commodi eius explicabo molestias nulla doloremque at id minima rem consequatur laborum suscipit recusandae voluptatibus impedit illum, nam quisquam. Nam praesentium deserunt hic ea id doloribus minima, aspernatur labore laboriosam, veniam, ipsam rerum vitae totam.
            </div>
        </div>
    );
};
