// Core Module
const path = require('path');

// External Module
const express = require('express');
const contactRouter = express.Router();
//local
const rootPath = require("../utils/rootPath");

// contactRouter.get("/contact-us", (req, res, next) => {
//   res.sendFile(path.join(rootPath, 'views', 'contact.html'));
// });
contactRouter.get("/contact-us", (req, res, next) => {
  res.render('contact',{
      pageTitle:'Contact Form',
      isLoggedIn:req.isLoggedIn
    });
});
module.exports=contactRouter;