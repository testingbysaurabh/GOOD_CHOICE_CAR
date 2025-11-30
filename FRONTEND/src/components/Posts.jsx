import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AdminPanel } from "./AdminPanel";
import axios from "axios";
import toast from "react-hot-toast";
import { removePost } from "../utils/store/UserSlice";
import { useNavigate } from "react-router-dom";

const Posts = () => {
    const userData = useSelector((store) => store.User.posts);
    const [deletingId, setDeletingId] = useState(null);
    const [editId, setEditId] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function convertDateTime(isoString) {
        const date = new Date(isoString);

        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";

        hours = hours % 12 || 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        const time = `${hours}:${minutes} ${ampm}`;

        const day = date.getDate();
        const month = date.toLocaleString("en-US", { month: "short" });
        const year = date.getFullYear();

        const finalDate = `${day} ${month} ${year}`;

        return `${finalDate} • ${time}`;
    }

    const deletefnhandler = async (id) => {
        try {
            setDeletingId(id);
            const res = await axios.delete(
                `${import.meta.env.VITE_DOMAIN}/api/admin/posts/delete/${id}`,
                { withCredentials: true }
            );
            toast.success("Post deleted successfully ✅");
            dispatch(removePost(id));
        } catch (error) {
            // console.log(error)
            toast.error(error.message || "Failed to delete post ❌");
        } finally {
            setDeletingId(null);
        }
    };

    console.log(userData);

    return (
        <div>
            <AdminPanel />

            <div className="absolute mt-20 ml-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5 w-[93%]">
                {userData && userData.length > 0 ? (
                    userData.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                        >
                         
                            <div className="relative">
                                <img
                                    src={item.images?.[0]}
                                    className="w-full h-48 object-cover"
                                    alt={item.model}
                                />

                            
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/40 pointer-events-none" />

                             
                                <div className="absolute top-2 left-2 flex gap-2">
                                    <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/90 text-gray-800 font-semibold">
                                        {item.registrationYear || "Year N/A"}
                                    </span>
                                    {item.fuelType && (
                                        <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-black/60 text-white font-medium">
                                            {item.fuelType}
                                        </span>
                                    )}
                                </div>

                          
                                {item.variant && (
                                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end text-xs text-white">
                                        <p className="font-medium line-clamp-1">{item.variant}</p>
                                        {item.kilometersDriven != null && (
                                            <p className="text-[11px] bg-black/50 px-2 py-0.5 rounded-full">
                                                {item.kilometersDriven?.toLocaleString("en-IN")} km
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                    
                            <div className="p-3 flex flex-col gap-2 flex-1">
                     
                                <p className="font-semibold text-gray-900 text-sm line-clamp-1">
                                    {item.brand} {item.model}
                                </p>

                
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-lg font-bold text-emerald-600">
                                        ₹ {item.price?.amount?.toLocaleString("en-IN") || "—"}
                                    </p>
                                    {item.color && (
                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                            {item.color}
                                        </span>
                                    )}
                                </div>

                               
                                <div className="flex flex-wrap gap-1.5 text-[11px]">
                                    {item.registrationYear && (
                                        <span className="px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100 text-gray-600">
                                            Reg. {item.registrationYear}
                                        </span>
                                    )}
                                    {item.fuelType && (
                                        <span className="px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100 text-gray-600">
                                            {item.fuelType}
                                        </span>
                                    )}
                                    {item.variant && (
                                        <span className="px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100 text-gray-600 line-clamp-1">
                                            {item.variant}
                                        </span>
                                    )}
                                </div>

                               
                                <p className="text-[11px] text-gray-400">
                                    Uploaded on {convertDateTime(item.createdAt)}
                                </p>
                            </div>

                          
                            <div className="px-3 pb-3 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                                <div className="flex flex-col text-[11px] text-gray-500 leading-tight">
                                    {item.kilometersDriven != null && (
                                        <span>
                                            {item.kilometersDriven?.toLocaleString("en-IN")} km driven
                                        </span>
                                    )}
                                    {item.fuelType && <span>{item.fuelType}</span>}
                                </div>

                                <div className="flex gap-1">
                                    <button
                                        onClick={() => deletefnhandler(item._id)}
                                        type="button"
                                        disabled={deletingId === item._id}
                                        className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all border active:scale-[0.97]
                                        ${deletingId === item._id
                                                ? "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed opacity-70"
                                                : "bg-red-50 border-red-100 text-red-600 hover:bg-red-100 hover:border-red-200 cursor-pointer"
                                            }`}
                                    >
                                        {deletingId === item._id ? "Deleting..." : "Delete"}
                                    </button>

                                    <button
                                        onClick={() => navigate(`/postedit/${item._id}`)}
                                        type="button"
                                        disabled={editId === item._id}
                                        className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all border active:scale-[0.97]
                                                   ${editId === item._id
                                                ? "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed opacity-70"
                                                : "bg-red-50 border-red-100 text-red-600 hover:bg-red-100 hover:border-red-200 cursor-pointer"
                                            }`}
                                    >
                                        {editId === item._id ? "Editing..." : "Edit"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (<p className="text-gray-500 col-span-full text-sm text-center py-10">No posts found.</p>)}
            </div>
        </div>
    );
};

export default Posts;
