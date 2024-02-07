
import React from 'react';
// import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import './App.css';
import { Navigate } from 'react-router-dom';
import CreateEmployee from './Employee/CreateEmployee';
import UserEmployee from './Employee/UserEmployee';
import ErrorPage from './Components/ErrorPage';
import EmployeeList from './Employee/EmployeeList';
// import { Browser } from 'puppeteer';

function App() {
  return (
    <div className="App">
     <BrowserRouter>
     <Routes>
      <Route path="login" element={<Login/>} />
      <Route path="register" element={<Register/>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="createemployee" element={<CreateEmployee/>} />
      <Route path="useremployee" element={<UserEmployee/>} />
      <Route path="error" element={<ErrorPage/>} />
      <Route path="employeelist" element={<EmployeeList/>} />

     </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
