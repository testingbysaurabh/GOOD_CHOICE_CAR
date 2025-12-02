import React from 'react'
import logo from "../assets/logo2.png"
const Navbar = () => {
    return (

        <nav className='fixed top-0 w-[85vw] rounded flex items-center justify-between p-2 mx-auto
                    shadow-gray-900 shadow-lg max-md:w-full max-sm:p-1 max-md:fixed bg-slate-50 max-md:top-0 z-20'>
            <div id='logo' className='flex justify-between items-center'>
                <img src={logo} alt="GCC" className='h-10 w-15 p-1 ml-2' />
                <h1>GOOD CHOICE CAR</h1>
            </div>

            <div id="search" className='items-center flex '>
                <input type="text" placeholder=' Search for used car ' className='rounded absolute bg-neutral-100 p-2 px-4  max-md:hidden' />
                <i className="fa-solid fa-magnifying-glass min-lg:relative min-lg:left-44"></i>
            </div>
            <a href='https://maps.app.goo.gl/K1WkYmiTh5S7yFiG6?g_st=ipc' id="area" className='flex justify-between items-center gap-2 px-2 max-md:gap-0'>
                {/* <i className="fa-solid fa-location-dot"></i> */}
                <i className="fa-solid fa-route"></i>
                <p className='max-md:hidden'>Motihari</p>
            </a>

        </nav>

    )
}

export default Navbar