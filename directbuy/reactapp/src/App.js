import React from 'react';
import "./App.css";
import Register from './Components/Register';
import Login from './Components/Login';
import { Navigate } from 'react-router-dom';


import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorPage from './Components/ErrorPage';
import CreateProduct from './Products/CreateProduct';
import ProductList from './Products/ProductList';
import UserProducts from './Products/UserProducts';

function App() {
  return (
   <div>
    <BrowserRouter>
      <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="error" element={<ErrorPage/>} />

          <Route path="createproduct" element={<CreateProduct />} />
          <Route path="productlist" element={<ProductList />} />
          <Route path="userproduct" element={<UserProducts />} />

        {/* <Route path="*" element={<Navigate to="/user/login" replace />} /> */}
         </Routes>
    </BrowserRouter>
   </div>
  );
}

export default App;
