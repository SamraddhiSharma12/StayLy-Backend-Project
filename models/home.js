//const registeredHomes=[];//fake database
const fs=require('fs');
const path =require('path');
const rootPath=require('../utils/rootPath');
const Favourites = require('./favourites');
const homeDataPath=path.join(rootPath,'data', 'homes.json');

module.exports=class Home{
  constructor(houseName,price, location, rating, photo){
  this.houseName=houseName;
  this.price=price;
  this.location=location;
  this.rating=rating;
  this.photo=photo;
  }
  save()//2) save kis liye ho rha hai? for edit / add-home
  {
    //1)adding new home error de rha 
    //so 1st read the file
    //usk andar ull get registredH variable usko use kark do the needful work of adding new home & fir write karna
    // this.id=Math.random().toString(); //taki indivi homes ki detail fetch karwapaye using unique id
    Home.fetchAll((registeredHomes)=>{
      if(this.id){//edit case
      registeredHomes=registeredHomes.map(home=>home._id===this.id? this:home)
      }
      else{// add case
         this.id=Math.random().toString(); 
         registeredHomes.push(this);
      }
    
    fs.writeFile(homeDataPath, JSON.stringify(registeredHomes),error =>{
      console.log("File writing concluded", error);
    });
    });
    
  }
  static fetchAll(callback){
    
    fs.readFile(homeDataPath, (err, data)=>{
      //console.log("file read", err,data);
      if(!err){
       callback(JSON.parse(data));
      }else{
      callback([]);
      }
    });
  }
  //to render details of a particular home
static findById(homeId, callback){
   //sare ghar mein se will find out
   this.fetchAll(homes=>{
   const homeFound= homes.find(home=>home._id===homeId);
   callback(homeFound);
   })
}
static deleteHomesById(homeId,callback){
   this.fetchAll(homes=>{
   homes=homes.filter(home=>home._id !==homeId); //id same ->delete & not same ->reh jaygi
   fs.writeFile(homeDataPath, JSON.stringify(homes),error=>{
    Favourites.deleteFavourites(homeId,callback);
   }
    );
  })
   }
};


