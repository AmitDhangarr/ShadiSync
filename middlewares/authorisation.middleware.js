class UserAuthorisation {
  static async checkRole(req, res, next) {
    const {payload} = req.user;
    const role = payload.role;
    
    if(role === "guest") {
      res
        .status(401)
        .json({
          success: false,
          error: "Access Denied",
          message: "guest is not allowed access to this page.",
        });
    } else {
      next();
    }
  }
}

export default UserAuthorisation;
