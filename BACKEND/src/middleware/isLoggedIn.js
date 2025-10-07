const jwt = require("jsonwebtoken")
const { User } = require("../models/User");


const isLoggedIn = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) return res.status(401).json({ error: "Please Log In - No token found" });

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const foundUser = await User.findOne({ _id: decodedToken._id }).populate("posts");
        if (!foundUser) throw new Error("Please Log In - user not found");

        req.user = foundUser;  // Note: user, not User
        next();
    } catch (error) {
        res.status(401).json({ error: "Please Log In - invalid token or error" });
    }
};

module.exports = {
    isLoggedIn
}