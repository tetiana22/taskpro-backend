import dotenv from "dotenv";
import { User } from "../models/User.js";
import cloudinary from "cloudinary";
import bcryptjs from "bcryptjs";
dotenv.config();

const saveAvatar = async (req) => {
  const avatarURL = req.file.path;
  const { _id } = req.user;
  const public_id = `user_avatar-${_id}`;

  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    public_id,
    folder: "avatars",
    transformation: [
      { width: 200, height: 200, gravity: "auto", crop: "fill" },
    ],
  };

  try {
    const result = await cloudinary.uploader.upload(avatarURL, options);

    return result.secure_url;
  } catch (error) {
    console.error(error);
  }
};

const updateUserData = async (userId, updatedData) => {
  if (updatedData.password) {
    updatedData.password = await bcryptjs.hash(updatedData.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
    new: true,
  });

  updatedUser.password = undefined;
  return updatedUser;
};

const updateThemeDB = async (idOwner, theme) => {
  const updateTheme = await User.findByIdAndUpdate(
    idOwner,
    { theme },
    { new: true }
  );
  return updateTheme;
};

export default {
  saveAvatar,
  updateUserData,
  updateThemeDB,
};
