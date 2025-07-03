const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto')


// 🔐 Token Generator
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '10d',
  });
};

// 🧁 Set Token Cookie and Response
const sendToken = (res, user) => {
  const token = generateToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token, // ✅ Token included in response
  });
};

 const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
  
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();



    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const message = `You requested a password reset. Click the link to reset: \n\n${resetUrl}`;


    await sendEmail({
      to: user.email,
      subject: 'Password Reset',
      text: message,
    })

  
    res.status(200).json({ message: 'Email sent successfully' });


  } catch (err) {
    res.status(500).json({ message: 'Something Went Wrong' });
  }

};










// ✅ Register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPass });

    sendToken(res, user); // ✅ send token in cookie + response
  } catch (err) {
    res.status(500).json({ message: 'Error in registering User' });
  }
};

// ✅ Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Wrong email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Wrong email or password' });

    sendToken(res, user); // ✅ send token in cookie + response
  } catch (err) {
    res.status(500).json({ message: 'LOGIN ERROR' });
  }
};

// ✅ Get Logged In User
const getMe = (req, res) => {
  res.status(200).json(req.user);
};

module.exports = { registerUser, loginUser, getMe, forgotPassword };
