import { User } from "../models/User.js"; // Оновлено
import { HttpError, errorCatcher, sendEmail } from "../helpers/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authServices from "../services/authServices.js";
import dotenv from "dotenv";
dotenv.config();

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Provided email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
  });
  res.status(201).json({
    user: {
      email: newUser.email,
      name: newUser.name,
      avatarURL: newUser.avatarURL,
      theme: newUser.theme,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const { SECRET_KEY } = process.env;

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      name: user.name,
      avatarURL: user.avatarURL,
      theme: user.theme,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, name, avatarURL, theme } = req.user;
  console.log(req.user);

  res.status(200).json({
    email,
    name,
    avatarURL,
    theme,
  });
};

const updateUserTheme = async (req, res) => {
  const { _id: idOwner } = req.user;
  const { theme } = req.body;

  const updatedTheme = await authServices.updateThemeDB(idOwner, theme);

  res.status(200).json({
    email: updatedTheme.email,
    theme: updatedTheme.theme,
  });
};

const updateUser = async (req, res) => {
  try {
    const { _id } = req.user;
    let avatarURL;

    if (req.file) {
      const { path: tmpUpload } = req.file;
      console.log(tmpUpload);
      avatarURL = await authServices.saveAvatar(tmpUpload, _id);
    }

    const { name, email, password } = req.body;
    const updateData = { name, email, password };

    // Only add avatarURL to updateData if it exists
    if (avatarURL) {
      updateData.avatarURL = avatarURL;
    }

    const updatedUser = await authServices.updateUserData(_id, updateData);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatarURL: updatedUser.avatarURL,
      theme: updatedUser.theme,
      token: req.token,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const logout = async (req, res) => {
  const { _id } = req.user;
  console.log(req.user);
  await User.findByIdAndUpdate(_id, { token: " " });
  res.status(204).json({
    message: "No content",
  });
};
const getHelpEmail = async (req, res) => {
  const { name } = req.user;
  const { email, comment } = req.body;

  const helpRequest = {
    to: "taskpro.help.service@gmail.com",
    subject: "User needs help",
    html: `<div><p>Registered user of the application: <strong>${name}</strong></p>
                <p>Message from user: <strong>${comment}</strong></p>
                <p>Send response to email: <strong>${email}</strong></p></div>`,
  };

  try {
    await sendEmail(helpRequest);

    const helpResponse = {
      to: email,
      subject: "Support",
      html: `<div><p>Dear <strong>${name}</strong>!</p>
                    <p>We have received a message from you with the text: <strong>${comment}</strong>.</p>
                    <p>Thank you for your request! We will review your comment and respond as soon as possible.</p></div>`,
    };

    await sendEmail(helpResponse);

    res.json({ message: "Reply email has been sent" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send email", error: error.message });
  }
};

export default {
  register: errorCatcher(register),
  login: errorCatcher(login),
  getCurrent: errorCatcher(getCurrent),
  updateUser: errorCatcher(updateUser),
  updateUserTheme: errorCatcher(updateUserTheme),
  logout: errorCatcher(logout),
  getHelpEmail: errorCatcher(getHelpEmail),
};
