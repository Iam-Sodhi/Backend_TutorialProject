class ApiError extends Error{
    constructor(
        statusCode,
        message= "Something went wrong",
        errors= [],
        stack= ""
    ){
        // to overwrite
        super(message) //overwrite message always
        this.statusCode=statusCode; 
        this.data=null;
        this.message=message;
        this.success=false;
        this.errors=errors;

        //following code can be avoided. It is for production grade
        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export { ApiError}