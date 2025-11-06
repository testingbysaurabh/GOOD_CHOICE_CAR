
import { useGlobalContext } from '../utils/context/MyContext'
import car2 from "../assets/car2.svg"
import { useSelector } from 'react-redux'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate ,NavLink} from 'react-router-dom'







export const AdminNavbar = () => {
    const fontStyle1 = { color: "#dfd0b8" }
    const backgroundColor = { backgroundColor: "#222831" }
    const userData = useSelector(store => store.User)
    const navigate = useNavigate()
    console.log('user:', userData)


    async function adminBtnHandler() {
        try {
            const res = await axios.post(`${import.meta.env.VITE_DOMAIN}/api/admin/logout`, {}, { withCredentials: true })
            console.log(res+"ek baar chala")
            toast.success(res.data.msg)
            navigate("/admin")
        } catch (error) {
            toast.error("Login Failed ❌ " + error.response.data.error)
        } finally {

        }
    }
    return (
        <div style={backgroundColor} className='flex justify-between   relative min-w-[100vw] p-2 z-10'>
            <div id="left" className='flex justify-between items-center gap-5'>
                <img src={car2} alt="GCC" className='h-12' />
                <h1 className='text-[#DFD0B8]'>GOOD CHOICE CAR</h1>
            </div>
            <div id="right" className='flex justify-between items-center gap-5'>
                <button style={fontStyle1} className='cursor-pointer flex  items-center gap-1'><i className="fa-solid fa-user-tie"></i>Welcome {userData.firstName}</button>
                <button style={fontStyle1} className='cursor-pointer mr-2 items-center gap-1' onClick={adminBtnHandler}><i className="fa-solid fa-arrow-right-from-bracket"></i> Logout</button>
            </div>
        </div>
    )
}







export const AdminPanel = () => {
    const { isDark, setIsDark, isLoading, setIsLoading } = useGlobalContext()
    const fontStyle1 = { color: "#dfd0b8" }
    const backgroundColor = { backgroundColor: "#222831" }
    return (
        <div className="border absolute min-w-[100%] min-h-[100%] overflow-hidden">
            <AdminNavbar />
            <div className="absolute inset-0">
                <div className="h-99 w-99 bg-[#e8f6fea7] rounded-full absolute top-7 -right-20  "></div>
                <div className="h-99 w-99 bg-[#a695fd20] rounded-full absolute -bottom-10 -left-20  "></div>
            </div>

            {/* Your main content */}
            <div>
                <div className='flex justify-between flex-col relative z-10  w-[30%]'>
                    <NavLink
                        to="/adminPanel"
                        className={({ isActive }) =>
                            `flex items-center gap-1 ${isActive
                                ? "text-[#dfd0b8] font-bold"
                                : "text-gray-300 hover:text-[#48A6A7]"
                            }`
                        }
                    >
                        Home
                    </NavLink>

                    <button className='border w-60 '><span>a</span> Dashboard</button>
                    <button className='border w-60 '><span>a</span> Posts</button>
                    <button className='border w-60 '><span>a</span> Enquiry</button>
                    <button className='border w-60 '><span>a</span> Accounts</button>
                    <button className='border w-60 '><span>a</span> Settings</button>
                </div>
            </div>

            <div id="left" className="left-0 top-1/3-translate-y-1/1 relative">

            </div>
            <div id="right" className="left-0 top-1/3-translate-y-1/1 relative">
                b
            </div>
        </div>

    )
}




