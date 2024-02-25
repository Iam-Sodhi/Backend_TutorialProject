import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

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
  const existedUser = User.findOne({
    $or: [{ username }, { email }], //way to check for both fields
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists.");
  }
  //Step4. Check for images , check for avatar(which is required true)
       //we already have middleware in our user.router which will provide us with the required images/files
        const avatarLocalPath= req.files?.avatar[0]?.path;
        const coverImageLocalPath= req.files?.coverImage[0]?.path;

         console.log(req.files);
  //Step5. Upload them to cloudinary , avatar

  //Step6. Creare user object - create entry in DB

  //Step7. Remove password and refresh token fiel from response

  //Step8. Check for user creation

  //Step9. Return response
  res.status(200).json({
    message: "OK",
  });
});

export { registerUser };
