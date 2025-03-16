import { AppError } from "../utils/appError.js"

export const Validate=(schema)=>{
return(req,res,next)=>{
    const validationObject = {};
    if (schema.describe().keys.logo) {
        validationObject.logo = req.file;  
    } else if (schema.describe().keys.image) {
        validationObject.image = req.file;  
    }else if (schema.describe().keys.imageCover) {
        validationObject.imageCover = req.files;  
    }else if (schema.describe().keys.images) {
        validationObject.images = req.files;  
    }
    Object.assign(validationObject, { ...req.body, ...req.params, ...req.query });

    const { error } = schema.validate(validationObject, { abortEarly: true });
if(!error){
    next()
}else{
let errMsgs= error.details.map(err => err.message)
    next(new AppError(errMsgs, 401))
}
}
}
