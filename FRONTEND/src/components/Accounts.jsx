import React, { useEffect } from 'react'
import { AdminPanel } from './AdminPanel'
import { useSelector } from 'react-redux'


const Accounts = () => {
    const userData = useSelector((store) => store.User);

    useEffect(() => {
        console.log(userData)
    }, [])

    return (
        <div className="min-h-screen bg-slate-100">
            <AdminPanel />

            <div className="fixed mt-24 ml-24 mr-6 h-[80vh] w-[calc(100%-6rem)]">

                {/* Background decorations */}
                <div className="absolute top-0 left-0 h-64 w-64 bg-blue-700 rounded-full " />
                <div className="absolute bottom-0 right-0 h-64 w-64 bg-indigo-700 rounded-full " />

                {/* Main container */}
                <div className="
                    relative
                    z-10
                    h-full
                    w-full
                    bg-white/70
                    backdrop-blur-xl
                    border
                    border-slate-200
                    rounded-2xl
                    shadow-xl
                    p-6
                    flex
                    gap-6
                ">

                    {/* Left panel */}
                    <div className="
                        w-[30%]
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                        p-4
                        flex
                        items-center
                        justify-center
                        text-slate-600
                        font-medium
                    ">
                        a
                    </div>

                    {/* Right panel */}
                    <div className="
                        w-[70%]
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                        p-4
                        flex
                        items-center
                        justify-center
                        text-slate-600
                        font-medium
                    ">
                        b
                    </div>

                </div>
            </div>
        </div>
    )
}


export default Accounts
