import { app } from './app.js';
import { env } from './config/.env.js';
import { connectDB } from './config/database/database.js';

const port = env.port;

// Start the server after establishing a database connection
const startServer = async (): Promise<void> => {
    await connectDB();

    app.listen(port, (error) => {
        if (error) {
            if (error instanceof Error) {
                console.error("Error starting server:", error.message);
            } else {
                console.error("Error starting server:", error);
            }
        } else {
            console.log(`Server running on port ${port}`);
        }
    });
};

startServer();