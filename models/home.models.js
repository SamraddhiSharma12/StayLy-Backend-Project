const {ObjectId}=require('mongodb');
const mongoose=require('mongoose');
// const favourites=require('./favourites');
const homeSchema=mongoose.Schema({
  houseName:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  location:{
    type:String,
    required:true
  },
  rating:{
    type:String,
    required:true
  },
  photo:String,
  description:String,
  rules:String
});
//when home is discarded , if marked as fav then it should also get discarded
// homeSchema.pre('findOneAndDelete',async function(next){
//     const homeId=this.getQuery()._id;
//     await favourites.deleteMany({houseId: homeId});
//     next();
// })
module.exports=mongoose.model('Home',homeSchema);
//save()
//find()
//findById()
//deleteHomesById()
