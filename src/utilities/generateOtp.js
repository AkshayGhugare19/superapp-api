const generateOtp = () => {
	// Generate a 6-digit random number
	return Math.floor(100000 + Math.random() * 900000);
};

module.exports = generateOtp;
