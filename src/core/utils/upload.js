import multer from "multer";
import path from "path";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";

// Temporary folder
const tempDir = "public/temp";
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Multer storage (temp only)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const fileName = Date.now() + "-" + Math.round(Math.random() * 1e5) + ext;
        cb(null, fileName);
    }
});

export const upload = multer({ storage });

// Upload single file
export const uploadToCloudinary = async (filePath, folderName) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folderName,
            resource_type: "auto"
        });

        // Try to delete the file, but don't crash if it fails (e.g. already deleted)
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (unlinkErr) {
            console.error("Error deleting temp file:", unlinkErr);
        }

        return {
            public_id: result.public_id,
            url: result.secure_url
        };
    } catch (error) {
        // Ensure cleanup on error
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (unlinkErr) {
            console.error("Error deleting temp file after failure:", unlinkErr);
        }
        throw error;
    }
};

// Delete file from cloudinary
export const deleteFromCloudinary = async (public_id) => {
    if (!public_id) return;
    return await cloudinary.uploader.destroy(public_id);
};

// Update file (delete + upload)
export const updateOnCloudinary = async (oldId, newFilePath, folderName) => {
    if (oldId) {
        await deleteFromCloudinary(oldId);
    }
    return await uploadToCloudinary(newFilePath, folderName);
};