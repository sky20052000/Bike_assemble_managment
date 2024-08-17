const express = require("express");
const employeeController = require("../controller/employeeController");
const employeeRouter = express.Router();
const Authorize = require("../middleware/auth");

employeeRouter.post("/create", employeeController.addEmployee);
employeeRouter.post("/login", employeeController.employeeLogin);
employeeRouter.post("/select_bike",Authorize([1]), employeeController.chooseBikeForAssembly);
employeeRouter.post("/complete",Authorize([1]), employeeController.completeAssembly);


module.exports = employeeRouter