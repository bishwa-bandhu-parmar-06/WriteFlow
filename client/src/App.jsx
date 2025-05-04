import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import HomePage from "../src/pages/HomePage"
import AboutPage from "../src/pages/AboutPage"
import ContactPage from "../src/pages/ContactPage"
import NotFoundPage from './pages/NotFoundPage'
import AuthenticatePage from './pages/AuthenticatePage'
import Profile from '../src/features/users/Profile'
import PublicProfile from "./components/PublicProfile"
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const App = () => {
  return (
    <>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<AuthenticatePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/:userId" element={<PublicProfile />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
