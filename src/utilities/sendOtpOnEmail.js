const nodemailer = require('nodemailer');

async function sendOtpOnEmail({
	to,
	subject,
	html,
	attachments = [],
	from = process.env.APP_MAIL,
	expireInMinutes = 10 // Optional param for flexibility
}) {
	try {
		// Validate environment variables
		const { SMTP_HOST, SMTP_PORT, APP_MAIL, APP_MAIL_PASSWORD } = process.env;
		if (!SMTP_HOST || !SMTP_PORT || !APP_MAIL || !APP_MAIL_PASSWORD) {
			throw new Error('SMTP configuration or email credentials are missing');
		}

		// Create email transporter
		const transporter = nodemailer.createTransport({
			host: SMTP_HOST,
			port: Number(SMTP_PORT),
			secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
			auth: {
				user: APP_MAIL,
				pass: APP_MAIL_PASSWORD
			},
			timeout: 10000 // 10 seconds timeout
		});

		// Send email
		const info = await transporter.sendMail({
			from,
			to,
			subject,
			html,
			attachments
		});

		const expiresAt = new Date(Date.now() + expireInMinutes * 60000);

		console.log(`✅ Email sent successfully to ${to}:`,info);
		return {
			success: true,
			message: `Email sent successfully to ${to}`,
			messageId: info.messageId,
			to,
			expiresAt 
		};

	} catch (error) {
		console.error(`❌ Failed to send email to ${to}:`, error);
		return {
			success: false,
			message: `Failed to send email to ${to}`,
			error: error.message
		};
	}
}

module.exports = { sendOtpOnEmail };
