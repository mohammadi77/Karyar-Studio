import express from "express";
import cors from "cors";
import multer from "multer";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = join(__dirname, "..", "public", "uploads");
const PORT = process.env.UPLOAD_PORT || 3002;
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    cb(null, `${unique}${extname(file.originalname).toLowerCase()}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("فقط فایل تصویر مجاز است"));
    }
  },
});

const app = express();
app.use(cors());

app.post("/upload", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "حجم فایل بیش از حد مجاز است (حداکثر ۸ مگابایت)"
          : err.message || "خطا در آپلود فایل";
      return res.status(400).json({ error: message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "فایلی ارسال نشده است" });
    }
    res.status(201).json({ url: `/uploads/${req.file.filename}` });
  });
});

app.listen(PORT, () => {
  console.log(`Upload server started on http://localhost:${PORT}`);
});
