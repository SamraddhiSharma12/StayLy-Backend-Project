// Core Module
const path = require('path');

// External Module
const express = require('express');
const session=require('express-session');
const MongoDBStore=require('connect-mongodb-session')(session);
const multer=require('multer');
const DB_PATH="mongodb+srv://samraddhisharma03:SAMRADDHI12S@samraddhi-first-db.gd8uchr.mongodb.net/airbnb";

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const rootPath = require("./utils/rootPath");
const contactRouter = require('./routes/contactRouter');
const { pageNotFound } = require('./controllers/errors');
const authRouter= require("./routes/authRouter");


//const {mongoConnect}=require("./utils/databaseUtils");
const {default:mongoose}=require('mongoose');

const app = express();

// to tell express that we are using template engine
app.set("view engine", "ejs");
//folder info where ejs will get used
app.set("views", "views");

app.use((req, res, next)=>{
    console.log(req.url, req.method);
    next();
});

const store=new MongoDBStore({
  uri:DB_PATH,
  collection:'sessions'
});
//assigning consistent names to uploaded images 
// const randomeString=(length)=>{
//   const characters='abcdefghijklmnopqrstuvwxyz';
//   let result='';
//   for(let i=0; i<length; i++){
//     result+=characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return result;
// }
 
// const storage=multer.diskStorage({
//   destination:(req, file, cb)=>{
//     cb(null, "uploads/");
//   },
//   filename:(req,file, cb)=>{
//     cb(null, randomeString(10)+'-'+ file.originalname);
//   }

// });

// const fileFilter=(req,file, cb)=>{
//   if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype==='image/jpeg'||file.mimetype==='image/avif'){
//     cb(null, true);
//   }
//   else{
//     cb(null,false);
//   }
// }
// //Create a filter to only allow PDFs
// const pdfFileFilter = (req, file, cb) => {
//   if (file.mimetype === 'application/pdf') {
//     // This is a PDF. Accept it.
//     cb(null, true); 
//   } else {
//     // This is not a PDF. Reject it.
//     cb(new Error('Only .pdf files are allowed!'), false);
//   }
// };

// //creates a folder to uphold uploaded files
// const multerOptions={
//   storage,
//   fileFilter:pdfFileFilter
// }

app.use(express.urlencoded({extended:true}));
//app.use(multer(multerOptions).single('photo'));

app.use(express.static(path.join(rootPath, "public")));
app.use("/uploads", express.static(path.join(rootPath,'uploads')));
app.use("/host/uploads", express.static(path.join(rootPath,'uploads')));
app.use("/homes/uploads", express.static(path.join(rootPath,'uploads')));


app.use(session({
  //used to sign the sesssion Id & encrypt session data
secret:"Samraddhi doing wonders!",
//forces session to be saved back to the store even if not modified
resave:false,
saveUninitialized:true,
store:store,
}
));

//even on adding cookie nav features not getting displayed 
app.use((req, res, next)=>{
  req.isLoggedIn=req.session.isLoggedIn;
  next();
});

app.use(storeRouter);

//navbar features will get reflected only once user is loggedIn 
app.use("/host", (req, res, next)=>{
  if(!req.isLoggedIn){
    return res.redirect("/login");
  }
  next();
});
app.use("/host", hostRouter);
app.use(contactRouter);
app.use(authRouter);


app.use(pageNotFound);

const PORT = 5500;

mongoose.connect(DB_PATH).then(()=>{
  console.log("Connected to mongo");
  app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});
  }).catch(err=>{
    console.log("Error while connecting to mongo", err);  
});
