import './App.css'
import { Toaster } from 'react-hot-toast';
import AdminLogin from "./components/AdminLogin"
import { Route, Routes } from 'react-router-dom'
import AdminPanel from './components/AdminPanel';
import { AdminForgetPass } from './components/AdminForgetPass';
import AdminSignUp from './components/AdminSignUp';

const App = () => {
  return (
    <div>
      <Toaster />
      {/* <AdminPanel /> */}
      <Routes>
        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/adminSignUp' element={<AdminSignUp />} />
        <Route path='/adminForgetPassword' element={<AdminForgetPass />} />

        < Route path='/adminPanel' element={<AdminPanel />} />
      </Routes>
    </div >
  )
}

export default App
