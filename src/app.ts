import express, {Application, Request, Response} from "express";
import { connectDB } from "./config/database/database";
import { env } from "./config/.env";

const app = express();

app.use(express.json());

// Start the server and connect to the database
const startServer = async (): Promise<void> => { 
    await connectDB();

    app.listen(env.port, () => {
        console.log(`Server running on port ${env.port}`);
    });
};

startServer();

export default app;