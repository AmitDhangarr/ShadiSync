import { USER } from "../models/user.model.js";
import JwtToken from "../service/jwttokens.js";
import bcrypt from "bcrypt";

class UserController {
  static async handleLogin(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required.",
        });
      }

      const user = await USER.findOne({ email });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      const token = JwtToken.setToken(user);

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Logged in successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleCreateAccount(req, res) {
    try {
      const {
        name,
        email,
        password,
        phone,
        role,
        securityQuestion,
        securityAnswer,
      } = req.body;

      if (!name || !email || !password || !phone) {
        return res.status(400).json({
          success: false,
          message: "Name, email, password and phone are required.",
        });
      }

      const existingUser = await USER.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists.",
        });
      }

      const user = await USER.create({
        name,
        email,
        password,
        phone,
        role,
        securityQuestion,
        securityAnswer,
      });

      return res.status(201).json({
        success: true,
        data: { name: user.name, email: user.email, role: user.role },
        message: "Account created successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handlePasswordUpdate(req, res) {
    try {
      const user = await USER.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true },
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found. Please check the ID.",
        });
      }

      return res.status(200).json({
        success: true,
        data: { name: user.name, email: user.email, role: user.role },
        message: "User updated successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }

  static async handleDeleteAccount(req, res) {
    try {
      const user = await USER.findByIdAndDelete(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found. Please check the ID.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "User deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  }
  static async handleForgotPassword(req, res) {
    return res.json({ hello: "hii" });
  }
  static async handleVerifySecurityQuestion(req, res) {
    return res.json({ hello: "hii" });
  }
  static async handleLogout(req, res) {
    return res.json({ hello: "hii" });
  }
  static async handleEditProfile(req, res) {
    return res.json({ hello: "hii" });
  }
  static async handlegetProfile(req, res) {
    return res.json({ hello: "hii" });
  }
}

export default UserController;
