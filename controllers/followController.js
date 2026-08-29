const Follow = require("../models/Follow");
const User = require("../models/User");


// FOLLOW / UNFOLLOW USER
exports.toggleFollow = async (req, res) => {
    try {
        const targetUser = await User.findById(
            req.params.userId
        );

        if (!targetUser) {
            return res.redirect("/home");
        }

        const currentUserId =
            req.session.user._id.toString();

        if (
            currentUserId ===
            targetUser._id.toString()
        ) {
            req.flash(
                "error",
                "You cannot follow yourself."
            );

            return res.redirect("back");
        }

        const existingFollow = await Follow.findOne({
            follower: currentUserId,
            following: targetUser._id
        });

        if (existingFollow) {
            await Follow.findByIdAndDelete(
                existingFollow._id
            );

            req.flash(
                "success",
                `You unfollowed ${targetUser.username}.`
            );

        } else {
            await Follow.create({
                follower: currentUserId,
                following: targetUser._id
            });

            req.flash(
                "success",
                `You are now following ${targetUser.username}!`
            );
        }

        res.redirect("back");

    } catch (error) {
        console.error("Follow Error:", error);
        res.redirect("/home");
    }
};