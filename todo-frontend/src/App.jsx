import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css'
import Login from './pages/Login';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUserFromStorage } from './features/auth/authSlice';
import VerifyEmail from './pages/VerifyEmail';
import { Toaster } from 'react-hot-toast';

function App() {
    const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, []);



  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      </Routes>
        <Toaster />
    </Router>
  );
}

export default App;
