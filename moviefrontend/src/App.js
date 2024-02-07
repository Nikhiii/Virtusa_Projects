
import React from 'react';
// import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import CreateMovie from './Movie/CreateMovie';
import UserMovie from './Movie/UserMovie';
import MoviesList from './Movie/MovieList';
import ErrorPage from './Components/ErrorPage';
import './App.css';
import { Navigate } from 'react-router-dom';

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
      <Route path='createmovie' element={<CreateMovie/>} />
      <Route path='usermovie' element={<UserMovie/>} />
      <Route path='movielist' element={<MoviesList/>} />
     </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
