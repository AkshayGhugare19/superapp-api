const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const userRoutes = require("./user.route")
const otpRoutes = require("./otp.route")
const chatRoutes = require("./chat.route")

const { uploadFile } = require('../utilities/fileUpload');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uploadPath = path.resolve(__dirname, '../../uploads/');
		cb(null, uploadPath)
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
		cb(null, file.originalname + '-' + uniqueSuffix)
	}
})

const upload = multer({ storage: storage })

const defaultRoutes = [
	{
		path: '/users',
		route: userRoutes,
	},
	{
		path: '/otp',
		route: otpRoutes,
	},
	{
		path: '/chat',
		route: chatRoutes,
	},
	
];

router.route('/upload-file').post(uploadFile);

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;