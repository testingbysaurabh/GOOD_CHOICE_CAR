import React, { lazy, Suspense } from 'react'
import './App.css'
import { Toaster } from 'react-hot-toast';
import AdminLogin from "./components/AdminLogin"
import { Route, Routes } from 'react-router-dom'
import ProtectedRoutes from './components/ProtectedRoutes';
import Home from './components/Home';


// const AdminPanel = lazy(() => import('./components/AdminPanel'))
const AdminSignUp = lazy(() => import('./components/AdminSignUp'))
const AdminForgetPass = lazy(() => import('./components/AdminForgetPass').then(module => ({ default: module.AdminForgetPass })))
const AdminPanel = lazy(() => import('./components/AdminPanel').then(module => ({ default: module.AdminPanel })))
const Posts = lazy(() => import("./components/Posts"))

const App = () => {
  return (
    <>
      <Toaster />
      <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/admin' element={<AdminLogin />} />
          <Route path='/adminSignUp' element={<AdminSignUp />} />
          <Route path='/adminForgetPassword' element={<AdminForgetPass />} />

          {/* ProtectedRoutes routes */}
          <Route path='/' element={<ProtectedRoutes />} >
            <Route path='/adminPanel' element={<AdminPanel />} />
            <Route path='/posts' element={<Posts />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
