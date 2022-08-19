import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter,Routes,Route} from "react-router-dom";

import Login from './Login';
import Home from './Home';
import Homepage from './Homepage';
import Register from './components/customer/Register';
import Users from './components/admin/Users'
import FormUser from './components/users/FormUser';
import Roles from './components/admin/Roles'
import FormRole from './components/users/FormRole';
import Service from './components/admin/Service'
import FormService from './components/service/FormService';
import FormEmptypes from './components/admin/FormEmptypes';
import EmpTypeMain from './components/admin/EmpTypeMain';

import Account from './components/customer/Account';
import EditProfile from './components/customer/EditProfile';

import Pets from './components/customer/Pets';
import FormRoomtypes from './components/room/FormRoomTypes';

import Appointment from './components/Appointment';

import RoomTypes from './components/admin/RoomTypes';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register/>} />

      <Route path="/users" element={<Users />}/>
      <Route path="/user/:user_id" element={<FormUser />}/>

      <Route path="/roles" element={<Roles />}/>
      <Route path="/role/:role_id" element={<FormRole />}/>

      <Route path="/services" element={<Service/>}/>
      <Route path="/service/:service_id" element={<FormService />}/>

      <Route path="/account" element={<Account />}/>
      <Route path="/account/editprofile" element={<EditProfile />}/>
      <Route path="/account/pets" element={<Pets />} />

      <Route path="/emptypes" element={<EmpTypeMain />} />
      <Route path="/emptypes/:emp_position_id" element={<FormEmptypes/>}/>
      
      <Route path="/appointment" element={<Appointment />} />

      <Route path="/roomtypes" element={<RoomTypes/>} />
      <Route path="/roomtype/:room_type_id" element={<FormRoomtypes/>} />



    </Routes> 
  </BrowserRouter>

);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
