const mongoose = require('mongoose');

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true, ' Name is required']
    },
    email:{
        type:String ,
        required:[true,'Email is required'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Password is must']
    },
    userType:{
        type:String,
        enum:['guest', 'host'],
        default:'guest'
    },
    favourites:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Home'
    }]
});
module.exports=mongoose.model('User',userSchema);