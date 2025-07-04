import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";

// OTP length define karo
const OTP_LENGTH = 6;

// Animation variants for Framer Motion
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

  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (location.state && location.state.userId) {
      setUserId(location.state.userId);
      localStorage.setItem('tempVerificationUserId', location.state.userId);
    } else {
      const storedUserId = localStorage.getItem('tempVerificationUserId');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        toast.error("Verification link expired or missing user ID. Please register again.");
        navigate('/register');
      }
    }

    const timer = setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.value !== "" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, OTP_LENGTH);
    if (pastedData.length === OTP_LENGTH && !isNaN(pastedData)) {
      setOtp(pastedData.split(""));
      if (inputRefs.current[OTP_LENGTH - 1]) {
        inputRefs.current[OTP_LENGTH - 1].focus();
      }
    } else {
      toast.error("Please paste a valid 6-digit OTP.");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");

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

      const userData = res.data;
      dispatch({ type: 'auth/login/fulfilled', payload: userData });
      localStorage.setItem('user', JSON.stringify(userData));

      toast.success(userData.message || "Email verified successfully!");
      localStorage.removeItem('tempVerificationUserId');

      navigate("/dashboard");
    } catch (err) {
      console.error("Verification failed:", err);
      toast.error(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center px-4 py-8 overflow-auto font-sans">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        // Updated classes for better responsiveness and premium feel
        className="w-full max-w-sm sm:max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 sm:p-8 space-y-6 border border-gray-100"
      >
        <motion.div variants={itemVariants} className="text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Verify Your Email</h2>
          <p className="text-sm sm:text-base text-gray-500 mt-2 leading-relaxed">
            Enter the 6-digit code sent to your registered email address.
          </p>
        </motion.div>

        <form onSubmit={handleVerify} className="space-y-6">
          <motion.div
            variants={itemVariants}
            // Flex layout for OTP boxes with responsive spacing
            className="flex justify-center gap-2 sm:gap-3"
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
                // Responsive sizing for OTP boxes (w-10 for small, sm:w-12, md:w-14 for larger)
                className="w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-center text-xl sm:text-2xl font-bold text-gray-800 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-200 bg-gray-50 appearance-none shadow-sm"
                style={{ MozAppearance: 'textfield' }} // Hide spinner for Firefox
              />
            ))}
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || otp.join("").length !== OTP_LENGTH}
            className="w-full bg-indigo-600 text-white py-3 sm:py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-md hover:shadow-lg"
          >
            {loading ? "Verifying..." : "Verify Account"}
          </motion.button>
        </form>

        <motion.p variants={itemVariants} className="text-center text-sm text-gray-500 mt-4">
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
