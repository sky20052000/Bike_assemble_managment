const Bike = require("../query/bike");
const addBike = async (req, res) => {
  try {
    const { name, assembly_time } = req.body;
    if (!(name && assembly_time)) {
      return res
        .status(400)
        .json({ success: false, message: "Mandatory fields can't be empty!" });
    }

    const bikeNameExits = await Bike.bikeNameExists(name);
    if (bikeNameExits[0]["Count(*)"] > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Bike name is already exists!" });
    }

    let saveData = {
      name,
      assembly_time,
      created_By: Number(req.middleware.id),
    };
    await Bike.createBike(saveData, res);
    return res
      .status(200)
      .json({ success: true, message: "Bike added successfully!" });
  } catch (e) {
    console.log(e, "nn");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};

const getBikeList = async (req, res) => {
  try {
    let getData = await Bike.getBike(req.middleware.id, res);
    //  console.log(getProduct,'nn')
    if (getData.length == 0) {
      return res
        .status(200)
        .json({ success: true, message: "No records found!" });
    }
    return res.status(200).json({ success: true, data: getData });
  } catch (e) {
    console.log(e, "error");
    return res
      .status(500)
      .json({ sucess: false, message: "Something went wrong!" });
  }
};


module.exports = {
  addBike,
  getBikeList,
};
