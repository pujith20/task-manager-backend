const express = require('express');
const router = express.Router();
const { getusers, register, login, deleteUser, requestReset, verifyOTP, resetPassword, forgotPassword } = require('../controllers/authController');


router.get('/', getusers);
router.post('/register', register);  // expects: name, username, email (optional), password, role (optional)
router.post('/login', login);        // expects: username, password
router.post('/forgot-password',forgotPassword);
router.post('/request-reset', requestReset); // Request OTP
router.post('/verify-otp', verifyOTP);       // Verify OTP
router.post('/reset-password', resetPassword); // Reset password after OTP verification
router.delete('/delete', deleteUser);


module.exports = router;
