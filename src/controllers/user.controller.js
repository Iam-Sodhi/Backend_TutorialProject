import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken; //save the resresh token in database so that user does not need to put password everytime
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //Step1. get user details from frontend
  const { fullName, email, username, password } = req.body;

  //Step2. Validation - like not empty
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // if(fullName===""){  //basic code to check for one field one time
  //  throw new ApiError(400,"full name is required")  }

  //Step3. Check if user already exists: throug username & email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }], //way to check for both fields
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists.");
  }

  //Step4. Check for images , check for avatar(which is required true)
  //we already have middleware in our user.router which will provide us with the required images/files
  const avatarLocalPath = req.files?.avatar[0]?.path; //avatar name from middleware used
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage[0].path
  ) {
    //it would not give error of undefined when we will save in database
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    //as it required true
    throw new ApiError(400, "Avatar file is required");
  }

  //Step5. Upload them to cloudinary , avatar
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) throw new ApiError(400, "Avatar file is required2.");

  //Step6. Create user object - create entry in DB
  const user = await User.create({
    //always use await dealing with DB
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "", //here it can be coverImage is not there, hence we do it in this way
    email,
    password,
    username: username.toLowerCase(),
  });

  //Step7. Remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); //_id is made by mongoDB itself

  //Step8. Check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registring the user."); //check if user is created or not
  }

  //Step9. Return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //1. get data from req.body
  const { email, username, password } = req.body;
  if (!username || !email) {
    throw new ApiError(400, "username or email is required.");
  }
  //2. username or email
  const user = await User.findOne({
    $or: [{ username }, { email }], //find the user on basis of email or username
  });

  //3. Find the user
  if (!user) {
    throw new ApiError(404, "User does not exist.");
  }
  //4. If existed, check password
  const isPasswordValid = await isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Password is not valid.");
  }
  //5. Generate Access and refresh Token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

   const loggedInUser= await user.findById(user._id).select("-password -refreshToken");
  //6. Send cookies

    const options={
      httpOnly: true, //then only server can modify the cookies not frontend
      secure: true,
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken",refreshToken, options)
    .json(
      new ApiResponse(200,
        {
          user: loggedInUser, accessToken, refreshToken
        },
        "User loggen in successfully"
        )
    )

});

const logoutUser= asyncHandler(async(req,res)=>{ //we need middleware as we don't have access to id 
  const id= req.user._id   //we get it from auth.middleware
 await User.findByIdAndUpdate(id,{
      $set:{
        refreshToken: undefined
      }
  },{
    new: true
  })

  const options={
    httpOnly: true,
    secure: true,
  }

  return res.status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User logged Out"));
 
})
export { registerUser, loginUser,logoutUser };
