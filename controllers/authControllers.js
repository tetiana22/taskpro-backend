const { User } = require('../models/User');
const { HttpError, errorCatcher } = require('../helpers');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authServices = require('../services/authServices');
require('dotenv').config();

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, 'Provided email already in use');
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
    throw HttpError(401, 'Email or password is wrong');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }
  const { SECRET_KEY } = process.env;

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
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
  const { _id } = req.user;

  let avatarURL;
  if (req.file) {
    const { path: tmpUpload } = req.file;
    console.log(tmpUpload);
    avatarURL = await authServices.saveAvatar(tmpUpload, _id);
  }

  if (req.body) {
    const { name, email, password } = req.body;
    const updatedUser = await authServices.updateUserData(_id, {
      name,
      email,
      password,
      avatarURL,
    });
    res.json({ updatedUser });
  }
};

const logout = async (req, res) => {
  const { _id } = req.user;
  console.log(req.user);
  await User.findByIdAndUpdate(_id, { token: ' ' });
  res.status(204).json({
    message: 'No content',
  });
};

module.exports = {
  register: errorCatcher(register),
  login: errorCatcher(login),
  getCurrent: errorCatcher(getCurrent),
  updateUser: errorCatcher(updateUser),
  updateUserTheme: errorCatcher(updateUserTheme),
  logout: errorCatcher(logout),
};
