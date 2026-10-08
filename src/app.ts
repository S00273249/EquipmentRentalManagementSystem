import express from "express";
import customerRoutes from "./routes/customers";
import equipmentRoutes from "./routes/equipment.js";
import bookingRoutes from "./routes/bookings.js";
import maintenanceRoutes from "./routes/maintenance.js";
import { swaggerSpec } from './config/swagger.js';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define a simple ping endpoint for health checks
app.get("/ping", (_req, res) => {
    res.status(200).json({
        message: "hello from Dan"
    });
});

// Define routes for different resources
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/equipment", equipmentRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/maintenance", maintenanceRoutes);

export { app };