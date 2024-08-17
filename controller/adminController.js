const Admin = require("../query/admin");
const Validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Util = require("../utils/util");
const { updateConstructSignature } = require("typescript");
dotenv.config();

const addAdmin = async (req, res) => {
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

    const usernameExits = await Admin.userUsernameOrEmailExists(name, email);
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
    await Admin.createUser(saveData, res);
    return res
      .status(200)
      .json({ success: true, message: "Admin added successfully!" });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const adminLogin = async (req, res) => {
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

    const findUser = await Admin.userExists(email);
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
const noOfBikesAssembles = async (req, res) => {
  try {
    let { start_date, end_date } = req.body;
    if (!start_date) {
      return res
        .status(400)
        .json({ success: false, message: "Start date is mandatory!" });
    }
    if (!end_date) {
      end_date = new Date();
    }
    let data = {
      start_date,
      end_date,
      status: "completed",
    };
    const getNumberBikesAssemble = await Admin.getNumberBikesAssemble(
      data,
      req.middleware.id
    );

    if (getNumberBikesAssemble.length == 0) {
      return res
        .status(200)
        .json({ success: true, message: "No records found!" });
    }
    return res
      .status(200)
      .json({ success: true, data: getNumberBikesAssemble[0] });
  } catch (e) {
    console.log(e, "error");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const getEmployeeProduction = async (req, res) => {
  try {
    let { start_date } = req.body;
    if (!start_date) {
      return res
        .status(400)
        .json({ success: false, message: "Start date is mandatory!" });
    }
    let data = {
      start_date,
      status: "completed",
    };
    const getEmployeeProduction = await Admin.getEmployeeProduction(data, res);

    if (getEmployeeProduction.length == 0) {
      return res
        .status(200)
        .json({ success: true, message: "No records found!" });
    }
    return res.status(200).json({ success: true, data: getEmployeeProduction });
  } catch (e) {
    console.log(e, "error");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

module.exports = {
  addAdmin,
  adminLogin,
  noOfBikesAssembles,
  getEmployeeProduction,
};
