
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* =========================
   FILE UPLOAD CONFIGURATION
========================= */

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    callback(
      null,
      `${Date.now()}-${crypto.randomUUID()}${extension}`
    );
  },
});

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "text/plain",
  "application/pdf",
];

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error(
          "Only JPG, PNG, WEBP, GIF, MP4, WEBM, TXT, and PDF files are allowed."
        )
      );
    }

    callback(null, true);
  },
});

/* =========================
   MYSQL CONNECTION
========================= */

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/* =========================
   AUTHENTICATION MIDDLEWARE
========================= */

function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization || "";

  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please log in first.",
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "Your login session is invalid or expired. Please log in again.",
    });
  }
}

/* =========================
   HOME ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("CreatorSphere AI Backend is running!");
});

/* =========================
   DATABASE HEALTH CHECK
========================= */

app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT DATABASE() AS databaseName"
    );

    res.json({
      success: true,
      message: "Backend connected to MySQL successfully!",
      database: rows[0].databaseName,
    });
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(500).json({
      success: false,
      message:
        "Database connection failed. Check your .env settings.",
    });
  }
});

/* =========================
   REGISTER
========================= */

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    if (
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      !name.trim() ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid name and email.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const allowedRoles = ["user", "creator"];
    const selectedRole = allowedRoles.includes(role)
      ? role
      : "user";

    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await pool.execute(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [
        name.trim(),
        normalizedEmail,
        hashedPassword,
        selectedRole,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Registration successful!",
      user: {
        id: result.insertId,
        name: name.trim(),
        email: normalizedEmail,
        role: selectedRole,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
});

/* =========================
   LOGIN
========================= */

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [users] = await pool.execute(
      `SELECT id, name, email, password, role
       FROM users
       WHERE email = ?`,
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = users[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
});

/* =========================
   GET MARKETPLACE PRODUCTS
========================= */

app.get("/api/products", async (req, res) => {
  try {
    const [products] = await pool.execute(
      `SELECT
         m.id,
         m.creator_id AS creatorId,
         m.title AS name,
         m.description,
         m.category,
         m.price,
         m.image_url AS image,
         CASE
           WHEN m.media_type IN ('pdf', 'text', 'file')
             THEN 'document'
           ELSE m.media_type
         END AS mediaType,
         m.file_name AS fileName,
         u.name AS seller,
         m.created_at AS createdAt
       FROM marketplace_items m
       JOIN users u ON u.id = m.creator_id
       ORDER BY m.created_at DESC`
    );

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not load marketplace products.",
    });
  }
});

/* =========================
   ADD MARKETPLACE PRODUCT
========================= */

app.post(
  "/api/products",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    try {
      const { name, category, price, description } = req.body;

      if (
        !name?.trim() ||
        !category?.trim() ||
        price === undefined ||
        price === "" ||
        !description?.trim() ||
        !req.file
      ) {
        if (req.file) {
          fs.unlink(req.file.path, () => {});
        }

        return res.status(400).json({
          success: false,
          message:
            "Title, category, price, description, and file are required.",
        });
      }

      const numericPrice = Number(price);

      if (
        !Number.isFinite(numericPrice) ||
        numericPrice < 0 ||
        numericPrice > 1000000
      ) {
        fs.unlink(req.file.path, () => {});

        return res.status(400).json({
          success: false,
          message: "Enter a valid price between 0 and 1000000.",
        });
      }

      const allowedCategories = [
        "AI Images",
        "Videos",
        "Articles",
        "Captions",
        "Templates",
        "Digital Art",
        "Other",
      ];

      if (!allowedCategories.includes(category)) {
        fs.unlink(req.file.path, () => {});

        return res.status(400).json({
          success: false,
          message: "Please select a valid product category.",
        });
      }

      let mediaType = "document";

      if (req.file.mimetype.startsWith("image/")) {
        mediaType = "image";
      } else if (req.file.mimetype.startsWith("video/")) {
        mediaType = "video";
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      const [result] = await pool.execute(
        `INSERT INTO marketplace_items
         (creator_id, title, description, category, price,
          image_url, media_type, file_name)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          name.trim(),
          description.trim(),
          category,
          numericPrice,
          imageUrl,
          mediaType,
          req.file.originalname,
        ]
      );

      res.status(201).json({
        success: true,
        message: "Product published successfully!",
        product: {
          id: result.insertId,
          creatorId: req.user.id,
          name: name.trim(),
          description: description.trim(),
          category,
          price: numericPrice,
          image: imageUrl,
          mediaType,
          fileName: req.file.originalname,
        },
      });
    } catch (error) {
      console.error("Add product error:", error.message);

      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }

      res.status(500).json({
        success: false,
        message: "Could not publish product.",
      });
    }
  }
);

/* =========================
   DELETE MARKETPLACE PRODUCT
========================= */

app.delete(
  "/api/products/:id",
  authenticateToken,
  async (req, res) => {
    try {
      const productId = Number(req.params.id);

      if (
        !Number.isSafeInteger(productId) ||
        productId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID.",
        });
      }

      const [products] = await pool.execute(
        `SELECT id, creator_id, image_url
         FROM marketplace_items
         WHERE id = ?`,
        [productId]
      );

      if (products.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      const product = products[0];

      if (
        Number(product.creator_id) !== Number(req.user.id) &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own products.",
        });
      }

      await pool.execute(
        "DELETE FROM marketplace_items WHERE id = ?",
        [productId]
      );

      if (product.image_url?.startsWith("/uploads/")) {
        const filename = path.basename(product.image_url);
        const filePath = path.join(uploadDir, filename);

        fs.unlink(filePath, (error) => {
          if (error && error.code !== "ENOENT") {
            console.error(
              "Uploaded file cleanup error:",
              error.message
            );
          }
        });
      }

      res.json({
        success: true,
        message: "Product deleted successfully.",
      });
    } catch (error) {
      console.error("Delete product error:", error.message);

      res.status(500).json({
        success: false,
        message: "Could not delete product.",
      });
    }
  }
);

/* =========================
   CREATE MARKETPLACE ORDER
   INITIAL STATUS: PENDING
========================= */

app.post("/api/orders", authenticateToken, async (req, res) => {
  try {
    const productId = Number(req.body?.productId);

    if (
      !Number.isSafeInteger(productId) ||
      productId < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid product ID.",
      });
    }

    const [products] = await pool.execute(
      `SELECT id, price
       FROM marketplace_items
       WHERE id = ?
       LIMIT 1`,
      [productId]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const product = products[0];

    const [result] = await pool.execute(
      `INSERT INTO orders
         (user_id, item_id, amount, payment_status)
       VALUES (?, ?, ?, 'pending')`,
      [req.user.id, product.id, product.price]
    );

    return res.status(201).json({
      success: true,
      message: "Order created. Payment is pending.",
      order: {
        id: result.insertId,
        productId: product.id,
        amount: Number(product.price),
        paymentStatus: "pending",
      },
    });
  } catch (error) {
    console.error("Create order error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Could not create order.",
    });
  }
});

/* =========================
   DEMO PAYMENT ONLY
   NEVER USE IN PRODUCTION
========================= */

app.post(
  "/api/orders/:id/demo-pay",
  authenticateToken,
  async (req, res) => {
    try {
      // This endpoint is only for a local project demonstration.
      if (
        process.env.NODE_ENV === "production" ||
        process.env.DEMO_PAYMENTS !== "true"
      ) {
        return res.status(403).json({
          success: false,
          message: "Demo payments are disabled.",
        });
      }

      const orderId = Number(req.params.id);

      if (
        !Number.isSafeInteger(orderId) ||
        orderId < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID.",
        });
      }

      const [orders] = await pool.execute(
        `SELECT id, user_id, payment_status
         FROM orders
         WHERE id = ?
         LIMIT 1`,
        [orderId]
      );

      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      const order = orders[0];

      if (Number(order.user_id) !== Number(req.user.id)) {
        return res.status(403).json({
          success: false,
          message: "You cannot update this order.",
        });
      }

      if (order.payment_status === "paid") {
        return res.json({
          success: true,
          message: "This order is already marked paid.",
          paymentStatus: "paid",
          demo: true,
        });
      }

      if (order.payment_status !== "pending") {
        return res.status(409).json({
          success: false,
          message: "This order cannot be paid in its current state.",
        });
      }

      const [updateResult] = await pool.execute(
        `UPDATE orders
         SET payment_status = 'paid'
         WHERE id = ? AND user_id = ?
           AND payment_status = 'pending'`,
        [orderId, req.user.id]
      );

      if (updateResult.affectedRows !== 1) {
        return res.status(409).json({
          success: false,
          message:
            "The order status changed. Please refresh and try again.",
        });
      }

      return res.json({
        success: true,
        message: "Demo payment simulated successfully.",
        paymentStatus: "paid",
        demo: true,
      });
    } catch (error) {
      console.error("Demo payment error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Could not complete demo payment.",
      });
    }
  }
);

/* =========================
   FILE UPLOAD ERROR HANDLER
========================= */

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const message =
    error.code === "LIMIT_FILE_SIZE"
      ? "The file must be smaller than 2 MB."
      : error.message || "File upload failed.";

  res.status(400).json({
    success: false,
    message,
  });
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
