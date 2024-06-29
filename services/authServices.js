// import bcryptjs from "bcryptjs";
// import { v2 as cloudinary } from "cloudinary";
// import { User } from "../models/User.js";
// import dotenv from "dotenv";

// dotenv.config();

// const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
//   process.env;

// const saveAvatar = async (tmpUpload, _id) => {
//   cloudinary.config({
//     cloud_name: CLOUDINARY_CLOUD_NAME,
//     api_key: CLOUDINARY_API_KEY,
//     api_secret: CLOUDINARY_API_SECRET,
//   });
//   const result = await cloudinary.uploader.upload(tmpUpload);
//   console.log(result);
//   const url = cloudinary.url(result.public_id, {
//     width: 100,
//     height: 150,
//     crop: "fill",
//   });
//   return url;
// };

// const updateUserData = async (userId, updatedData) => {
//   if (updatedData.password) {
//     updatedData.password = await bcryptjs.hash(updatedData.password, 10);
//   }
//   const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
//     new: true,
//   });
//   updatedUser.password = undefined;
//   return updatedUser;
// };
import bcryptjs from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/User.js";
import dotenv from "dotenv";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine the folder based on file properties or request data
    let folder;
    if (file.fieldname === "avatarURL") {
      folder = "avatars";
    } else if (file.fieldname === "documents") {
      folder = "documents";
    } else {
      folder = "misc";
    }
    return {
      folder,
      allowed_formats: ["jpg", "png", "webp", "jpeg"], // Adjust the allowed formats as needed
      public_id: req.user._id, // Use original filename as the public ID
      transformation: [
        { width: 350, height: 350, crop: "fill" },
        { width: 700, height: 700, crop: "fill" },
      ],
    };
  },
});

const upload = multer({ storage });

export default upload;

export const saveAvatar = async (tmpUpload, _id) => {
  const result = await cloudinary.uploader.upload(tmpUpload);
  const url = cloudinary.url(result.public_id, {
    width: 100,
    height: 150,
    crop: "fill",
  });
  return url;
};

export const updateUserData = async (userId, updatedData) => {
  if (updatedData.password) {
    updatedData.password = await bcryptjs.hash(updatedData.password, 10);
  }
  const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
    new: true,
  });
  updatedUser.password = undefined;
  return updatedUser;
};
export const updateThemeDB = async (idOwner, theme) => {
  const updateTheme = await User.findByIdAndUpdate(
    idOwner,
    { theme },
    { new: true }
  );
  return updateTheme;
};
