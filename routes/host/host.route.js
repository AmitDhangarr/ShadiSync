import { Router } from "express";
import userController from "../../controllers/user.controller.js";
import UserValidator from "../../validator/user.validator.js";
import hostEventRoute from "./host.event.route.js";
class HostRoute {
  router = null;
  constructor() {
    this.router = Router();
    this.Event();
    this.Invitation();
    this.Expense();
    this.Gift();
  }
  Event() {
    this.router.use("/event", hostEventRoute);
  }
  Invitation() {
    this.router.post(
      "/invitation",
      UserValidator.ValidateCreateUser,
      userController.HandleSignup,
    );
  }
  Expense() {
    this.router.patch("/expense", userController.HandleUpdateUser);
  }
  Gift() {
    this.router.delete("/gift", userController.HandleUpdateUser);
  }
}
export default new HostRoute().router;
