import JwtToken from "../service/jwttokens.js";
import USER from "../models/user.model.js"
class AuthMiddleware {
  static async AuthUser(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(404).json({
        success: false,
        error: "no token found",
        message: "user must login to move forward",
      });
    } else {
      const User = JwtToken.getToken(token);
      if (!User) {
        res.status(404).json({
          success: false,
          error: "invalid token found",
          message: "token has been expired",
        });
      }
    
      const user_email = User?.payload.email;
      const {_id} = await USER.findOne({email:user_email});
      const updatedUser = {[_id]:_id,...User};
      req.user = updatedUser;
    }
    next();
  }
}

export default AuthMiddleware;
