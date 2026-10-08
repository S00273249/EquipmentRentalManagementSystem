import { connectDB, disconnectDB } from "../src/config/database/database.js";

// Run once before all tests
beforeAll(async () => {
    console.log('Run once before tests');
   await connectDB();
});

// Run once after all tests
afterAll(async () => {
    console.log('Run once after tests');
   await disconnectDB();
});

