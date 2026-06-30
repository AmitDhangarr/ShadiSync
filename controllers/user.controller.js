import  USER  from "../models/user.model.js";
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
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          success: false,
          message: "Password is required.",
        });
      }

      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;

      if (!passwordRegex.test(password.trim())) {
        return res.status(400).json({
          success: false,
          message:
            "Password must contain only letters and numbers, with at least one of each.",
        });
      }

      const hashedPassword = await bcrypt.hash(password.trim(), 10);

      const user = await USER.findByIdAndUpdate(
        req.params.id,
        { $set: { password: hashedPassword } },
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
        message: "Password has been updated successfully.",
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
    
      //  remove existing cookies
      res.clearCookie("token");
      
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
  try {
  const { email, password, confirmPassword } = req.body || {} ;

  if (!email || email.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "email is required.",
    });
  }

  const user = await USER.findOne({ email: email.trim() });
  
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "account does not exits.",
    });
  }

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required.",
    });
  }

  if (!confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Confirm password is required.",
    });
  }

  if (password.trim() !== confirmPassword.trim()) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match.",
    });
  }

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;

  if (!passwordRegex.test(password.trim())) {
    return res.status(400).json({
      success: false,
      message: "Password must contain only letters and numbers, with at least one of each.",
    });
  }

  user.password = password.trim();
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password has been updated successfully.",
  });
} catch (error) {
  return res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again later.",
  });
}
     
  }
  static async handleVerifySecurityQuestion(req, res) {
    try {
      const { answer } = req.body;

      const error = {};

      if (!answer || answer.trim() === "") {
        error.answer = "answer is required";
      }

      if (!answer) {
        return res.status(400).json({
          success: false,
          error: error,
          message: "validation failed",
        });
      }

      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No token found. Please login.",
        });
      }

      const data = JwtToken.getToken(token);

      if (!data) {
        return res.status(400).json({
          success: false,
          message: "error while parsing token",
        });
      }
      const email = data.payload.email;

      const actualAnswer = await USER.findOne(
        { email: email },
        { securityAnswer: 1 },
      );

      const result = actualAnswer.securityAnswer.includes(answer);

      if (!result) {
        return res.status(400).json({
          success: false,
          message: "your answer does not matched with SecurityAnswer",
        });
      }

      return res.status(200).json({
        success: true,
        message: "your answer has been matched successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error,
        message: "Something went wrong, please try again later",
      });
    }
  }

  static async handleGetSecurityQuestion(req, res) {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No token found. Please login.",
        });
      }

      const data = JwtToken.getToken(token);

      if (!data) {
        return res.status(400).json({
          success: false,
          message: "error while parsing token",
        });
      }
      const email = data.payload.email;

      const question = await USER.findOne(
        { email: email },
        { securityQuestion: 1 },
      );

      return res.status(200).json({
        success: true,
        question: question,
        message: "question is fetched successfully",
      });

      if (!question) {
        return res.status(401).json({
          success: false,
          message: "There are no question",
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: true,
        error: error,
        message: "internal server error",
      });
    }
  }
  static async handleLogout(req, res) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      return res.status(200).json({
        success: true,
        message: "user has been logged out successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: true,
        message: "something went wrong while logging out the user",
      });
    }
  }
  static async handleEditProfile(req, res) {
    try {
      const { name, email, role, phone } = req.body;
      const error = {};

      //validation
      if (!name || name.trim() === "") {
        error.name = "Name is required";
      }
      if (!email || email.trim() === "") {
        error.email = "email is required";
      }
      if (!phone || phone.trim() === "") {
        error.phone = "phone is required";
      }
      if (!role || role.trim() === "") {
        error.role = "role is required";
      }

      if (!name || !email || !phone || !role) {
        return res.status(400).json({
          success: false,
          error: error,
          message: "validation failed",
        });
      }

      // updating the existing profile

      const user = await USER.findByIdAndUpdate(
        { _id: req.params.id },
        {
          name: name,
          email: email,
          phone: phone,
          role: role,
        },
      );

      if (!user) {
        return res.status(400).json({
          success: true,
          message: "user not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "profile has been updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong ! try again later",
      });
    }
  }
  static async handlegetProfile(req, res) {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No token found. Please login.",
        });
      }

      const data = JwtToken.getToken(token);

      const email = data.payload.email;

      const user = await USER.findOne(
        { email: email },
        { name: 1, email: 1, phone: 1, role: 1 },
      );

      return res.status(200).json({
        success: true,
        profile: user,
        message: "profile has been fetched successfully",
      });

      if (!user) {
        res.status(404).json({
          success: false,
          message: "user does not exists",
        });
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }
  }
}

export default UserController;
