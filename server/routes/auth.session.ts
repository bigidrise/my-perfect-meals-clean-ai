import { Router } from "express";
import { db } from "../db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const router = Router();

/**
 * POST /api/auth/signup
 * Creates a new user account in the database
 */
router.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const [newUser] = await db.insert(users).values({
      email,
      username: email.split("@")[0], // Use email prefix as username
      password: hashedPassword,
    }).returning();

    console.log("✅ Created new user:", newUser.email, "ID:", newUser.id);

    // Return user data (without password)
    res.json({
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Failed to create account" });
  }
});

/**
 * POST /api/auth/login
 * Authenticates user and returns user data
 */
router.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    console.log("✅ User logged in:", user.email, "ID:", user.id);

    // Return user data (without password)
    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

/**
 * GET /api/auth/session
 * Returns { userId } if authenticated, otherwise 401.
 * In development mode, always returns the dev user ID.
 */
router.get("/api/auth/session", (req: any, res) => {
  // In development, always return the default user
  const userId = "00000000-0000-0000-0000-000000000001";
  res.json({ userId });
});

export default router;