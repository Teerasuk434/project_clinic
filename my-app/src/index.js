import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Login';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Home from './Home';
import Register from './components/customer/Register';
import Users from './components/admin/Users'
import FormUser from './components/users/FormUser';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="home" element={<Home />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/users" element={<Users />}/>
      <Route path="/user/:user_id" element={<FormUser />}/>

    </Routes> 
  </BrowserRouter>

);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
