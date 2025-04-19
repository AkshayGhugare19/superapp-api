const httpStatus = require('http-status');
const catchAsync = require('../../../utilities/catchAsync');
const sendResponse = require('../../../utilities/responseHandler');
const pick = require('../../../utilities/pick');
const CryptoJS = require('crypto-js');

const encryption = catchAsync(async (req, res) => {

	const { text } = await pick(req?.body, ['text'])
	const secretKey = process.env.PASSWORD_ENCRYPTOR_DECRYPTOR_KEY;
    const encryptedData = CryptoJS.AES.encrypt(text, secretKey).toString();
	if (encryptedData) {
		sendResponse(res, httpStatus.OK, encryptedData, null);
	} else {
		sendResponse(res, httpStatus.BAD_REQUEST, null, "Encryption error");
	}
});

module.exports = encryption