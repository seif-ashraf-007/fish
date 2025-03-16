

export const globalError =(err,req,res,next)=>{
    let Code =err.statusCode || 500
        res.status(Code).json({Error:"Error",Message:err.message,Code:Code})
    }