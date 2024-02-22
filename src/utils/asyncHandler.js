//higher order function: (fn)=>{()=>{}}
const asyncHandler =(fn)=>async(req,res,next)=>{ // next is for middleware
   try {
    await fn(req,res,next);
   } catch (error) {
    res.status(err.code || 500).json({
        success: false,
        message: error.message
    })
   }
}
//it is a higher order function (functions which can accept other functions and also return them)

export {asyncHandler} 