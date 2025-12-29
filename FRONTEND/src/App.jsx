import React, { lazy, Suspense } from 'react'
import './App.css'
import { Toaster } from 'react-hot-toast';
import AdminLogin from "./components/AdminLogin"
import { Route, Routes } from 'react-router-dom'
import ProtectedRoutes from './components/ProtectedRoutes';
import Home from './components/Home';
import { PostsSkeleton } from './components/Simmer';
// import Test from './components/Test';



// const AdminPanel = lazy(() => import('./components/AdminPanel'))
const AdminSignUp = lazy(() => import('./components/AdminSignUp'))
const AdminForgetPass = lazy(() => import('./components/AdminForgetPass').then(module => ({ default: module.AdminForgetPass })))
const AdminPanel = lazy(() => import('./components/AdminPanel').then(module => ({ default: module.AdminPanel })))
const Posts = lazy(() => import("./components/Posts"))
const PostsEdit = lazy(() => import("./components/PostEdit"))
const Addpost = lazy(() => import("./components/Addpost"))
const DetailView = lazy(() => import("./components/DetailView"))
const Accounts = lazy(() => import("./components/Accounts"))

const App = () => {
  return (
    <>
      <Toaster />
      <Suspense fallback={<div className="p-4 text-center"><PostsSkeleton /></div>}>
        <Routes>
          <Route path='/' element={<Home />} />
         <Route path='/detailview' element={<DetailView />} />
          <Route path='/admin' element={<AdminLogin />} />
          <Route path='/adminSignUp' element={<AdminSignUp />} />
          <Route path='/adminForgetPassword' element={<AdminForgetPass />} />

          {/* ProtectedRoutes routes */}
          <Route path='/' element={<ProtectedRoutes />} >
            <Route path='/adminPanel' element={<AdminPanel />} />
            <Route path='/posts' element={<Posts />} />
            <Route path="/postedit/:id" element={<PostsEdit />} />
            <Route path="/addpost" element={<Addpost />} />
            <Route path="/accounts" element={<Accounts />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App

