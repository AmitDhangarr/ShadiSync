class OnlyHostAccess {
  static async hostAccess(req, res, next) {
    const {payload} = req.user;
    const role = payload.role;
    
    if(role === "host") {
        next();
    } else {
       res
        .status(401)
        .json({
          success: false,
          error: "Access Denied",
          message: "You are Unauthorized to access.",
        });
    }
  }
}

export default OnlyHostAccess;
