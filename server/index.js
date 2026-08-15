import express from "express";
import cors from "cors";
import multer from "multer";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ------------------------------------------------------------------
// مسیرهای مهم
// ------------------------------------------------------------------
// در محیط Render فایل‌سیستم موقت است؛ اگر DISK_DIR تنظیم شده باشد
// (Persistent Disk) از آن استفاده می‌کنیم، در غیر این صورت ریشه‌ی پروژه.
const DISK_DIR = process.env.DISK_DIR ? resolve(process.env.DISK_DIR) : ROOT;
const UPLOAD_DIR = join(DISK_DIR, "public", "uploads");
const DB_FILE = join(DISK_DIR, "db.json");

const PORT = process.env.PORT || 3000;
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

// اطمینان از وجود پوشه‌ی آپلود
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ------------------------------------------------------------------
// تنظیمات آپلود (Multer)
// ------------------------------------------------------------------
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

// ------------------------------------------------------------------
// دیتابیس (lowdb) — همان موتوری که json-server استفاده می‌کند
// ------------------------------------------------------------------
const adapter = new JSONFile(DB_FILE);
const db = new Low(adapter, {});

// ------------------------------------------------------------------
// کمکی‌های REST API (معادل رفتار json-server برای نیازهای پروژه)
// ------------------------------------------------------------------
// تطبیق فیلتر کوئری‌استرینگ با یک آیتم.
// هر کلید کوئری که با آیتم تطابق داشته باشد (با مقایسه‌ی ساده) نگه داشته می‌شود.
function matchesQuery(item, query) {
  return Object.keys(query).every((key) => {
    const expected = query[key];
    const actual = item?.[key];
    // تطبیق ساده‌ی مقدار یا رشته‌ی آن (json-server همین رفتار را دارد)
    // eslint-disable-next-line eqeqeq
    return actual == expected || String(actual) === String(expected);
  });
}

// یافتن آیتم با id؛ json-server از همخوانی نوع‌دار یا رشته‌ای پشتیبانی می‌کند.
function findById(arr, id) {
  return arr.find((item) => String(item.id) === String(id));
}

// ------------------------------------------------------------------
// ساخت اپلیکیشن Express
// ------------------------------------------------------------------
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// سلامت‌سنجی برای Render
app.get("/health", (_req, res) => res.json({ ok: true }));

// ------------------------------------------------------------------
// آپلود تصویر
// ------------------------------------------------------------------
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

// ------------------------------------------------------------------
// فایل‌های آپلودی به‌صورت static
// ------------------------------------------------------------------
app.use("/uploads", express.static(UPLOAD_DIR));

// ------------------------------------------------------------------
// REST API روی مسیر /api
// پشتیبانی از هر کلکشن موجود در db.json.
// کلکشن‌های آرایه‌ای: GET /, GET /:id, POST /, PATCH/PUT /:id, DELETE /:id
// کلکشن‌های شیءای: GET /, PATCH/PUT /
// نکته: باید قبل از مسیرهای SPA ثبت شود.
// ------------------------------------------------------------------
app.get("/api/:name", (req, res, next) => {
  const { name } = req.params;
  const collection = db.data[name];
  if (collection === undefined) return next();

  if (Array.isArray(collection)) {
    // فیلتر بر اساس کوئری‌استرینگ (رفتار json-server)
    const query = { ...req.query };
    const result = Object.keys(query).length
      ? collection.filter((item) => item && typeof item === "object" && matchesQuery(item, query))
      : collection;
    return res.json(result);
  }
  // شیء منفرد (مثل navbar, notFound, admin)
  return res.json(collection);
});

app.get("/api/:name/:id", (req, res, next) => {
  const { name, id } = req.params;
  const collection = db.data[name];
  if (!Array.isArray(collection)) return next();

  const item = findById(collection, id);
  if (!item) return res.status(404).json({ error: "Not Found" });
  return res.json(item);
});

app.post("/api/:name", (req, res, next) => {
  const { name } = req.params;
  const collection = db.data[name];
  if (!Array.isArray(collection)) return next();

  const body = req.body && typeof req.body === "object" ? req.body : {};
  if (!body || Object.keys(body).length === 0) {
    return res.status(400).json({ error: "Body must be a JSON object" });
  }
  // اختصاص id در صورت نبودن
  if (body.id === undefined) {
    const maxId = collection.reduce(
      (max, item) => {
        const n = Number(item?.id);
        return Number.isFinite(n) && n > max ? n : max;
      },
      0,
    );
    body.id = maxId + 1;
  }
  collection.push(body);
  db.write()
    .then(() => res.status(201).json(body))
    .catch((err) => {
      console.error("db.write error (POST):", err);
      res.status(500).json({ error: "خطا در ذخیره‌سازی" });
    });
});

app.patch("/api/:name/:id", handleItemWrite("patch"));
app.put("/api/:name/:id", handleItemWrite("put"));
app.patch("/api/:name", handleSingletonWrite("patch"));
app.put("/api/:name", handleSingletonWrite("put"));

app.delete("/api/:name/:id", (req, res, next) => {
  const { name, id } = req.params;
  const collection = db.data[name];
  if (!Array.isArray(collection)) return next();

  const index = collection.findIndex((item) => String(item?.id) === String(id));
  if (index === -1) return res.status(404).json({ error: "Not Found" });
  const [removed] = collection.splice(index, 1);
  db.write()
    .then(() => res.json(removed))
    .catch((err) => {
      console.error("db.write error (DELETE):", err);
      res.status(500).json({ error: "خطا در حذف" });
    });
});

// ویرایش یک آیتم داخل آرایه با id (PATCH = ادغام، PUT = جایگزینی)
function handleItemWrite(mode) {
  return (req, res, next) => {
    const { name, id } = req.params;
    const collection = db.data[name];
    if (!Array.isArray(collection)) return next();

    const index = collection.findIndex((item) => String(item?.id) === String(id));
    if (index === -1) return res.status(404).json({ error: "Not Found" });

    const body = req.body && typeof req.body === "object" ? req.body : {};
    if (mode === "put") {
      // PUT: کل آیتم را (با حفظ id) جایگزین می‌کند
      collection[index] = { ...body, id: collection[index].id };
    } else {
      // PATCH: ادغام روی آیتم موجود
      collection[index] = { ...collection[index], ...body, id: collection[index].id };
    }
    db.write()
      .then(() => res.json(collection[index]))
      .catch((err) => {
        console.error("db.write error (item write):", err);
        res.status(500).json({ error: "خطا در ذخیره‌سازی" });
      });
  };
}

// ویرایش شیء منفرد (مثل navbar, notFound, admin)
function handleSingletonWrite(mode) {
  return (req, res, next) => {
    const { name } = req.params;
    const current = db.data[name];
    if (current === undefined || Array.isArray(current)) return next();

    const body = req.body && typeof req.body === "object" ? req.body : {};
    db.data[name] = mode === "put" ? body : { ...current, ...body };
    db.write()
      .then(() => res.json(db.data[name]))
      .catch((err) => {
        console.error("db.write error (singleton write):", err);
        res.status(500).json({ error: "خطا در ذخیره‌سازی" });
      });
  };
}

// ------------------------------------------------------------------
// سرو کردن SPA (خروجی vite build در پوشه‌ی dist)
// ------------------------------------------------------------------
const DIST_DIR = join(ROOT, "dist");
app.use(express.static(DIST_DIR));

// fallback برای routing سمت کلاینت (React Router)
app.get(/^\/(?!api|upload|uploads|health).*/, (_req, res) => {
  res.sendFile(join(DIST_DIR, "index.html"));
});

// ------------------------------------------------------------------
// راه‌اندازی
// ------------------------------------------------------------------
db.read()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
      console.log(`  DB file:     ${DB_FILE}`);
      console.log(`  Upload dir:  ${UPLOAD_DIR}`);
      console.log(`  Static dist: ${DIST_DIR}`);
    });
  })
  .catch((err) => {
    console.error("Failed to read db.json:", err);
    process.exit(1);
  });
