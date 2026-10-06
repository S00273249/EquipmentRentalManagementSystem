import express from "express";
import { connectDB } from "./config/database/database";
import { env } from "./config/.env";
import customerRoutes from "./routes/customers";
import equipmentRoutes from "./routes/equipment.js";
import bookingRoutes from "./routes/bookings.js";

const app = express();

app.use(express.json());

// Define routes for different resources
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/equipment", equipmentRoutes);
app.use("/api/v1/bookings", bookingRoutes);

// Start the server and connect to the database
const startServer = async (): Promise<void> => {
    await connectDB();

    app.listen(env.port, () => {
        console.log(`Server running on port ${env.port}`);
    });
};

startServer();

export default app;