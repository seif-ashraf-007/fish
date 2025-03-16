import mongoose, {Schema,model} from "mongoose";

const schema=new Schema({
user:{
    type:Schema.Types.ObjectId,
    ref:'User'
},
BankName:String,
CardNumber:Number,
ExpiryDate:Date,
pin:Number
},{
    timestamps:true,
    versionKey:false
})

export const Card= model('Card',schema)