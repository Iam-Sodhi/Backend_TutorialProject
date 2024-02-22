import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path:'./.env'
})
connectDB()   // actually every async function returns a promise
.then(()=>{

    app.listen(process.env.PORT || 8080,()=>{ //this is the best practice when code is deployed on server
        console.log(`Server is running at port: ${process.env.PORT}`)
    }); 
})
.catch((err)=>{
    console.error("MONGO DB connection failed!! : ",err);
});