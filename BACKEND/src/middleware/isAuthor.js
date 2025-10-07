const { Post } = require("../models/Posts");

const isAuthor = async (req, res, next) => {
    try {
        const { id } = req.params;
        const foundPost = await Post.findById(id);
        if (!foundPost) {
            throw new Error("Post Not Found");
        }

        //// Check if logge user is the author
        if (!foundPost.author.equals(req.user._id)) {
            throw new Error("Invalid Operation / You are not authorised for this action");
        }
        next();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    isAuthor
};
