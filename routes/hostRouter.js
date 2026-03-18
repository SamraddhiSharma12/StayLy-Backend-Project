// Core Module
const path = require('path');

// External Module
const express = require('express');
const hostRouter = express.Router();

// Local Module
const rootPath = require("../utils/rootPath");
const hostController= require('../controllers/hostController');
const upload=require("../utils/multerConfig");

hostRouter.get("/add-home",hostController.getAddHome);

hostRouter.post("/add-home",upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'home-rules', maxCount: 1 }]), 
    hostController.postHomeAdded);
hostRouter.get("/host-home-list",hostController.getHostHomes);
hostRouter.get("/edit-home/:homeId",hostController.getEditHome);
hostRouter.post("/edit-home",upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'home-rules', maxCount: 1 }
  ]),hostController.postEditHome);
hostRouter.post("/delete-home/:homeId",hostController.postDeleteHome);
module.exports=hostRouter;
