import path from "path";
import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET_NAME
} = process.env;

let s3Client;

const isAwsConfigured = () =>
  Boolean(AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && AWS_REGION && AWS_BUCKET_NAME);

const getS3Client = () => {
  if (!isAwsConfigured()) {
    throw new Error("AWS S3 is not configured. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, and AWS_BUCKET_NAME.");
  }

  if (!s3Client) {
    s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      }
    });
  }

  return s3Client;
};

const extensionByMimeType = {
  "application/pdf": ".pdf",
  "application/vnd.ms-powerpoint": ".ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
  "video/x-matroska": ".mkv",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif"
};

const sanitizeSegment = (value) =>
  String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const getExtension = (originalName, mimeType) => {
  const originalExtension = path.extname(originalName || "");
  if (originalExtension) {
    return originalExtension.toLowerCase();
  }

  return extensionByMimeType[mimeType] || "";
};

const buildPublicUrl = (key) => {
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");
  return `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${encodedKey}`;
};

export const inferMaterialTypeFromMimeType = (mimeType = "") => {
  if (mimeType === "application/pdf") {
    return "pdf";
  }

  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) {
    return "ppt";
  }

  if (mimeType.includes("word")) {
    return "doc";
  }

  if (mimeType.startsWith("video/")) {
    return "video";
  }

  if (mimeType.startsWith("image/")) {
    return mimeType === "image/gif" ? "infographic_animated" : "infographic_static";
  }

  return "other";
};

export const uploadBufferToS3 = async ({ buffer, originalName, mimeType, folder = "course-materials" }) => {
  if (!buffer?.length) {
    throw new Error("Cannot upload empty file to S3.");
  }

  const client = getS3Client();
  const safeFolder = sanitizeSegment(folder) || "course-materials";
  const safeName = sanitizeSegment(path.basename(originalName || "file", path.extname(originalName || ""))) || "file";
  const extension = getExtension(originalName, mimeType);
  const key = `${safeFolder}/${Date.now()}-${randomUUID()}-${safeName}${extension}`;

  await client.send(
    new PutObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ACL: "public-read"
    })
  );

  return {
    key,
    fileUrl: buildPublicUrl(key)
  };
};

export const extractS3KeyFromUrl = (fileUrl) => {
  if (!fileUrl) {
    return null;
  }

  try {
    const url = new URL(fileUrl);
    const host = url.hostname;

    const virtualHostPrefix = `${AWS_BUCKET_NAME}.s3.`;
    const pathStyleHost = `s3.${AWS_REGION}.amazonaws.com`;

    if (host.startsWith(virtualHostPrefix)) {
      return decodeURIComponent(url.pathname.replace(/^\//, ""));
    }

    if (host === pathStyleHost) {
      const pathParts = url.pathname.replace(/^\//, "").split("/");
      if (pathParts[0] !== AWS_BUCKET_NAME) {
        return null;
      }

      return decodeURIComponent(pathParts.slice(1).join("/"));
    }

    return null;
  } catch {
    return null;
  }
};

export const deleteFileFromS3 = async (fileUrl) => {
  if (!fileUrl || !isAwsConfigured()) {
    return false;
  }

  const key = extractS3KeyFromUrl(fileUrl);
  if (!key) {
    return false;
  }

  const client = getS3Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: key
    })
  );

  return true;
};

export const uploadBase64ToS3 = async (base64String, folder = "avatars") => {
  if (!base64String || typeof base64String !== "string" || !base64String.startsWith("data:")) {
    return base64String;
  }

  try {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return base64String;
    }

    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    const extension = extensionByMimeType[mimeType] || ".png";
    const originalName = `upload-${Date.now()}${extension}`;

    const uploadResult = await uploadBufferToS3({
      buffer,
      originalName,
      mimeType,
      folder
    });

    return uploadResult.fileUrl;
  } catch (error) {
    console.error("Error in uploadBase64ToS3:", error);
    return base64String;
  }
};

export const isS3Ready = () => isAwsConfigured();
