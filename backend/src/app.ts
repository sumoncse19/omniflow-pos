import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import menuRoutes from "./routes/menu.routes";
import outletRoutes from "./routes/outlet.routes";
import inventoryRoutes from "./routes/inventory.routes";
import salesRoutes from "./routes/sales.routes";
import reportsRoutes from "./routes/reports.routes";
import { errorHandler } from "./middleware/errors";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/menu", menuRoutes);
app.use("/api/outlets", outletRoutes);
app.use("/api/outlets/:outletId/inventory", inventoryRoutes);
app.use("/api/outlets/:outletId/sales", salesRoutes);
app.use("/api/reports", reportsRoutes);

app.use(errorHandler);

// Serve frontend in production
const clientPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(clientPath));
app.get("/{*path}", (_req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

export default app;
