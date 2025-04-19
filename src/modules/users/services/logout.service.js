const { db } = require('../../../db/db');

const logout = async (userId) => {
    try {
        // Check if user exists and is active
        const user = await db.Users.findOne({ where: { id: userId, isActive: true } });
        
        if (!user) {
            return { msg: "User not found.", status: false, code: 404 };
        }

        // Update loggedInUser status
        await user.update({ loggedInUser: false });
        
        return { data: "Logout successful.", status: true, code: 200 };
    } catch (error) {
        console.error("Error while logging out user:", error);
        return { msg: "Internal server error.", status: false, code: 500 };
    }
};

module.exports = logout;
