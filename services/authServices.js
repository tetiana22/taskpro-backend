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
// import bcryptjs from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/User.js";
import dotenv from "dotenv";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine the folder based on file properties or request data
    let folder = "avatars"; // default to avatars folder
    // You can add more conditions to determine folder based on file fieldname or other data
    return {
      folder: folder,
      allowed_formats: ["jpg", "png"], // Adjust allowed formats as needed
      public_id: file.originalname, // Use original filename as the public ID
      transformation: [
        { width: 350, height: 350 },
        { width: 700, height: 700 },
      ],
    };
  },
});

const upload = multer({ storage });

export const saveAvatar = async (req, res) => {
  try {
    const { path } = req.file;
    // Optionally, you can process `path` to extract the Cloudinary URL
    res.status(200).json({ avatarURL: path }); // Return the Cloudinary URL or path as needed
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Avatar upload failed" });
  }
};

export default upload;
export const updateThemeDB = async (idOwner, theme) => {
  const updateTheme = await User.findByIdAndUpdate(
    idOwner,
    { theme },
    { new: true }
  );
  return updateTheme;
};
