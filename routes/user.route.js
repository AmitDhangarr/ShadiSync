import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import UserValidator from "../validator/user.validator.js";

class UserRoutes {
  router = null;

  constructor() {
    this.router = Router();

    
    this.login();
    this.createAccount();
    this.forgotPassword();
    this.verifySecurityQuestion();
    this.logOut();

    this.updatePassword();
    this.deleteAccount();
    this.editProfile();
    this.getProfile();
  }


  login() {
    this.router.post(
      "/login",
      UserValidator.ValidateAuthUser,
      UserController.handleLogin,
    );
  }

  createAccount() {
    this.router.post(
      "/signup",
      UserValidator.ValidateCreateUser,
      UserController.handleCreateAccount,
    );
  }

  forgotPassword() {
    this.router.post("/forgot_password", UserController.handleForgotPassword);
  }

  verifySecurityQuestion() {
    this.router.post("/verify", UserController.handleVerifySecurityQuestion);
  }

  logOut() {
    this.router.post("/logout", UserController.handleLogout);
  }


  updatePassword() {
    this.router.patch(
      "/reset_password/:id",
      UserController.handlePasswordUpdate,
    );
  }

  deleteAccount() {
    this.router.delete("/account/:id", UserController.handleDeleteAccount);
  }

  editProfile() {
    this.router.post("/profile/edit", UserController.handleEditProfile);
  }

  getProfile() {
    this.router.post("/profile", UserController.handlegetProfile);
  }
}

export default new UserRoutes().router;