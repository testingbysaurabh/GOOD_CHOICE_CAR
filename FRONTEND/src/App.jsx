import './App.css'
import { Toaster } from 'react-hot-toast';
import AdminLogin from "./components/AdminLogin"
import { Route, Routes } from 'react-router-dom'
import AdminPanel from './components/AdminPanel';

const App = () => {
  return (
    <div>
      <Toaster />
      {/* <AdminPanel /> */}
      <Routes>
        <Route path='/admin' element={<AdminLogin />} />
      </Routes>
    </div >
  )
}

export default App
