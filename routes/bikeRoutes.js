const express = require("express");
const bikeController = require("../controller/bikeController");
const bikeRouter = express.Router();
const Authorize = require("../middleware/auth");

bikeRouter.post("/create_bike", Authorize([2]), bikeController.addBike);

bikeRouter.get("/get_bike_list", Authorize([1, 2]), bikeController.getBikeList);

module.exports = bikeRouter;
