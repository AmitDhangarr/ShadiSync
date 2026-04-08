import { USER } from "../models/user.model.js";
import JwtToken from "../service/jwttokens.js";
class UserController {
  static async HandleLogin(req, res) {
    const { email, password } = req.body;
    const User = await USER.findOne({ email, password });
    if (!User) {
      return res.status(404).json({
        success: false,
        errors: "Invalid email or password",
        message: "no user found",
      });
    } else {
      const token = JwtToken.setToken(User);
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, 
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,  
      });
      return res.status(200).json({
        success: true,
        message: "Logged In successfully",
      });
    }
  }

  static async HandleSignup(req, res) {
    const { name, email, password, phone, role,securityQuestion,
  securityAnswer } = req.body;

    const user = await USER.create({ name, email, password, phone,role,securityQuestion,
  securityAnswer });

    if (user) {
      return res.status(200).json({
        success: true,
        message: "user has been registered successfully",
      });
    }
  }
  static async HandleUpdateUser(req, res) {
    return res.end("welcome to delete page");
  }
  static async HandleDeleteUser(req, res) {
    return res.end("welcome to delete page");
  }
}

export default UserController;
