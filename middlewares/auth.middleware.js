import JwtToken from "../service/jwttokens.js";
class AuthMiddleware {
  static AuthUser(req, res, next) {
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
      req.user = User;
    }
    next();
  }
}

export default AuthMiddleware;
