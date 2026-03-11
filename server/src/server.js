import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js"
import { setServers } from 'node:dns/promises';
import reportsRoute from "./routes/reports.routes.js"
setServers(['0.0.0.0', '1.1.1.1']);
const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/reports",reportsRoute)
app.use("/uploads", express.static("uploads"));
app.listen(3000, () => {
  console.log("Server running on port 3000");
});