import { db } from "../data/users.js";
import { adminOnly, authMiddleware } from "../middleware/auth.middleware.js";
import { image, uploadCSV } from "../middleware/upload.js";
import express from 'express'
import csv from "async-csv"
import { ObjectId } from "mongodb";
const router = express.Router();
router.post("/",authMiddleware,image,async (req, res) => {
    const { category, urgency, message } = req.body;

    if (!category || !urgency || !message) {
      return res.status(400).json({ error: "missing fields" });
    }

    const report = {
      userId: req.user.id,
      category,
      urgency,
      message,
      imagePath: req.file ? req.file.path : null,
      sourceType: "form",
      createdAt: new Date(),
    };
    await db.collection("reports").insertOne(report);

    return res.status(201).json({ report });
  }
);

router.post("/csv",authMiddleware,uploadCSV.single("csvFile"), async (req, res) => {
       if (!req.file) {
          return res.status(400).json({ error: "CSV file required" });
      }
  
      const csvText = req.file.buffer.toString("utf8");
      const data= await csv.parse(csvText);
      
      const headers = data[0];
        if (
          !headers.includes("category") ||
          !headers.includes("urgency") ||
          !headers.includes("message")) 
          {
        return res.status(400).json({ error: "Invalid CSV structure" });}
     
        const documents = data.slice(1).map(row => ({
        userId: req.user.id,
        category: row[headers.indexOf("category")],
        urgency: row[headers.indexOf("urgency")],
        message: row[headers.indexOf("message")],
        imagePath: null,
        sourceType: "csv",
        createdAt: new Date()
        }));
      const result = await db.collection("reports").insertMany(documents);
        const reports = documents.map((doc, idx) => ({
          ...doc,
          _id: result.insertedIds[idx]
        }));  
      return res.status(201).json({
        importedCount: result.insertedCount,
        reports
        });
    });
    router.get("/my",authMiddleware, async (req, res) => {
      try {
        const reports = await db.collection("reports").find({ userId: req.user.id }).sort({ createdAt: -1 }).toArray();
        return res.json(reports);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch reports" });
      }
    });
    
    router.get("/",authMiddleware,adminOnly, async (req, res) => {
      try {
        const { category, urgency,userId } = req.query;

        const filter = {};
        if (userId) filter.userId = userId;
        if (category) filter.category = category;
        if (urgency) filter.urgency = urgency;

        const reports = await db.collection("reports").find(filter).sort({ createdAt: -1 }).toArray();
        return res.json(reports);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch reports" });
      }
    });

  

  router.get("/:id",authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;

      const report = await db.collection("reports").findOne({ _id: new ObjectId(id) });
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }
      if (
        req.user.role === "agent" &&
        report.userId !== req.user.id
        ) {
        return res.status(403).json({ error: "Forbidden" });
      } 

      return res.status(200).json({ report });

    } catch (err) {
      return res.status(500).json({ error: "Server error" });
    }
  });

  
export default router