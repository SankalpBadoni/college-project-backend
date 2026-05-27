import multer from "multer";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-matroska",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);

const materialUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 200 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(new Error("Unsupported file type. Allowed types: PDF, PPT/PPTX, DOC/DOCX, MP4, WEBM, MOV, MKV, PNG, JPG/JPEG, WEBP, GIF."));
    }

    return cb(null, true);
  }
});

export const uploadCourseMaterialFile = materialUpload.single("file");

const genericUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

export const uploadGenericFile = genericUpload.single("file");
