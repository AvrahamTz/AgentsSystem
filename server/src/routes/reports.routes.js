import { db } from "../data/users.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload, uploadCSV } from "../middleware/upload.js";
import express from 'express'
import csv from "async-csv"


  
    
     
    

const router = express.Router();
router.post("/",authMiddleware,upload.single("image"),async (req, res) => {
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

    res.status(201).json({ report });
  }
);

router.post("/csv",authMiddleware,uploadCSV.single("csvFile"), async (req, res) => {
       if (!req.file) {
          return res.status(400).json({ error: "CSV file required" });
      }
  
      const csvText = req.file.buffer.toString("utf8");
      const data= await csv.parse(csvText);
      console.log(data);
      
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

  
  
export default router