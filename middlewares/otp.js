const otpStore = {}; // This will temporarily store OTPs and their expiry times

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
};

const OTPExpiryTime = 10 * 60 * 1000; // 10 minutes expiry

// Middleware for storing and validating OTP
const requestOTP = (email) => {
  const otp = generateOTP();
  const expiry = Date.now() + OTPExpiryTime;
  
  // Store OTP and expiry time in memory
  otpStore[email] = { otp, expiry };
  
  return otp;
};

const validateOTP = (email, otp) => {
  const otpData = otpStore[email];
  if (!otpData) {
    return { valid: false, message: "OTP not requested or expired" };
  }
  if (Date.now() > otpData.expiry) {
    delete otpStore[email];
    return { valid: false, message: "OTP has expired" };
  }
  if (otpData.otp != otp) {
    return { valid: false, message: "Invalid OTP" };
  }
  // OTP is valid, delete after successful validation
  delete otpStore[email];
  return { valid: true, message: "OTP verified" };
};

module.exports = { requestOTP, validateOTP };
