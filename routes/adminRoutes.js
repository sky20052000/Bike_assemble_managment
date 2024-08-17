const express = require("express");
const adminController = require("../controller/adminController");
const adminRouter = express.Router();
const Authorize =require("../middleware/auth")

adminRouter.post("/create", adminController.addAdmin);
adminRouter.post("/login", adminController.adminLogin);

adminRouter.post("/assembled_bikes",Authorize([2]), adminController.noOfBikesAssembles);

adminRouter.get("/get_employee_production",Authorize([2]), adminController.getEmployeeProduction);


module.exports = adminRouter