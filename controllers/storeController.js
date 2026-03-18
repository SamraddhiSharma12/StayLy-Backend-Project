// const Favourites = require("../models/favourites");
const Home = require("../models/home.models");
const User=require("../models/user.models");
const path=require("path");
const rootPath = require("../utils/rootPath");
const upload=require("../utils/multerConfig");

exports.getIndex=(req, res) => {
  console.log("Session Value", req.session);
  Home.find().then(registeredHomes=>{
    res.render("store/index",{registeredHomes:registeredHomes,
      pageTitle:'StayLY Home', 
      currentPage:'index',
      isLoggedIn:req.isLoggedIn,
      user: req.session.user,
    });
  });
};
exports.getHomes=(req, res) => {
  Home.find().then(registeredHomes=>{
    res.render("store/home-list", {registeredHomes:registeredHomes,pageTitle:'Homes-List', 
      currentPage:'Home',
      isLoggedIn:req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getBookings=(req, res) => {
    res.render("store/bookings", {
      pageTitle:'My bookings', 
      currentPage:'bookings',
      isLoggedIn:req.isLoggedIn,
      user: req.session.user,
    });
};
exports.getFavouritesList=async (req, res) => {
  const userId=  req.session.user._id;
  const user= await User.findById(userId).populate('favourites');

    // Home.find().then(registeredHomes=>{
    //   //getting list of homes
    //   console.log(favourites, registeredHomes);
    //   //out of all added homes filtering those which are marked as fav
    //   const favouriteHomes= registeredHomes.filter(home=>favourites.includes(home._id.toString()));

    res.render("store/fav-list", {
      favouriteHomes:user.favourites,
      pageTitle:'My Favourites', 
      currentPage:'favourites',
      isLoggedIn:req.isLoggedIn,
      user: req.session.user,
    });
 }
exports.postAddToFavourites=async(req, res,next)=>{
  //marking favourites particular to user
  const homeId=req.body.id;
  const userId=req.session.user._id;
  const user=await User.findById(userId);
  if(!user.favourites.includes(homeId)){
     user.favourites.push(homeId);
     await user.save();

  }
  res.redirect("/fav-list")
}
//marking favourites as a user be it guest/host 
  // Favourites.findOne({houseId:homeId}).then((fav)=>{
  //   if(fav){
  //   console.log("Fav already added");
  //   }
  //   else{
  //      const fav=new Favourites({houseId:homeId});
  // fav.save().then(result=>{
  //   console.log("Fav added", result);
  // });

  //res.redirect("/fav-list")
  //   }).catch(err=>{
  //     console.log("Error while marking favourite:", err);
  //   });
  // }
exports.getHomeDetails=(req, res)=>{
  const homeId=req.params.homeId;
  //console.log("at home details page", homeId);
  //details show karni hai specificly
  Home.findById(homeId).then(home =>{
    //const home=homes[0];
    //agar ghar nhi mila 
    if(!home){
       console.log("home not found!");
      res.redirect("/home-list")
    }
    else{
      res.render("store/home-detail",{
        home:home,
        pageTitle:'Home Detail', 
        currentPage:'Home',
        isLoggedIn:req.isLoggedIn,
        user: req.session.user,
      });
    }
  }) ;
}
exports.getHouseRules=[(req, res, next)=>{
  if(!req.session.isLoggedIn){
    return res.redirect("/login");
  }
  next();
  
},
 async (req, res, next) => {
    try {
      const homeId = req.params.homeId;

      // 1. Find the home in the database
      const home = await Home.findById(homeId);

      if (!home) {
        return res.status(404).send('Home not found.');
      }

      // 2. Get the path *you saved* in the database
      // (e.g., 'uploads/rules/123-abc-rules.pdf')
      const filePath = home.rules; // <-- ASSUMING YOU SAVE THE PATH in a 'rules' field

      if (!filePath) {
        return res.status(404).send('No rules file found for this home.');
      }

      // 3. Create a nice name for the user's download
      const downloadFileName = `Rules_for_${home.houseName.replace(/ /g, '_')}.pdf`;

      // 4. Download the file from its saved path
      res.download(filePath, downloadFileName);
      
    } catch (err) {
      console.log(err);
      res.redirect("/add-home");
      next(err);
    }
  }
];
exports.postRemoveFromFavourites=async (req, res)=>{
  const homeId=req.params.homeId;
  const userId=req.session.user._id;
  const user=await User.findById(userId);
  if(user.favourites.includes(homeId)){
    user.favourites=user.favourites.filter(fav=> fav!=homeId);
    await user.save();
  }
   res.redirect("/fav-list");
}
  // console.log("in the favourites delete function");
  // const homeId=req.params.homeId;
  // Favourites.findOneAndDelete({houseId:homeId}).then(result=>{
  //   console.log("Favourite removed", result);
  // }).catch(err=>{
  //   console.log("Error while removing favourite:", err);
  // }).finally(()=>{
  //   res.redirect("/fav-list");
  // });


