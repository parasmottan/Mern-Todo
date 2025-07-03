import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../features/auth/authSlice';
import { motion } from 'framer-motion';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate('/dashboard');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center px-4 py-8 overflow-auto font-sans">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col sm:flex-row overflow-hidden"
      >
        {/* LEFT Side - Emoji + Quote */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full sm:w-1/2 bg-gradient-to-tr from-blue-100 to-purple-100 flex flex-col justify-center items-center p-6 sm:p-10 text-center"
        >
          <div className="text-4xl sm:text-6xl mb-3 animate-bounce">🚀</div>
          <h2 className="text-lg sm:text-2xl font-bold text-blue-700">“Start small. Dream big.”</h2>
          <p className="text-sm text-gray-600 mt-2 sm:mt-3 px-2">
            A single registration today can lead to a thousand completed dreams tomorrow.
          </p>
        </motion.div>

        {/* RIGHT Side - Form */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full sm:w-1/2 p-6 sm:p-10 flex flex-col justify-center"
        >
          <div className="text-center mb-6">
            <img
              src="/logo.jpg"
              alt="Logo"
              className="mx-auto w-12 h-12 mb-2 rounded-full object-cover"
            />
            <h3 className="text-xl sm:text-2xl font-bold text-blue-700">Create Account</h3>
            <p className="text-xs text-gray-500 mt-1">Join CodeX Todo and organize your mind 🧠</p>
          </div>

          {error && (
            <p className="bg-red-100 text-red-700 text-center px-4 py-2 rounded-lg text-sm mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              value={form.name}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white placeholder:text-gray-500 text-sm"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              value={form.email}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white placeholder:text-gray-500 text-sm"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={form.password}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white placeholder:text-gray-500 text-sm"
            />

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register'}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Login here
            </Link>
          </p>
<p className="text-center text-xs text-gray-400 mt-2 italic">
  🔒 Don’t worry, your data is 100% secure. <br />
  <span className="text-gray-500">Forgot Password?</span> Feature coming soon!
</p>


        </motion.div>
      </motion.div>
    </div>
  );
}

export default Register;
