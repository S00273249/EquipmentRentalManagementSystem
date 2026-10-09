
import mongoose from "mongoose";
import { env } from "./config/.env.js";
import { connectDB } from "./config/database/database.js";
import { CustomerModel } from "./models/customers.js";
import { EquipmentModel } from "./models/equipment.js";
import { BookingModel } from "./models/bookings.js";
import { MaintenanceModel } from "./models/maintenance.js";

// Seed the database with test data
const seedDatabase = async (): Promise<void> => {
    try {
        // Check if the environment is production and prevent seeding
        if (env.nodeEnv === "production") {
            throw new Error("Seeding is disabled in production.");
        }

        // Connect to the database
        await connectDB();

        // Ensure the correct database is being used
        if (mongoose.connection.name !== "equipment_rental") {
            throw new Error(
                `Unexpected database: ${mongoose.connection.name}. ` +
                "Expected equipment_rental. No data was deleted."
            );
        }

        // Clear existing data from the collections
        console.log("Clearing existing test data...");

        await BookingModel.deleteMany({});
        await MaintenanceModel.deleteMany({});
        await EquipmentModel.deleteMany({});
        await CustomerModel.deleteMany({});

        // Customers
        console.log("Creating customers...");

        const customers = await CustomerModel.create([
            {
                name: "Aoife Murphy",
                email: "aoife.murphy@example.com",
                phone: "0871112233",
                address: "Sligo, Ireland"
            },
            {
                name: "Jack Kelly",
                email: "jack.kelly@example.com",
                phone: "0862223344",
                address: "Carrick-on-Shannon, Ireland"
            },
            {
                name: "Sarah Byrne",
                email: "sarah.byrne@example.com",
                phone: "0853334455",
                address: "Galway, Ireland"
            },
            {
                name: "Conor Walsh",
                email: "conor.walsh@example.com",
                phone: "0894445566",
                address: "Dublin, Ireland"
            },
            {
                name: "Emma Gallagher",
                email: "emma.gallagher@example.com",
                phone: "0875556677",
                address: "Letterkenny, Ireland"
            }
        ]);

        // Equipment
        console.log("Creating equipment...");

        const equipment = await EquipmentModel.create([
            {
                name: "Canon EOS R6 Camera",
                category: "Camera",
                description: "Full-frame mirrorless camera for photography and video.",
                dailyRate: 80,
                status: "Available",
                condition: "Excellent"
            },
            {
                name: "Sony A7 III Camera",
                category: "Camera",
                description: "Full-frame camera suitable for events and commercial shoots.",
                dailyRate: 65,
                status: "Available",
                condition: "Good"
            },
            {
                name: "Rode NT1 Microphone Kit",
                category: "Audio",
                description: "Studio microphone kit for voice recording and podcasts.",
                dailyRate: 25,
                status: "Available",
                condition: "Excellent"
            },
            {
                name: "Zoom H6 Audio Recorder",
                category: "Audio",
                description: "Portable multi-track recorder for field recording.",
                dailyRate: 30,
                status: "Maintenance",
                condition: "Fair"
            },
            {
                name: "Godox SL60W Light",
                category: "Lighting",
                description: "Continuous LED light for photography and video production.",
                dailyRate: 20,
                status: "Available",
                condition: "Good"
            },
            {
                name: "LED Softbox Lighting Kit",
                category: "Lighting",
                description: "Two-light softbox kit for interviews and studio work.",
                dailyRate: 35,
                status: "Available",
                condition: "Excellent"
            },
            {
                name: "Dell Latitude Laptop",
                category: "Computer",
                description: "Business laptop for editing, presentations and general work.",
                dailyRate: 45,
                status: "Available",
                condition: "Good"
            },
            {
                name: "Bosch Professional Drill",
                category: "Tool",
                description: "Cordless drill supplied with battery and charger.",
                dailyRate: 15,
                status: "Available",
                condition: "Fair"
            },
            {
                name: "Portable Projector",
                category: "Other",
                description: "Portable projector for presentations and events.",
                dailyRate: 40,
                status: "Retired",
                condition: "Poor"
            }
        ]);

        // Bookings
        // Convert generated MongoDB IDs to strings to match IBooking.
        console.log("Creating bookings...");

        const bookings = await BookingModel.create([
            {
                customerId: customers[0]._id.toString(),
                equipmentId: equipment[0]._id.toString(),
                startDate: new Date("2026-10-01"),
                endDate: new Date("2026-10-03"),
                status: "Completed",
                dailyRate: 80,
                totalCost: 160
            },
            {
                customerId: customers[1]._id.toString(),
                equipmentId: equipment[2]._id.toString(),
                startDate: new Date("2026-10-20"),
                endDate: new Date("2026-10-22"),
                status: "Confirmed",
                dailyRate: 25,
                totalCost: 50
            },
            {
                customerId: customers[2]._id.toString(),
                equipmentId: equipment[4]._id.toString(),
                startDate: new Date("2026-10-09"),
                endDate: new Date("2026-10-11"),
                status: "Active",
                dailyRate: 20,
                totalCost: 40
            },
            {
                customerId: customers[3]._id.toString(),
                equipmentId: equipment[6]._id.toString(),
                startDate: new Date("2026-11-02"),
                endDate: new Date("2026-11-05"),
                status: "Pending",
                dailyRate: 45,
                totalCost: 135
            },
            {
                customerId: customers[4]._id.toString(),
                equipmentId: equipment[7]._id.toString(),
                startDate: new Date("2026-11-10"),
                endDate: new Date("2026-11-12"),
                status: "Cancelled",
                dailyRate: 15,
                totalCost: 30
            }
        ]);

        // Maintenance records
        // Convert generated MongoDB IDs to strings to match IMaintenanceRecord.
        console.log("Creating maintenance records...");

        const maintenanceRecords = await MaintenanceModel.create([
            {
                equipmentId: equipment[3]._id.toString(),
                maintenanceType: "Repair",
                description: "Investigate intermittent recording issue.",
                startDate: new Date("2026-10-08"),
                endDate: new Date("2026-10-12"),
                cost: 75,
                notes: "Awaiting inspection and testing."
            },
            {
                equipmentId: equipment[5]._id.toString(),
                maintenanceType: "Inspection",
                description: "Routine inspection of lighting equipment.",
                startDate: new Date("2026-10-15"),
                endDate: new Date("2026-10-15"),
                cost: 20,
                notes: "Check cables, power supply and light output."
            },
            {
                equipmentId: equipment[8]._id.toString(),
                maintenanceType: "Retirement",
                description: "Equipment removed from the rental inventory.",
                startDate: new Date("2026-09-01"),
                endDate: new Date("2026-09-01"),
                cost: 0,
                notes: "Old equipment retained for historical records."
            }
        ]);

        // Log the results of the seeding process
        console.log("\nDatabase seeding completed.");
        console.log(`Customers: ${customers.length}`);
        console.log(`Equipment: ${equipment.length}`);
        console.log(`Bookings: ${bookings.length}`);
        console.log(`Maintenance records: ${maintenanceRecords.length}`);
    } catch (error) {
        // Log any errors that occur during the seeding process 
        // and set the exit code to indicate failure
        console.error("Database seeding failed:", error);
        process.exitCode = 1;
    } finally {
        // Disconnect from the database after seeding is complete
        await mongoose.disconnect();
    }
};

seedDatabase();
