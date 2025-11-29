import React from "react";

import {  AdminPanel } from "./AdminPanel";
import { useSelector } from "react-redux";

function convertDateTime(isoString) {
    const date = new Date(isoString);

    // -------- Time (12 hr format) --------
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    let time = `${hours}:${minutes} ${ampm}`;

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    let finalDate = `${day} ${month} ${year}`;

    return `${finalDate} • ${time}`;
}



const Posts = () => {
    const userData = useSelector((store) => store.User.posts);

    console.log(userData);

    return (
        <div>
            <AdminPanel />

      
            <div className=" absolute mt-24  ml-20 grid  grid-cols-1  sm:grid-cols-2  lg:grid-cols-4  xl:grid-cols-4  gap-5 w-[93%]"
            >
                {userData && userData.length > 0 ? (
                    userData.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition"
                        >
                            <img
                                src={item.images?.[0]}
                                className="w-full h-48 object-cover"
                                alt={item.model}
                            />

                            <div className="p-3 space-y-1">
                                <p className="font-semibold text-gray-800 capitalize">
                                    {item.brand} {item.model}
                                </p>
                                <p className="text-sm text-gray-600">
                                    ₹ {item.price?.amount?.toLocaleString("en-IN")}
                                </p>
                                <p className="text-xs text-gray-500">
                                    CreatedAt: {convertDateTime(item.createdAt)}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full">No posts found.</p>
                )}
            </div>
        </div>
    );
};

export default Posts;
