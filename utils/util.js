const dotenv  = require("dotenv");
dotenv.config();
const Jwt = require("jsonwebtoken"); 




const Util = {
 GenerateAccessToken: async function(id, name, email,role){
    //   console.log(user_id,username,"nnnnnnnnnnnnnnn")
    return Jwt.sign({
         id,
         name,
         email,
         role
    },
    process.env.Access_Token,
    {expiresIn:process.env.Expiration}

    )
},

GenerateRefreshToken : async function(id,role){
    return Jwt.sign({
        id,
        role
    },
    process.env.Refresh_Token,
    {expiresIn:"30d"}

    )
}


}


module.exports = Util