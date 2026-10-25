import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Mock user data — no database required
const mockUser = {
  id: 1,
  name: "Nova User",
  email: "user@example.com",
  password: "Nova123"
};

// Test API connection
app.get("/", (req, res) => {
  res.json({ message: "NovaAuth API is running!" });
});

// Login API
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Check empty fields
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required."
    });
  }

  // Check credentials
  if (
    email.toLowerCase() !== mockUser.email.toLowerCase() ||
    password !== mockUser.password
  ) {
    return res.status(401).json({
      message: "Invalid email or password."
    });
  }

  // Successful login
  return res.status(200).json({
    message: "Login successful!",
    user: {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`NovaAuth backend running at http://localhost:${PORT}`);
});