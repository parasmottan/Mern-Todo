import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import { addTodo, deleteTodo, fetchTodos } from '../features/todos/todoSlice';
import { motion, AnimatePresence } from 'framer-motion';

function Dashboard() {
  const [text, setText] = useState('');
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { todos, loading } = useSelector((state) => state.todos);

  useEffect(() => {
    if (!user) return navigate('/login');
    dispatch(fetchTodos());
  }, [user, dispatch, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch(addTodo(text));
    setText('');
  };

  const handleDelete = (id) => {
    dispatch(deleteTodo(id));
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#f9fbff] to-[#e0ecff] flex flex-col font-sans relative overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="px-4 py-3 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 flex justify-between items-center"
      >
        <div>
          <h1 className="text-base sm:text-xl font-semibold text-blue-800 truncate max-w-[160px]">
            Hello, {user?.name || user?.email}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">Stay productive 🧠</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-xs sm:text-sm font-mono">{time}</span>
          <button
            onClick={handleLogout}
            className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </motion.div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-center text-sm sm:text-base text-blue-800 px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-100 to-purple-100 overflow-hidden"
      >
        <p className="truncate sm:whitespace-normal">
          "A task written is a task half done." ✍️
        </p>
      </motion.div>

      {/* Todos */}
      <div className="flex-1 overflow-y-auto px-3 py-2 sm:px-6 sm:py-4">
        {loading ? (
          <p className="text-center text-gray-400 mt-12 text-sm">Loading tasks...</p>
        ) : todos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12 text-gray-400"
          >
            <img src="box.png" alt="Empty" className="mx-auto w-28 h-28 mb-4 opacity-60" />
            <p className="italic text-sm">No todos yet. Add one to get started ✨</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2 sm:space-y-3"
          >
            {todos.map((todo) => (
              <motion.div
                key={todo._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-white/80 backdrop-blur-sm border border-gray-200 shadow-md px-4 py-3 rounded-2xl flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="text-sm sm:text-base font-medium text-gray-800">{todo.text}</div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(todo._id)}
                    className="text-sm text-red-500 hover:text-red-700 transition"
                  >
                    ❌
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Input Bar */}
      <motion.form
        onSubmit={handleAddTodo}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md px-3 sm:px-6 py-2 sm:py-3 border-t border-gray-300 flex gap-2 items-center"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add new task..."
          className="flex-1 px-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs sm:text-sm"
        />
        <motion.button
          whileTap={{ scale: 0.96 }}
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm"
        >
          Add
        </motion.button>
      </motion.form>
    </div>
  );
}

export default Dashboard;
