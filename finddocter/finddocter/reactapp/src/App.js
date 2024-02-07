import React from 'react';
import "./App.css";
import Register from './Components/Register';
import Login from './Components/Login';
import { Navigate } from 'react-router-dom';


import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorPage from './Components/ErrorPage';
import CreateDoctor from './Hospital/CreateDoctor';
import UserDoctor from './Hospital/UserDoctor';
import DoctorLists from './Patient/DoctorDetails';

function App() {
  return (
   <div>
    <BrowserRouter>
      <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="createdoctor" element={<CreateDoctor />} />
          <Route path="doctorlist" element={<DoctorLists />} />
          <Route path="userdoctor" element={<UserDoctor />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="error" element={<ErrorPage/>} />

        {/* <Route path="*" element={<Navigate to="/user/login" replace />} /> */}
         </Routes>
    </BrowserRouter>
   </div>
  );
}

export default App;
