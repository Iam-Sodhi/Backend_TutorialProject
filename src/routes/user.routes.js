import e, {Router} from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/register").post( 
    upload.fields([   //midleware for file handling
        { 
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser);
//http://localhost:8000/api/v1/users/register

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT ,logoutUser);

export default router;