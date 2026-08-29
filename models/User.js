const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(

    {
        
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 30
        },


        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true
        },



        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6
        },



        avatar: {
            type: String,
            default:
                "https://ui-avatars.com/api/?name=User&background=6c63ff&color=fff&size=200"
        },


        bio: {
            type: String,
            default:
                "Welcome to my SocialSphere profile!",
            maxlength: 300
        }

    },



    {
        timestamps: true
    }

);


const User =
    mongoose.model(
        "User",
        userSchema
    );


module.exports = User;