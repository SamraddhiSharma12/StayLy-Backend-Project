const path = require("path");
const Home = require("../models/home.models");
const fs=require("fs");

 exports.getAddHome=(req, res) => {
  res.render('host/edit-home',{
    pageTitle:'Add Home',
    currentPage: 'add-home',
    editingvar:false,
    isLoggedIn:req.isLoggedIn,
    user: req.session.user,
    errors:[],
  });
};
 exports.getEditHome=(req, res) => {
  const homeId=req.params.homeId;
  //konse mode ? edit or addhome
  const editingvar=req.query.editing==='true';
  //async code 
  Home.findById(homeId).then(home =>{
    //const home=homes[0];
    if(!home){
    console.log("home not found for editing");
    return res.redirect("/host/host-home-list");
  }
  console.log(homeId,editingvar,home);
  res.render('host/edit-home',{
    home:home,//home ki details aa gayi
    pageTitle:'Edit home', 
    editingvar:editingvar,
    currentPage:'Edit-home',
    isLoggedIn:req.isLoggedIn,
    user: req.session.user,
    errors:[],
    oldInput: { 
          houseName: home.houseName,
          price: home.price,
          location: home.location,
          rating: home.rating,
          description: home.description
    }
  });
}).catch(err=>console.log(err));
 }
exports.getHostHomes=(req, res) => {
   Home.find().then(registeredHomes=>{
    res.render("host/host-home-list", {
      registeredHomes:registeredHomes,
      pageTitle:'host-home-list',
      currentPage:'host-home',
      isLoggedIn:req.isLoggedIn,
      user: req.session.user,
    }
    );
  });
};
exports.postHomeAdded=async (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;

  // --- THIS IS THE BIG CHANGE ---
  // req.files (plural) is an object given by upload.fields()
  // It looks like: { photo: [ ... ], 'home-rules': [ ... ] }

  // Check if req.files even exists. If not, you forgot 'enctype' on your form.
  if (!req.files) {
    console.log('UPLOAD ERROR: req.files is undefined. Did you forget enctype="multipart/form-data"?');
    return res.status(422).redirect('/host/add-home'); // Redirect back
  }

  // Safely get the file objects
  const photoFile = req.files['photo'] ? req.files['photo'][0] : null;
  const rulesFile = req.files['home-rules'] ? req.files['home-rules'][0] : null;

  // This is your check. It will now work correctly.
  if (!photoFile) {
    console.log('FILE ERROR: image not accurate (photoFile is null)');
    return res.status(422).redirect('/host/add-home');
  }
  // Get the paths
  const photoPath = photoFile.path;
  const rulesPath = rulesFile.path;

  // Save to database
  try {
    const home = new Home({
      houseName,
      price,
      location,
      rating,
      description,
      photo: photoPath,
      rules: rulesPath //'rules' is in Mongoose schema!
    });

    await home.save();
    
    console.log('Home saved successfully', home);

    // Redirect to a "success" page or the home page
    // Using res.render() after a POST is bad practice. Always redirect.
    res.redirect('/'); 
}
catch (err) {
    // If saving fails, pass the error to your error handler
    console.log('DATABASE SAVE ERROR:', err);
    next(err);
  }
}
const deleteFile = (filePath) => {
  const fullPath = path.join(__dirname, '..', filePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.log(`Could not delete file: ${filePath}`, err);
    } else {
      console.log(`Successfully deleted file: ${filePath}`);
    }
  });
};

exports.postEditHome=async (req, res, next) => {
  const { id, houseName, price, location, rating, description } = req.body;

  try {
    // 1. Find the home
    const home = await Home.findById(id);
    if (!home) {
      throw new Error('Home not found.');
    }

    // 2. Check for NEW files
    // 'req.files' comes from 'upload.fields'
    const photoFile = req.files['photo'] ? req.files['photo'][0] : null;
    const rulesFile = req.files['home-rules'] ? req.files['home-rules'][0] : null;

    // 3. Update text fields
    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    home.description = description;

    // 4. If a NEW photo was uploaded, update path and delete old one
    if (photoFile) {
      if (home.photo) {
        deleteFile(home.photo); // Delete old photo
      }
      home.photo = photoFile.path; // Set to new photo path
    }

    // 5. If a NEW rules file was uploaded, update path and delete old one
    if (rulesFile) {
      if (home.rules) {
        deleteFile(home.rules); // Delete old rules
      }
      home.rules = rulesFile.path; // Set to new rules path
    }

    // 6. Save all changes
    const result = await home.save();
    console.log("home updated", result);
    res.redirect("/host/host-home-list"); // Or wherever you list homes

  } catch (err) {
    console.log("Error during update", err);
    next(err); // Pass error to your error handler
  }
};
exports.postDeleteHome=(req, res)=>{
  const homeId=req.params.homeId;
   console.log("Came to delete function",homeId);
   Home.findByIdAndDelete(homeId).then(()=>{
    res.redirect("/host/host-home-list");
   })
   .catch(error=>{
    console.log("Error while deleting", error);
   })
};
