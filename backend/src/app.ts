import "dotenv/config";
import express from "express";
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

app.get("/", (req, res) => {
  res.json({ message: "OmniFlow POS server is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/menu", menuRoutes);
app.use("/api/outlets", outletRoutes);
app.use("/api/outlets/:outletId/inventory", inventoryRoutes);
app.use("/api/outlets/:outletId/sales", salesRoutes);
app.use("/api/reports", reportsRoutes);

app.use(errorHandler);

export default app;
