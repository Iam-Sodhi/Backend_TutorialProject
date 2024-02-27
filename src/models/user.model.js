import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"; //to hash the password
import jwt from "jsonwebtoken"; // work: data is given to only those who has these tokens

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true, // to help in optimized searching but take more space hence think carefully when used
    },
    email:{
        type:String,
        required:true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName:{
        type:String,
        required:true,
        trim: true,
        index: true,
    },
    avatar:{
        type: String, // cloudinary url
        required: true,
    },
    coverImage:{
        type: String, // cloudinary url
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type: String,
        required:[true,'Password is required']
    },
    refreshToken:{
        type: String,
    }

},{
    timestamps:true, // to get createdAt and updatedAt
});

//a middleware of mongoose
userSchema.pre("save",async function(next){ //do something before saving
   if(this.isModified("password")){ //so that encryption is done only when password is modified. Otherwise, It will encrypt the password everytime we modify any other field and save it.
       this.password= await bcrypt.hash(this.password,10) //await as it takes time to encrypt password
    }
    next()
})

userSchema.methods.isPasswordCorrect= async function(password){
  await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName:this.fullName,
        },
        procees.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken= function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        procees.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema); // *****Always try to give variable name and name of database same
//***** in MongoDb 'User' will be saved as 'users' (in small letters and in plural)*****
//if already plural then it does n't convert to plural further */
