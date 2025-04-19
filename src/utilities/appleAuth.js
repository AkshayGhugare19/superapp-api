const fs = require("node:fs");
const config = require('../config/appleAuth');
const AppleAuth = require("apple-auth");
const jwt = require("jsonwebtoken");
const { db } = require("../db/db");
const tokenServices = require("../modules/tokens/tokens.services");
const { createWallet } = require("../modules/payments/services");

const privateKey = `-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgGCIARfMARkVq4y+r
lE/svNTWYiwfK+QpyDMittbsE8CgCgYIKoZIzj0DAQehRANCAAR6jVAlmNkd4cbh
QLTnhnVoStPFJeZOzo7wAlhOwJFW4pAcUUByqWS/TjqtvC8xqKkZK9J9TZSL1QOB
+NVkT42X
-----END PRIVATE KEY-----`;

const auth = new AppleAuth(config, privateKey, 'text');

const authorize = async (req, res) => {
    try {

        const { authorization, user } = req.body;

        if (!authorization || !authorization.code) {
            return {
                status: false,
                code:400,
                msg: "ID token is missing",
            };
        }

        const response = await auth.accessToken(authorization.code);
        const idToken = jwt.decode(response.id_token);

        const userEmail = idToken?.email;

        if (!userEmail) {
            return {
                status: false,
                code:400,
                msg: "Email is missing from ID token",
            };
        }

        const existingUser = await db.Users.findOne({
            where: { email: userEmail },
        });

        if (existingUser) {
            if (!existingUser.isActive) {
                return {
                    status: false,
                    code: 401,
                    msg: "Your account is currently deactivated",
                };
            }

             const tokens = await tokenServices.generateAuthTokens(existingUser);
             delete existingUser?.dataValues?.password;
             return { data: { user, tokens }, status: true, code: 200 };
        }

        const firstName = user?.name?.firstName || "Guest";
        const lastName = user?.name?.lastName || "User";
        const name = `${firstName} ${lastName}`;
        const username = name ? name.toLowerCase().replace(/ /g, '_') : 'unknown';

        const newUser = await db.Users.create({
            email: userEmail,
            name: name,
            username: username,
            socialLoginType:"apple",
            socialLoginToken:response.id_token,
            role: "user",
            isActive: true,
            socialLoginType: "apple",
            isEmailVerified: true,
        });

        await createWallet(newUser?.dataValues?.id)
        const tokens = await tokenServices.generateAuthTokens(newUser);
        delete newUser?.dataValues?.password;
        return { data: { user, tokens }, status: true, code: 200 };
    } catch (error) {
        console.error("Authorization error:", error);
        return {
            status: false,
            code: 500,
            msg: "An error occurred during authorization",
        };
    }
};



module.exports = authorize;