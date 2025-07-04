import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux"; // useDispatch import kiya

// OTP length define karo
const OTP_LENGTH = 6;

// Animation variants for Framer Motion (yeh ab component ke andar define kiye hain)
const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
};

const VerifyEmail = () => {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);
  const dispatch = useDispatch();

  const [userId, setUserId] = useState(''); // userId state

  useEffect(() => {
    // Check if userId was passed via navigation state from Register.jsx
    if (location.state && location.state.userId) {
      setUserId(location.state.userId);
      // Optional: Store in localStorage as fallback if page refreshes
      localStorage.setItem('tempVerificationUserId', location.state.userId);
    } else {
      // If not from state, try to get from localStorage (for page refreshes)
      const storedUserId = localStorage.getItem('tempVerificationUserId');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        // If no userId found at all, user should probably re-register
        toast.error("Verification link expired or missing user ID. Please register again.");
        navigate('/register');
      }
    }

    // Focus on the first input box on component mount
    // Ensure the ref is available before trying to focus
    const timer = setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 100); // Small delay to ensure inputs are rendered

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [location.state, navigate]); // navigate ko dependency se hata sakte ho agar linting warning de

  // Handles individual OTP digit changes
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false; // Only allow numbers

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input if current one is filled and not the last one
    if (element.value !== "" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handles backspace key
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  // Handles paste event for full OTP string
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, OTP_LENGTH);
    if (pastedData.length === OTP_LENGTH && !isNaN(pastedData)) {
      setOtp(pastedData.split(""));
      // Focus the last input after pasting
      if (inputRefs.current[OTP_LENGTH - 1]) {
        inputRefs.current[OTP_LENGTH - 1].focus();
      }
    } else {
      toast.error("Please paste a valid 6-digit OTP.");
    }
  };


  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join(""); // Combine all digits into a single string

    if (!userId) {
      toast.error("User ID not found. Please register again.");
      navigate('/register');
      return;
    }

    if (fullOtp.length !== OTP_LENGTH) {
      return toast.error(`Please enter the complete ${OTP_LENGTH}-digit OTP`);
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/auth/verify-otp", {
        userId,
        otp: fullOtp,
      });

      // Backend se jo user data (including _id, name, email, token) aaya hai
      const userData = res.data;
      
      // authSlice mein loginUser.fulfilled action ko manually dispatch karo
      // Taaki Redux state update ho jaye aur user logged in state mein aa jaye
      dispatch({ type: 'auth/login/fulfilled', payload: userData });
      
      // localStorage mein bhi user data save karo (redundant with Redux, but safe)
      localStorage.setItem('user', JSON.stringify(userData)); 

      toast.success(userData.message || "Email verified successfully!");
      localStorage.removeItem('tempVerificationUserId'); // Clean up stored userId
      
      navigate("/dashboard"); // Ab dashboard par navigate karo
    } catch (err) {
      console.error("Verification failed:", err);
      // Agar error.response.data hai toh uska message dikhao
      toast.error(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center px-4 py-8 overflow-auto font-sans">
      <motion.div
        variants={containerVariants} // Variants add kiye
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100"
      >
        <motion.div variants={itemVariants} className="text-center"> {/* Variants add kiye */}
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-3xl font-bold text-gray-800">Verify Your Email</h2>
          <p className="text-md text-gray-500 mt-2">
            Enter the 6-digit code sent to your email address.
          </p>
        </motion.div>

        <form onSubmit={handleVerify} className="space-y-6">
          <motion.div
            variants={itemVariants} 
            className="flex justify-center space-x-2 md:space-x-3"
          >
            {otp.map((data, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-200 bg-gray-50 appearance-none"
                style={{ MozAppearance: 'textfield' }}
              />
            ))}
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || otp.join("").length !== OTP_LENGTH}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-md hover:shadow-lg"
          >
            {loading ? "Verifying..." : "Verify Account"}
          </motion.button>
        </form>

        <motion.p variants={itemVariants} className="text-center text-sm text-gray-500 mt-4"> {/* Variants add kiye */}
          Didn't receive the code?{" "}
          <button
            onClick={() => toast.success("OTP Resend feature coming soon!")}
            className="text-indigo-600 font-semibold hover:underline focus:outline-none"
          >
            Resend OTP
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
