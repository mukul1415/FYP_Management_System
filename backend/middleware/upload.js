import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

export const MAX_UPLOAD_FILES = 10;
export const MAX_UPLOAD_FILE_SIZE = 10 * 1024 * 1024;

export const ALLOWED_UPLOAD_EXTENSIONS = [
    ".pdf",
    ".docx",
    ".ppt",
    ".pptx",
    ".zip",
    ".rar",
    ".tar",
];

const ALLOWED_UPLOAD_MIME_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/zip",
    "application/x-zip-compressed",
    "application/x-rar-compressed",
    "application/x-rar",
    "application/vnd.rar",
    "application/x-tar",
    "application/octet-stream",
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureDirExists = (dir) => {
    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath;

        if(req.route.path.includes("/upload/:projectId")) {
            uploadPath = path.join(__dirname, "../uploads/projects", req.params.projectId);
        } else if(req.route.path.includes("/upload/:userId")) {
            uploadPath = path.join(__dirname, "../uploads/users", req.params.userId);
        } else {
            uploadPath = path.join(__dirname, "../uploads/temp");
        }

        ensureDirExists(uploadPath);
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
        const ext = path.extname(file.originalname);
        const baseName = path
            .basename(file.originalname, ext)
            .replace(/[^a-z0-9-_]/gi, "-")
            .slice(0, 80) || "file";

        cb(null, `${baseName}-${uniqueSuffix}${ext.toLowerCase()}`);
    },
});

const fileFilter = (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();

    if(
        ALLOWED_UPLOAD_MIME_TYPES.includes(file.mimetype) &&
        ALLOWED_UPLOAD_EXTENSIONS.includes(fileExt)
    ) {
        cb(null, true);
    } else {
        cb(
            new Error(
            "Invalid file type. Reports must be PDF or DOCX, presentations must be PPT/PPTX or PDF, and source code must be ZIP, RAR, or TAR."
           ), false
        );
    };
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_UPLOAD_FILE_SIZE,
        files: MAX_UPLOAD_FILES,
    },
});

const handleUploadError = (err, req, res, next) => {
    if(err instanceof multer.MulterError) {
        if(err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "File too large. Maximum size is 10MB",
            });
        }

        if(err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                success: false,
                message: "Too many files. Maximum 10 files allowed.",
            });
        }
    }

    if(err.message && err.message.includes("Invalid file type")) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    next(err);
};

export { upload, handleUploadError };
