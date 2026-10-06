import express from "express";
import { connectDB } from "./config/database/database";
import { env } from "./config/.env";
import customerRoutes from "./routes/customers";

const app = express();

app.use(express.json());

// Use the customer routes for handling requests to /api/v1/customers
app.use("/api/v1/customers", customerRoutes);

// Start the server and connect to the database
const startServer = async (): Promise<void> => {
    await connectDB();

    app.listen(env.port, () => {
        console.log(`Server running on port ${env.port}`);
    });
};

startServer();

export default app;