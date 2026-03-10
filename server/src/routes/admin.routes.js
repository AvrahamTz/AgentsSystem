import { db } from "../data/users.js";
import { adminOnly, authMiddleware } from "../middleware/auth.middleware.js";
import bcrypt from 'bcrypt'
import express from "express"
import {atbashCipher} from "../utils/service.js"
const router = express.Router();
router.post("/users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { agentCode, fullName, role, password } = req.body;

    if (!agentCode || !fullName || !role || !["admin", "agent"].includes(role)) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    const existing = await db.collection("agents").findOne({ agentCode });
    if (existing) {
      return res.status(409).json({ message: "Agent code already exists" });
    }

    const initialPassword = password || atbashCipher(fullName);
    const passwordHash = await bcrypt.hash(initialPassword, 10);

    const result = await db.collection("agents").insertOne({
      agentCode,
      fullName,
      role,
      passwordHash,
      createdAt:new Date()
    });

    res.status(201).json({
      user: {
        id: result.insertedId,
        agentCode,
        fullName,
        role,
        initialPasswordHint: initialPassword.slice(0, 3) + "***"
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/users", authMiddleware, adminOnly, async (req, res) => {
   try {
     const agents = await db.collection("agents").find().toArray()
     
     
     res.send({user:agents})
 
   } catch (err) {
     console.error(err);
    res.status(500).json({ message: "Server error" });
    
   }
})

export default router