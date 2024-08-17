const Employee = require("../query/employee");
const Validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Util = require("../utils/util");
dotenv.config();

const addEmployee = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!(name && email && password)) {
      return res
        .status(400)
        .json({ success: false, message: "Mandatory fields can't be empty!" });
    }
    // validateEmail
    const validateEmail = Validator.isEmail(email);
    if (!validateEmail) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    const usernameExits = await Employee.userUsernameOrEmailExists(name, email);
    if (usernameExits[0]["Count(*)"] > 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter unique username and email!",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    let saveData = {
      name,
      email,
      password: hashPassword,
      role: String(role ? role : 1),
    };
    await Employee.createUser(saveData, res);
    return res
      .status(200)
      .json({ success: true, message: "Employee added successfully!" });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const employeeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({
        success: false,
        message: "Mandatory fields can not be epmty!",
      });
    }
    // validate email
    const validateEmail = Validator.isEmail(email);
    if (!validateEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email!" });
    }

    const findUser = await Employee.userExists(email);
    if (findUser.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exists" });
    }
    // compare password
    const validatePassword = bcrypt.compare(password, findUser[0].password);
    if (!validatePassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password mismatch" });
    }

    // // geneateToken
    const accessToken = await Util.GenerateAccessToken(
      findUser[0].id,
      findUser[0].name,
      findUser[0].email,
      findUser[0].role
    );
    const refreshToken = await Util.GenerateRefreshToken(
      findUser[0].id,
      findUser[0].role
    );
    let userData = {
      id: findUser[0].id,
      username: findUser[0].name,
      email: findUser[0].email,
      role: findUser[0].role,
    };

    const options = {
      httpOnly: true,
      secure: true,
    };

    // //   const accessToken = await user.GenerateAccessToken(user?._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ sucess: true, userData, accessToken, refreshToken });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};
const chooseBikeForAssembly = async (req, res) => {
  try {
    const { bikeId } = req.body;
    const bikeExists = await Employee.bikeExists(bikeId, res);
    if (bikeExists.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Bike does not exists" });
    }

    // Check if the employee is already assembling a bike
    const checkForAssembleBike = await Employee.checkForAssembleBike(
      req.middleware.id,
      res
    );
    // console.log(checkForAssembleBike, "bbbbbbbbbbb");
    if (checkForAssembleBike.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You are already assembling a bike.",
      });
    }

    // Record the assembly start
    const startTime = new Date();
    let saveData = {
      employee_id: req.middleware.id,
      bike_id: bikeId,
      start_time: startTime,
    };

    await Employee.insertData(saveData, res);
    return res
      .status(201)
      .json({ success: true, message: "Bike assembly started successfully." });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const completeAssembly = async (req, res) => {
  try {
    const { assemblyId } = req.body;
    const endTime = new Date();
    const checkAssembleBikeTime = await Employee.checkAssembleBikeTime(
      assemblyId,
      res
    );
    if (checkAssembleBikeTime.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Assembly not found or already completed",
      });
    }
    //  console.log(checkAssembleBikeTime,"cjccccccccccccc")
    const { assembly_time, start_time } = checkAssembleBikeTime[0];
    const startTime = new Date(start_time);
    const timeTaken = Math.ceil((endTime - startTime) / 6000);
    let updateData = {
      end_time: endTime,
      status: "completed",
      bike_assemly_time: assembly_time,
      time_taken_to_assemble_bike: timeTaken,
      assemblyId,
    };

    await Employee.updateStatus(updateData, res);
    return res
      .status(201)
      .json({ success: true, message: "Assembly completed successfully." });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};
module.exports = {
  addEmployee,
  employeeLogin,
  chooseBikeForAssembly,
  completeAssembly,
};
