import axios from 'axios'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast';
import { useGlobalContext } from '../utils/context/MyContext';
import defaultimg from "../assets/default.png"
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Home = () => {
    const { orignalData, setOrignalData } = useGlobalContext()


    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await axios.get(`${import.meta.env.VITE_DOMAIN}/api/all-posts`);
                // console.log(res.data);
                setOrignalData(res.data.data)

            } catch (error) {
                toast.error("Error fetching posts:", error);
            }
        }

        fetchPosts();
    }, [])
    // console.log(orignalData)
    let newData = orignalData.sort((a, b) => b - a)
    console.log(newData)
    return (
        <div className=" absolute min-w-[100%] min-h-[100%] overflow-hidden">
            <div className="fixed inset-0  ">
                <div className="h-99 w-99 bg-[#e8f6fef2] rounded-full absolute top-7 -right-20  "></div>
                <div className="h-99 w-99 bg-[#a695fd3e] rounded-full absolute -bottom-10 -left-20  "></div>
            </div>

            <div id='con' className='w-[85vw] border min-h-screen flex flex-col mx-auto relative max-md:w-[100vw]'>
                <Navbar />
                <div id="fn" className='bg-slate-50 fixed shadow-gray-500 max-md:shadow-inner max-md:rounded-t-sm flex w-full justify-between p-1 max-md:z-10 max-md:bottom-0 md:mt-15 md:relative'>
                    <button>a</button>
                    <button>b</button>
                    <button>c</button>
                    <button>d</button>
                </div>


                <div id="mainContent" className='min-lg:mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 '>
                    {orignalData && orignalData.length > 0 ? orignalData.map((items) => {
                        return (
                            <CarCard key={items._id} car={items} />
                        )
                    })
                        : <p>No Data Found</p>}
                </div>
            </div>
        </div>
    )
}

export default Home








export const CarCard = ({ car }) => {
    const {
        _id,
        brand,
        model,
        color,
        fuelType,
        images = [],
        kilometersDriven,
        registrationYear,
        variant,
        price,
    } = car || {};
    const nav = useNavigate()

    const imageSrc = images[0] || { defaultimg }
    const formattedPrice = price?.amount != null ? price.amount.toLocaleString("en-IN") : "—";
    const kmText = kilometersDriven != null ? `${kilometersDriven.toLocaleString("en-IN")} km` : "";
    const imageCount = images.length || 0;

    return (
        <div
            key={_id}
            onClick={() => nav(`/detailview/${_id}`)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden 
                 hover:shadow-xl transition-all duration-200 cursor-pointer
                 w-full"
        >
            {/* Image section */}
            <div className="relative w-full">
                <img
                    src={imageSrc}
                    alt={model}
                    className="w-full h-40 xs:h-48 sm:h-52 md:h-56 object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/40 pointer-events-none" />

                {/* Top-left: year + fuel */}
                <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex gap-1.5 sm:gap-2">
                    {registrationYear && (
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/90 
                             text-[9px] sm:text-[11px] font-semibold tracking-wide uppercase text-gray-800 shadow-sm">
                            {registrationYear}
                        </span>
                    )}

                    {fuelType && (
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/70 
                             text-[9px] sm:text-[11px] font-semibold tracking-wide uppercase text-white shadow-sm">
                            {fuelType}
                        </span>
                    )}
                </div>

                {/* Top-right: image count */}
                {imageCount > 0 && (
                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/70 
                             text-[9px] sm:text-[11px] font-medium text-white shadow-sm">
                            1/{imageCount}
                        </span>
                    </div>
                )}

                {/* Bottom-left: variant */}
                {variant && (
                    <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2">
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/65 
                             text-[9px] sm:text-[11px] font-medium text-white shadow-sm">
                            {variant}
                        </span>
                    </div>
                )}

                {/* Bottom-right: km */}
                {kmText && (
                    <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2">
                        <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/65 
                             text-[9px] sm:text-[11px] font-medium text-white shadow-sm">
                            {kmText}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="px-3 sm:px-4 pt-2.5 sm:pt-3 pb-3 sm:pb-4 flex flex-col gap-1.5 sm:gap-2">
                {/* Title */}
                <p className="text-[13px] sm:text-[15px] font-semibold text-gray-900 leading-snug line-clamp-1 flex items-center justify-between">
                    {model && <span className="uppercase">{model}</span>}
                    {brand && <span className="capitalize">{brand} </span>}
                </p>

                {/* Price + color */}
                <div className="flex items-center justify-between mt-0.5 sm:mt-1 gap-2">
                    <p className="text-lg sm:text-xl font-bold text-emerald-600">
                        ₹ {formattedPrice}
                    </p>

                    {color && (
                        <span className="px-2.5 sm:px-3 py-0.5 rounded-full bg-gray-100 
                             text-[10px] sm:text-[11px] text-gray-700 whitespace-nowrap">
                            {color}
                        </span>
                    )}
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                    {registrationYear && (
                        <span className="px-2.5 sm:px-3 py-0.5 rounded-full bg-gray-100 
                             text-[10px] sm:text-[11px] text-gray-700">
                            Reg. {registrationYear}
                        </span>
                    )}

                    {fuelType && (
                        <span className="px-2.5 sm:px-3 py-0.5 rounded-full bg-gray-100 
                             text-[10px] sm:text-[11px] text-gray-700">
                            {fuelType}
                        </span>
                    )}

                    {variant && (
                        <span className="px-2.5 sm:px-3 py-0.5 rounded-full bg-gray-100 
                             text-[10px] sm:text-[11px] text-gray-700">
                            {variant}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};






