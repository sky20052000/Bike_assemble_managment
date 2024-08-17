const db = require("../database/connection");
const util = require("util");

const Query = util.promisify(db.query).bind(db);

const Employee = {
  createUser: async (data, res) => {
    try {
      return await Query("Insert INTO employees SET ?", [data]);
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  },

  userUsernameOrEmailExists: async (name, email, res) => {
    try {
      return await Query(
        "SELECT Count(*) FROM employees WHERE name = '" +
          name +
          "' OR email = '" +
          email +
          "'",
        []
      );
    } catch (err) {
      console.log(err, "nn");
      return res.status(500).send({ status: false, message: err.message });
    }
  },

  userExists: async (email, res) => {
    try {
      return await Query(
        "SELECT * FROM employees WHERE email = '" + email + "'",
        []
      );
    } catch (err) {
      console.log(err, "nn");
      return res.status(500).send({ status: false, message: err.message });
    }
  },

  bikeExists: async (id, res) => {
    try {
      return await Query("SELECT * FROM bikes WHERE id = '" + id + "'", []);
    } catch (err) {
      console.log(err, "nn");
      return res.status(500).send({ status: false, message: err.message });
    }
  },

  checkForAssembleBike: async (id, res) => {
    try {
      return await Query(
        "SELECT * FROM assembly_records WHERE employee_id = ? AND status = ?",
        [id, "in-progress"]
      );
    } catch (err) {
      console.log(err, "nn");
      return res.status(500).send({ status: false, message: err.message });
    }
  },

  insertData: async (data, res) => {
    try {
      return await Query("Insert INTO assembly_records SET ?", [data]);
    } catch (err) {
      return res.status(500).send({ status: false, message: err.message });
    }
  },

  checkAssembleBikeTime: async (id, res) => {
    try {
      return await Query(
        `SELECT b.assembly_time, a.start_time FROM assembly_records a 
            JOIN bikes b ON a.bike_id = b.id 
            WHERE a.id =${id} AND a.end_time IS NULL`,
        []
      );
    } catch (err) {
      console.log(err, "nn");
      return res.status(500).send({ status: false, message: err.message });
    }
  },

  updateStatus: async (data, res) => {
    try {
      return await Query(
        `UPDATE assembly_records 
             SET end_time = ?, 
                 status = ?, 
                 bike_assemly_time = ?, 
                 time_taken_to_assemble_bike = ? 
             WHERE id = ?`,
        [
          data.end_time,
          data.status,
          data.bike_assemly_time,
          data.time_taken_to_assemble_bike,
          data.assemblyId,
        ]
      );
    } catch (err) {
      console.log(err, "nn");
      return res.status(500).send({ status: false, message: err.message });
    }
  },
};

module.exports = Employee;
