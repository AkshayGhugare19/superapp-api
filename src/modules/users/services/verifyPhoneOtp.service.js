const { db } = require("../../../db/db");
const verifyOtpOnPhone = require("../../../utilities/verifyOtpOnPhone");

const verifyPhoneOtpService = async ({ phone, countryCode, otp, role }) => {
  try {
    let result;
    
    if (process.env.NODE_ENV === 'development') {
      result = await verifyOtpOnPhone(phone, countryCode, otp);
      console.log("lll", result);
      
      if (!result?.success) {
        return { status: false, code: 400, msg: "Invalid phone OTP." };
      }

      // Polling until the OTP status is either approved or failed
      let attempts = 0;
      while (result.status === 'pending' && attempts < 5) {
        // Wait for 5 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 5000));

        result = await verifyOtpOnPhone(phone, countryCode, otp);
        console.log("Polling OTP Status:", result.status);

        attempts++;
      }

      if (result.status !== 'approved') {
        return { status: false, code: 400, msg: "OTP verification failed." };
      }
    } else {
      if (otp !== "123456") {
        return { status: false, code: 400, msg: "Invalid OTP. Please try again." };
      }
    }

    let user = await db.Users.findOne({ where: { phone } });
    if (user) {
      user.isMobileVerified = true;
      user.countryCode = countryCode;
      await user.save();
    } else {
      user = await db.Users.create({
        role,
        phone,
        countryCode,
        isMobileVerified: true,
        isActive: true,
      });
    }

    return {
      status: true,
      code: 201,
      data: { data: user, msg: "Phone OTP verified successfully." },
    };
  } catch (err) {
    console.error("Phone OTP Error:", err);
    return {
      status: false,
      code: 500,
      msg: "Internal Server Error: Unable to verify phone OTP.",
    };
  }
};

module.exports = verifyPhoneOtpService;
