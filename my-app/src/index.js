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
import FormUser from './components/admin/FormUser';

import Roles from './components/admin/Roles';
import FormRole from './components/admin/FormRole';

import Service from './components/admin/Service';
import FormService from './components/admin/FormService';

import FormEmptypes from './components/admin/FormEmptypes';
import EmployeeType from './components/admin/EmployeeType';

import Account from './components/customer/Account';
import EditProfile from './components/customer/EditProfile';

import Pets from './components/customer/Pets';
import FormPets from './components/customer/FormPets';

import Appointment from './components/customer/Appointment';
import Rooms from './components/admin/Rooms';
import FormRoom from './components/admin/FormRoom';
import RoomTypes from './components/admin/RoomTypes';
import FormRoomtypes from './components/admin/FormRoomTypes';


import RequestAppoint from './components/employee/RequestAppoint';
import FormReqAppoint from './components/employee/FormReqAppoint';

import Employee from './components/owner/Employee';
import FormEmployee from './components/owner/FormEmployee';
import AppointTable from './components/owner/AppointTable';


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
      <Route path="/pets" element={<Pets />} />
      <Route path="/pet/:pet_id" element={<FormPets />} />

      <Route path="/emptypes" element={<EmployeeType />} />
      <Route path="/emptypes/:emp_position_id" element={<FormEmptypes/>}/>
      
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/appointtable" element={<AppointTable />} />

      <Route path="/rooms" element={<Rooms/>} />
      <Route path="/room/:room_id" element={<FormRoom />} />
      <Route path="/roomtypes" element={<RoomTypes/>} />
      <Route path="/roomtype/:room_type_id" element={<FormRoomtypes/>} />


      <Route path="/request-appoint" element={<RequestAppoint />} />
      <Route path="/request-appoint/:appoint_id" element={<FormReqAppoint/>} />

      <Route path="/emp" element={<Employee/>} />
      <Route path="/emp/:emp_id" element={<FormEmployee/>} />
      

    </Routes> 
  </BrowserRouter>

);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
