const { db } = require('../../../db/db');
const decryptPassword = require('../../../utilities/decryptPassword');
const tokenServices = require("../../tokens/tokens.services");

const updaterUser = async (userId, body) => {
    try {
        const userExists = await db.Users.findOne({ where: { id: userId, isActive: true } });
        if (!userExists) {
            return { msg: `User not found.`, status: false, code: 400 };
        }

        if (body.email) {
            const emailExists = await db.Users.findOne({ where: { email: body.email, isActive: true } });
            if (emailExists) return { msg: `Email already exists`, status: false, code: 400 };
        }

        if (body.username) {
            const usernameExists = await db.Users.findOne({ where: { username: body.username, isActive: true } });
            if (usernameExists) return { msg: `Username already exists`, status: false, code: 400 };
        }

        if (body.password) {
            const originalPassword = await decryptPassword(body.password);
            body.password = originalPassword
        }

        const updatedUser = await userExists.update(body);
        let token = ""
        if(body.isAgreedToTermsConditions){
           token = await tokenServices.generateAuthTokens(userExists);
        }else{
            token = await tokenServices.generateAuthTokens(userExists);
        }
        
        if (updatedUser) {
            return {
                data: {
                    user: updatedUser,
                    token:token,
                    msg: "User details updated successfully."
                },
                status: true, code: 200
            };
        } else {
            return { msg: "Something went wrong, please try again.", status: false, code: 400 };
        }
    } catch (error) {
        console.error("Error while updated User:", error);
        return { msg: error.message, status: false, code: 500 };
    }
};

module.exports = updaterUser;
