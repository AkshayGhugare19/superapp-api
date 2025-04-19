const nodemailer = require('nodemailer');

async function sendEmail({ to, subject, html, attachments, from = process.env.APP_MAIL }) {
	// Ensure necessary environment variables are defined
	if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.APP_MAIL || !process.env.APP_MAIL_PASSWORD) {
		throw new Error('SMTP configuration or email credentials are missing');
	}

	// Create transporter with timeout and necessary auth
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		auth: {
			user: process.env.APP_MAIL,
			pass: process.env.APP_MAIL_PASSWORD
		},
		timeout: 10000,  // Timeout after 10 seconds if not connected
	});

	try {
		// Send email and log success
		await transporter.sendMail({ from, to, subject, html, attachments });
		console.log(`Email successfully sent to ${to}`);
	} catch (error) {
		// Log and throw an error if the email fails to send
		console.error(`Failed to send email to ${to}:`, error);
		throw new Error('Email sending failed');
	}
}

async function sendVerificationEmail(user, inviteLink) {
	const message = `<p>Please click the link below to verify your email address:</p>
                     <p><a target="_blank" href="${inviteLink}">Click to Verify</a></p>`;

	try {
		// Send verification email and return success response
		await sendEmail({
			to: user.email,
			subject: "Sign-up Verification - Verify Email",
			html: `<h4>Verify Your Email</h4>
                   <p>Thanks for registering!</p>
                   ${message}`,
		});
		return { status: true, code: 200, data: "A Verification link has been sent to your email." };
	} catch (error) {
		// Return error response if email sending fails
		console.error("Error sending verification email:", error);
		return { status: false, code: 500, msg: "Failed to send verification email." };
	}
}

async function sendInvitationEmail(email, inviteLink, inviterName) {
    const message = `<p style="font-size: 16px; color: #fff;">You have been invited to join Superapp ! To get started, please click the link below:</p>
                     <p style="font-size: 18px; text-align: center;">
                        <a target="_blank" href="${inviteLink}" style="padding: 12px 20px; background-color: #24ABE2; color: #fff; text-decoration: none; font-size: 16px; border-radius: 5px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">Join Now</a>
                     </p>`;

    try {
        await sendEmail({
            to: email,
            subject: "You're Invited to Superapp  - Join Now!",
            html: `<div style="background: linear-gradient(90deg, #EB068C -1.68%, #24ABE2 100%); padding: 40px; color: #fff; text-align: center; font-family: Arial, sans-serif;">
                    <h2 style="font-size: 24px;">Welcome to Superapp !</h2>
                    <p style="font-size: 18px; font-weight: bold;">You've been invited by ${inviterName}.</p>
                    ${message}
                    <p style="font-size: 14px; margin-top: 20px;">If you did not expect this invitation, feel free to ignore this email.</p>
                    <footer style="font-size: 12px; color: #ddd; margin-top: 30px;">
                        <p>Superapp  - Your go-to platform for Superapp engagement.</p>
                    </footer>
                 </div>`,
        });
        return { status: true, code: 200, data: "An invitation link has been sent to your email." };
    } catch (error) {
        console.error("Error sending invitation email:", error);
        return { status: false, code: 500, msg: "Failed to send invitation email." };
    }
}


module.exports = {
	sendVerificationEmail,
	sendInvitationEmail,
}