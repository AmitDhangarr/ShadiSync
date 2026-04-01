import {USER} from '../models/user.model.js'
class UserController {
  static async HandleLogin(req,res) {    
  }
  static async HandleSignup(req,res) {
     const {name,email,password,phone,role} = req.body;
       
    const user =  await USER.create({name,email,password,phone,role});

    if(user){
      return res.json({
         success:true,
         message:"user has been registered successfully",
      })
    };
    
     
  }
  static async HandleUpdateUser(req,res) {
     return res.end("welcome to delete page");
  }
  static async HandleDeleteUser(req,res) {
     return res.end("welcome to delete page");
  }
}

export default  UserController;