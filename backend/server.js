const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const bcrypt = require("bcrypt");
const path = require("path");

console.log("UniKart Backend Server Starting...");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // safer path usage
app.use(express.static(path.join(__dirname, '../frontend')));
// In-memory stores (replace with DB later)
const users = [];

// Preload a test user
(async () => {
  try {
    const hash = await bcrypt.hash("12345", 10);
    users.push({ email: "diyanakhoisnam10@gmail.com", password: hash });
    console.log("Test user loaded.");
  } catch (err) {
    console.error("Error initializing users:", err);
  }
})();

const products = [
  {
    id: 1,
    title: "Software Enginneering",
    price: 450,
    type: "Sell",
    description: "A classic DSA textbook in great condition",
    imageUrl: "image/books/sem4/SE.jpg",
    postedBy: "diyanakhoisnam10@gmail.com",
    category: "Books",
    department: "CSE",
    subject: "DSA"
  },
  {
    id: 2,
    title: "Engineering Drawing Kit",
    price: 100,
    type: "Rent",
    description: "Used for 1 semester, good quality instruments",
    imageUrl: "https://via.placeholder.com/150",
    postedBy: "diyanakhoisnam10@gmail.com",
    category: "Supplies",
    department: "ME",
    subject: "Drawing"
  }
];

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

/* Routes */

// Signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

  const exists = users.find(u => u.email === email);
  if (exists) return res.status(400).json({ error: "User exists" });

  const hash = await bcrypt.hash(password, 10);
  users.push({ email, password: hash });
  res.json({ message: "Signup successful" });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: "No such user" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ error: "Wrong password" });

  res.json({ message: "Login successful" });
});

// Add product
app.post("/add-product", upload.single("image"), (req, res) => {
  const { title, price, type, description, postedBy, category, department, subject } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename} `: "https://via.placeholder.com/150";

  const id = products.length + 1;
  const product = {
    id,
    title,
    price,
    type,
    description,
    imageUrl,
    postedBy,
    category,
    department,
    subject
  };

  products.push(product);
  res.status(201).json({ message: "Product added", product });
});

// Get all products
app.get("/products", (req, res) => res.json(products));

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`✅ Server is running at http://localhost:${port}`);
});