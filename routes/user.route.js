import { Router } from "express";
import userController from "../controllers/user.controller.js";
import UserValidator from "../validator/user.validator.js";
class UserRoutes {
  router = null;
  constructor() {
    this.router = Router();
    this.Login();
    this.Signup();
    this.Delete();
    this.UpdateUser();
  }
  Login() {
    this.router.get("/login", userController.HandleLogin);
  }
  Signup() {
    this.router.post("/signup",UserValidator.ValidateCreateUser, userController.HandleSignup);
  }
  UpdateUser() {
    this.router.get("/:id", userController.HandleUpdateUser);
  }
  Delete() {
    this.router.get("/:id", userController.HandleUpdateUser);
  }
}
 export default new UserRoutes().router;
