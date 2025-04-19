const CryptoJS = require('crypto-js');

const decryptPassword = async (encryptedPassword) => {
    const secretKey = process.env.PASSWORD_ENCRYPTOR_DECRYPTOR_KEY; // Use the same key as the frontend
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    return originalPassword;
};

module.exports = decryptPassword;  