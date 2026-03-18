// Core Modules
const path = require('path');

// External Module
const express = require('express');
const storeRouter = express.Router();

// Local Module
const rootPath = require("../utils/rootPath");

const homesController = require('../controllers/storeController');

storeRouter.get("/", homesController.getIndex);
storeRouter.get("/home-list", homesController.getHomes);
storeRouter.get("/bookings", homesController.getBookings);
storeRouter.get("/fav-list", homesController.getFavouritesList);

storeRouter.get("/homes/:homeId", homesController.getHomeDetails);

storeRouter.get("/rules/:homeId", homesController.getHouseRules);

storeRouter.post("/fav-list", homesController.postAddToFavourites);

storeRouter.post("/favourites/delete/:homeId",homesController.postRemoveFromFavourites);

module.exports = storeRouter;