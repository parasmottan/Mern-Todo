const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

// CORS
const cors = require('cors');

const allowedOrigins = ['https://mern-todo-frontend-seven-ochre.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/todos', require('./routes/todoRoutes'));

// Start Server
connectDB().then(() => {
  app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
  });
});
