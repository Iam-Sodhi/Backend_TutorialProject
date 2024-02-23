import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({ //.use() is used for tasks related to midddleware or Configurations
    origin: process.env.CORS_ORIGIN, // origin refers to the frontend urls which can access our backend url
    credentials: true
})); 
app.use(express.json({//means we are accepting json in our server
 limit: "16kb"  //to put the limit on amount of json which our server will handle
}));
//nowadays we don't need *****body-parser***** for json files as it is already done 
app.use(express.urlencoded({extended: true, limit: "16kb"})); //to get data from url //'extended' for nested objects in url
app.use(express.static("public")); //to store files/assets in your server , No need to give name only public
app.use(cookieParser()); //to allow our server to access user's cookies 
app.use(cookieParser()); //to allow our server to access user's cookies 

export {app};