import mongoose, {Schema,model} from "mongoose";

const schema=new Schema({
name:{
    type:String,
    required:[true,'Name is required'],
},
address:{
    type:String,
    required:[true,'Name is required'],
},
phone:{
    type:String,
    required:[true,'Name is required'],
},
department:{
    type:Number,
    required:[true,'Name is required'],
},
description:{
    type:String,
    required:[true,'Name is required'],
},
},{
    timestamps:true,
    versionKey:false,
    toJSON:{virtuals:true}
})


schema.virtual('Cards', {
    ref:"Card",
    localField:"_id",
    foreignField:"user"
})

schema.pre(/^find/,function (){
    this.populate('Cards')
    })

export const User= model('User',schema)