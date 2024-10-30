import React, {useState} from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import OptimizationLogs from './pages/OptimizationLog';
import Chart from './pages/Chart';

function LogOut(){
  localStorage.clear()
  return <Navigate to='/login'/>
}

function RegisterAndLogOut(){
  localStorage.clear()
  return <Register />
}

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<ProtectedRoute><Home></Home></ProtectedRoute>}/>
      <Route path='/optLogs' element={<ProtectedRoute><OptimizationLogs/></ProtectedRoute>}></Route>
      <Route path='/login' element={<Login/>}/>
      <Route path='/logout' element={<LogOut/>}/>
      <Route path='/register' element={<RegisterAndLogOut/>}/>
      <Route path='/chart/:arg1' element={<ProtectedRoute><Chart/></ProtectedRoute>}/>
      <Route path='*' element={<NotFound/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App
