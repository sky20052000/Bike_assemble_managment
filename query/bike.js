const db = require("../database/connection");
const util = require("util");

const Query = util.promisify(db.query).bind(db);

const Bike = {
  createBike: async (data, res) => {
    try {
      return await Query("Insert INTO bikes SET ?", [data]);
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  },

  userExists: async (username, email, res) => {
    try {
      return await Query(
        "SELECT * FROM user WHERE username = '" +
          username +
          "' OR email = '" +
          email +
          "'",
        []
      );
    } catch (err) {
      // console.log(err, "nn");
      return res.status(500).send({ status: false, message: err.message });
    }
  },

  getBike: async (id, res) => {
    try {
      return await Query(
        "Select * from bikes",
        []
      );
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  },

  bikeNameExists: async (name, res) => {
    try {
      return await Query(
        "SELECT Count(*) FROM bikes WHERE name = '" + name + "' ",
        []
      );
    } catch (err) {
      console.log(err, "nn");
      return res.status(500).send({ status: false, message: err.message });
    }
  },

  updateProduct: async (data, res) => {
    try {
      //console.log("Update products Set product_name='"+data.product_name+"', created_By='"+data.created_By+"', product_title='"+data.product_title+"', product_category='"+data.product_category+"', updatedAt='"+data.updatedAt+"' WHERE product_id ="+data.product_id+" ","bbbb" )
      return await Query(
        "Update products Set product_name='" +
          data.product_name +
          "', created_By='" +
          data.created_By +
          "', product_title='" +
          data.product_title +
          "', product_category='" +
          data.product_category +
          "', updatedAt='" +
          data.updatedAt +
          "' WHERE product_id =" +
          data.product_id +
          " ",
        []
      );
    } catch (err) {
      //console.log(err,"rrr")
      return res.status(500).send({ status: false, message: err.message });
    }
  },

  getDetail: async (id, res) => {
    try {
      return await Query(
        "Select * from products where product_id='" + id + " '",
        []
      );
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  },

  deleteProduct: async (id, res) => {
    try {
      return await Query(
        "Delete from products where product_id='" + id + " '",
        []
      );
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  },
};

module.exports = Bike;
