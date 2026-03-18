const { check, validationResult } = require("express-validator");
const User=require("../models/user.models");
const bcrypt=require("bcryptjs");

exports.getLogin=(req, res) => {
  res.render('auth/login',{
    pageTitle:'Login',
    currentPage:'Login',
    isLoggedIn:false,
    errors:[],
    oldInput:{email:""},
    user: {},
  });
}
  exports.postLogin=async (req,res,next)=>{
    //reading logIn input
    const {email, password}=req.body;
    const user= await User.findOne({email});
    if(!user){
      return res.status(422).render("auth/login",{
        pageTitle:"Login",
        currentPage:"login",
        isLoggedIn:false,
        errors:["User does not exist"],
        oldInput:{email},
        user:{},

      });
    }

    //once user signed up match passwords 
    const isMatch= await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(422).render("auth/login",{
        pageTitle:"Login",
        currentPage:"login",
        isLoggedIn:false,
        errors:["Invalid Password"],
        oldInput:{email},
        user: {},
      });
    }
    req.session.isLoggedIn=true;
    req.session.user=user;
    await req.session.save();
    res.redirect("/");
  };
  exports.getSignup=(req, res) => {
  res.render('auth/signup',{
    pageTitle:'signup',
    currentPage:'signup',
    isLoggedIn:false,
    errors: [], 
    oldInput: { 
            name: '', 
            email: '', 
            userType: '' 
        },
        user: {},
  });
}
//express validators 
exports.postSignup=[
  check("name")
  .trim()
  .isLength({min:2})
  .withMessage("First Name should be atleast 2 characters long")
  .matches(/^[A-Za-z\s]+$/)
  .withMessage("First Name should contain only alphabets"),

  check("email")
  .isEmail()
  .withMessage("Please enter a valid email")
  .normalizeEmail(),

  check("password")
  .isLength({min:8})
  .withMessage("Password should be atleast 8 characters long")
  .matches(/[a-z]/)
  .withMessage("Password should contain atleast one lowercase letter")
  .matches(/[A-Z]/)
  .withMessage("Password should contain atleast one uppercase letter")
  .matches(/[0-9]/)
  .withMessage("Password should contain atleast one number")
  .matches(/[!@#$%^&*()<>,?{}|:]/)
  .withMessage("Password should contain atleast one special symbol")
  .trim(),

  check("confirmpassword")
  .trim() //custom validation
  .custom((value, {req})=>{
    if(value !==req.body.password){
      throw new Error('Password do not match');
    }
    return true;
  }),

  check("userType")
  .notEmpty()
  .withMessage("Please select a user type")
  .isIn(['guest', 'host'])
  .withMessage("Invalid user type"),


  (req,res,next)=>{
    const {name, email, password, userType }=req.body;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(442).render("auth/signup",{
        pageTitle:"Signup",
        currentPage:"signup",
        isLoggedIn:false,
        errors:errors.array().map(err=>
          err.msg),
          oldInput: {name, email, password, userType },
          user: {},
      });
    }
    //password is hashed 
    //once errors checked new user is created

    bcrypt.hash(password,12).then(hashedPassword =>{
    const user=new User({name, email, password:hashedPassword, userType});
    user.save();
    }).then(()=>{
      res.redirect("/login");
    }).catch(err=>{
      return res.status(422).render("auth/signup",{
        pageTitle:"signup",
        currentPage:"signup",
        isLoggedIn:false,
        errors:[err.message],
        oldInput:{name,email, password,userType},
        user: {},
      });
    })
    
    //req.session.isLoggedIn=true;
    // res.cookie("isLoggedIn", true);
    //req.isLoggedIn=true;
    
  }];

  exports.postLogout=(req, res,next)=>{
    req.session.destroy(()=>{
      res.redirect("/login");
    })
  };
