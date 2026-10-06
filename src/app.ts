import express from "express";
import { connectDB } from "./config/database/database";
import { env } from "./config/.env";
import customerRoutes from "./routes/customers";
import equipmentRoutes from "./routes/equipment.js";

const app = express();

app.use(express.json());

// Define routes for customers and equipment
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/equipment", equipmentRoutes);

// Start the server and connect to the database
const startServer = async (): Promise<void> => {
    await connectDB();

    app.listen(env.port, () => {
        console.log(`Server running on port ${env.port}`);
    });
};

startServer();

export default app;