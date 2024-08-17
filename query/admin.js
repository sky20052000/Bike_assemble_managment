const db = require("../database/connection");
const util = require("util")

const Query = util.promisify(db.query).bind(db);

const Admin = {

  createUser:async(data,res)=>{
          try{
            return await Query("Insert INTO employees SET ?", [data])
           
          }catch(err){
            return res.status(500).send({ status: false, message: err.message });
          }
   },

   userUsernameOrEmailExists:async(name,email,res)=>{
    try{
        return await Query("SELECT Count(*) FROM employees WHERE name = '"+ name +"' OR email = '"+ email +"'",[]);
    }catch(err){
        console.log(err,"nn")
      return res.status(500).send({ status: false, message: err.message });
    }
},
   

   userExists:async(email,res)=>{
    try{
        return await Query("SELECT * FROM employees WHERE email = '"+ email +"'",[]);
    }catch(err){
        console.log(err,"nn")
      return res.status(500).send({ status: false, message: err.message });
    }
},

getNumberBikesAssemble:async(data,res)=>{
    try{
        const query = `
        SELECT COUNT(*) AS total_bikes_assembled
        FROM assembly_records
        WHERE end_time BETWEEN ? AND ? AND status = ?`;

    const values = [data.start_date, data.end_date, data.status];
    
   return await Query(query, values);
    }catch(err){
        console.log(err,"nn")
      return res.status(500).send({ status: false, message: err.message });
    }
},


getEmployeeProduction:async(data,res)=>{
    try{
        const query = `
        SELECT e.name AS employee_name, COUNT(ass.id) AS assembly_records
        FROM assembly_records ass
        JOIN employees e ON ass.employee_id = e.id
        WHERE DATE(ass.end_time) = ? AND ass.status = ?
        GROUP BY e.id
    `;

    const values = [data.start_date, data.status];
    
   return await Query(query, values);
    }catch(err){
        console.log(err,"nn")
      return res.status(500).send({ status: false, message: err.message });
    }
},




}

module.exports = Admin;