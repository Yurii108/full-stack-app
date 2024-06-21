import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    const passwordBody = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(passwordBody, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      password: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret-pass",
      {
        expiresIn: "30d",
      }
    );

    const { password, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      massage: "Failed to register",
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: "User not find",
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.password);

    if (!isValidPass) {
      return res.status(403).json({
        message: "Wrong password or login",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret-pass",
      {
        expiresIn: "30d",
      }
    );

    const { password, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      massage: "Failed to authorization",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User no found",
      });
    }

    const { password, ...userData } = user.toObject();

    res.json(userData);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      massage: "Don't have access",
    });
  }
};
