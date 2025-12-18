import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import Navbar from './Navbar'
import { DetailSkeleton } from './Simmer'
import Nocarfound from "../assets/Nocarfound.png"


const DetailView = () => {
    const { posts } = useSelector((state) => state.publicSlice || { posts: [] })
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const id = searchParams.get("id")
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const postUrl = `${window.location.origin}/detail?id=${id}`;




    useEffect(() => {
        if (posts && posts.length > 0) {
            const found = posts.find((item) => String(item._id) === String(id))
            if (found) {
                setData(found)
                setLoading(false)
                return
            }
        }

        async function getData() {
            try {
                const res = await axios.get(`${import.meta.env.VITE_DOMAIN}/api/posts/${id}`)
                setData(res.data.data)
            } catch (error) {
                toast.error(error.response?.data?.error || error.message)
            } finally {
                setLoading(false)
            }
        }
        getData()
    }, [id, posts])

    if (loading) {
        return <DetailSkeleton />
    }

    if (!data) {
        return (
            <div className="absolute min-w-[100%] min-h-[100%] overflow-hidden">
                <div className="fixed inset-0">
                    <div className="h-99 w-99 bg-[#e8f6fef2] rounded-full absolute top-7 -right-20"></div>
                    <div className="h-99 w-99 bg-[#a695fd3e] rounded-full absolute -bottom-10 -left-20"></div>
                </div>
                <div className='w-[85vw] min-h-screen flex items-center justify-center mx-auto relative max-md:w-[100vw]'>
                    {/* <div className="text-center text-gray-600">Car not found</div> */}
                    <img className="w-[70%] max-md:w-[100vw] rounded-full h-full object-contain" src={Nocarfound} alt="Nocarfound" />

                </div>
            </div>
        )
    }



    const {
        brand,
        model,
        variant,
        price,
        kilometersDriven,
        manufacturingYear,
        registrationYear,
        owners,
        fuelType,
        transmission,
        color,
        seller,
        insurance,
        images = [],
        author
    } = data

    const phone = seller?.contact || '';


    const formattedPrice = price?.amount ? price.amount.toLocaleString("en-IN") : "—"
    const kmText = kilometersDriven ? `${kilometersDriven.toLocaleString("en-IN")} km` : "—"

    const nextImage = () => {
        if (images.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length)
        }
    }

    const prevImage = () => {
        if (images.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
        }
    }
    const whatsappMessage = `Hello, I am interested in this car 🚗Car: ${brand} ${model}Price: ₹${formattedPrice}View Details:${postUrl}`;


    return (
        <div className="absolute min-w-[100%] min-h-[100%] overflow-hidden">
            <div className="fixed inset-0">
                <div className="h-99 w-99 bg-[#e8f6fef2] rounded-full absolute top-7 -right-20"></div>
                <div className="h-99 w-99 bg-[#a695fd3e] rounded-full absolute -bottom-10 -left-20"></div>
            </div>

            <Navbar />

            <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
                <div className="flex justify-between items-center gap-4 px-6 py-2 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_15px_rgba(0,0,0,0.12)]">

                    {/* Call */}
                    <a
                        href={`tel:+91${phone}`}
                        className="flex-1 flex justify-center items-center gap-2 py-2 rounded-xl bg-blue-600 text-white font-semibold active:scale-95 transition"
                    >
                        <i className="fa-solid fa-phone"></i>
                        Call
                    </a>

                    {/* WhatsApp */}
                    <a
                        href={`https://wa.me/91${phone}?text=${encodeURIComponent(whatsappMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex justify-center items-center gap-2 py-2 rounded-xl bg-green-600 text-white font-semibold active:scale-95 transition"
                    >
                        <i className="fa-brands fa-whatsapp"></i>
                        WhatsApp
                    </a>
                </div>
            </div>



            <div className="bg-white top-18 max-md:top-16 rounded-2xl shadow-lg  border border-gray-100 overflow-hidden mb-18 relative">
                <button
                    onClick={() => navigate(-1)}
                    className="shadow-md cursor-pointer flex items-center z-10 absolute top-5 left-5 max-md:top-3 max-md:left-1  px-1 max-md:px-1 text-white rounded-md hover:bg-blue-600 transition-colors w-fit"
                >
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                {/* Image Gallery */}
                {images.length > 0 && (
                    <div className="relative w-full h-96 md:h-[500px] bg-gray-100">
                        <img
                            src={images[currentImageIndex]}
                            alt={`${model} - Image ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover"
                        />


                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 shadow-md shadow-slate-200 bg-[#0000004e] text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                                >
                                    &#10216;
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 shadow-md shadow-slate-200 bg-[#0000004e] text-white p-2 rounded-full hover:bg-black/90 transition-colors"
                                >
                                    &#10217;
                                </button>
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#0000004e] text-white px-3 py-1 rounded-full text-sm">
                                    {currentImageIndex + 1} / {images.length}
                                </div>
                            </>
                        )}

                        {/* Image thumbnails */}
                        {images.length > 1 && (
                            <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-4 pb-2">
                                {images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Thumbnail ${idx + 1}`}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${idx === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                                            } hover:border-blue-300 transition-colors`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-4 md:p-8">
                    {/* Title Section */}
                    <div className="mb-6">
                        <h1 className="max-md:text-2xl text-3xl md:text-4xl font-bold text-gray-900">
                            {model && <span className="uppercase">{model}</span>}
                            {brand && <span className="capitalize ml-2">{brand}</span>}
                        </h1>

                        <div className='flex justify-between'>
                            <div className="mt-4 max-md:mt-2">
                                <span className="text-2xl md:text-3xl font-bold text-emerald-600">
                                    ₹ {formattedPrice}
                                </span>
                                {price?.currency && (
                                    <span className="text-gray-500 ml-2">{price.currency}</span>
                                )}
                            </div>
                            <div className="p-1 flex gap-2 items-center justify-between max-md:hidden w-[400px] bg-gray-100 rounded-xl  shadow-md">
                                <a href={`tel:${phone}`}
                                    className="cursor-pointer flex items-center gap-2 p-2 rounded-xl bg-blue-600 text-white font-semibold active:scale-95 transition w-[45%] shadow-md"
                                >
                                    <i className="fa-solid fa-phone text-2xl md:text-3xl "></i>
                                    <p>Call Now</p>
                                </a>
                                <a
                                    href={`https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-pointer flex items-center gap-2 p-2 rounded-xl bg-green-600 text-white font-semibold active:scale-95 transition w-[45%] shadow-md "

                                >
                                    <i className="fa-brands fa-whatsapp text-2xl md:text-3xl"></i>
                                    <p>WhatsApp</p>
                                </a>
                            </div>



                        </div>
                    </div>

                    {/* Key Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {variant && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 mb-1">Variant</p>
                                <p className="text-lg font-semibold text-gray-900">{variant}</p>
                            </div>
                        )}
                        {registrationYear && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 mb-1">Registration Year</p>
                                <p className="text-lg font-semibold text-gray-900">{registrationYear}</p>
                            </div>
                        )}
                        {kmText !== "—" && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 mb-1">Kilometers Driven</p>
                                <p className="text-lg font-semibold text-gray-900">{kmText}</p>
                            </div>
                        )}
                        {fuelType && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 mb-1">Fuel Type</p>
                                <p className="text-lg font-semibold text-gray-900">{fuelType}</p>
                            </div>
                        )}
                        {transmission && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 mb-1">Transmission</p>
                                <p className="text-lg font-semibold text-gray-900">{transmission}</p>
                            </div>
                        )}
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Car Details</h2>
                            <div className="space-y-3">
                                {manufacturingYear && (
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Manufacturing Year</span>
                                        <span className="font-medium text-gray-900">{manufacturingYear}</span>
                                    </div>
                                )}
                                {owners && (
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Owners</span>
                                        <span className="font-medium text-gray-900">{owners}</span>
                                    </div>
                                )}
                                {color && (
                                    <div className="flex justify-between py-2 border-b border-gray-200">
                                        <span className="text-gray-600">Color</span>
                                        <span className="font-medium text-gray-900">{color}</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-600">Insurance</span>
                                    <span className={`font-medium ${insurance ? 'text-green-600' : 'text-red-600'}`}>
                                        {insurance ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {seller && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Seller Information</h2>
                                <div className="space-y-3">
                                    {seller.sellerName && (
                                        <div className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-gray-600">Seller Name</span>
                                            <span className="font-medium text-gray-900">{seller.sellerName}</span>
                                        </div>
                                    )}
                                    {seller.contact && (
                                        <div className="flex justify-between py-2 border-b border-gray-200">
                                            <span className="text-gray-600">Contact</span>
                                            <a href={`tel:${seller.contact}`} className="font-medium text-blue-600 hover:text-blue-800">
                                                {seller.contact}
                                            </a>
                                        </div>
                                    )}
                                    {seller.location && (
                                        <>
                                            {seller.location.city && (
                                                <div className="flex justify-between py-2 border-b border-gray-200">
                                                    <span className="text-gray-600">City</span>
                                                    <span className="font-medium text-gray-900">{seller.location.city}</span>
                                                </div>
                                            )}
                                            {seller.location.area && (
                                                <div className="flex justify-between py-2 border-b border-gray-200">
                                                    <span className="text-gray-600">Area</span>
                                                    <span className="font-medium text-gray-900">{seller.location.area}</span>
                                                </div>
                                            )}
                                            {seller.location.pincode && (
                                                <div className="flex justify-between py-2 border-b border-gray-200">
                                                    <span className="text-gray-600">Pincode</span>
                                                    <span className="font-medium text-gray-900">{seller.location.pincode}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 max-md:mb-11">
                        {registrationYear && (
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                                Reg. {registrationYear}
                            </span>
                        )}
                        {fuelType && (
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                                {fuelType}
                            </span>
                        )}
                        {transmission && (
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                                {transmission}
                            </span>
                        )}
                        {color && (
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                                {color}
                            </span>
                        )}
                        {variant && (
                            <span className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700">
                                {variant}
                            </span>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default DetailView