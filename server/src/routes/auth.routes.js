import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware} from "../middleware/auth.middleware.js";
import { db } from "../data/users.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { agentCode, password } = req.body;

  if (!agentCode || !password) {
    return res.status(400).json({ message: "agentCode and password required" });
  }

  const user = await db.collection("agents").findOne({agentCode:agentCode})

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    "SECRET_KEY",
    { expiresIn: "1d" }
  );

  res.json({
    token,
    user: {
      id: user._id,
      agentCode: user.agentCode,
      fullName: user.fullName,
      role: user.role
    }
  });
});

router.get("/me", authMiddleware, (req, res) => {
  return res.json({ user: req.user });
});

export default router;