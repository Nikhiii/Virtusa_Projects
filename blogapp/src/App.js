
import React from 'react';
// import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import './App.css';
import { Navigate } from 'react-router-dom';
import ErrorPage from './Components/ErrorPage';
import UserBlog from './Blogs/UserBlog';
import CreateBlog from './Blogs/CreateBlog';
import BlogList from './Blogs/BlogList';
// import { Browser } from 'puppeteer';

function App() {
  return (
    <div className="App">
     <BrowserRouter>
     <Routes>
      <Route path="login" element={<Login/>} />
      <Route path="register" element={<Register/>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="error" element={<ErrorPage/>} />
      <Route path="userblog" element={<UserBlog/>} />
      <Route path='createblog' element={<CreateBlog/>} />
      <Route path='bloglist' element={<BlogList/>} />

     </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
