import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import reportRoutes from "./routes/report.routes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/reports", reportRoutes);

sequelize.authenticate().then(() => console.log("✅ Database connected"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
