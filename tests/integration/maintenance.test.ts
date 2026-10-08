import request from "supertest";
import { app } from "../../src/app.js";

// Setup Variables
const apiKey = "blahblah";
let equipmentId: string;
let maintenanceId: string;

// Test suite for Maintenance API
describe("Maintenance API", () => {

    // Test that a test equipment is created for maintenance tests
    it("POST /equipment - creates test equipment", async () => {

        const response = await request(app)
            .post("/api/v1/equipment")
            .set("x-api-key", apiKey)
            .send({
                name: "Maintenance Test Equipment",
                category: "Tool",
                description: "Equipment for maintenance integration tests",
                dailyRate: 25,
                status: "Available",
                condition: "Good"
            });

        expect(response.status).toBe(201);

        equipmentId = response.body._id;
    });

    // Test that all maintenance records can be retrieved
    it("GET /maintenance - returns all maintenance records", async () => {

        const response = await request(app)
            .get("/api/v1/maintenance")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);
    });

    // Test that a maintenance record can be created
    it("POST /maintenance - creates a maintenance record", async () => {

        const response = await request(app)
            .post("/api/v1/maintenance")
            .set("x-api-key", apiKey)
            .send({
                equipmentId,
                maintenanceType: "Repair",
                description: "Test maintenance record",
                startDate: "2026-12-01",
                endDate: "2026-12-03",
                cost: 100,
                notes: "Integration test maintenance"
            });

        expect(response.status).toBe(201);

        expect(response.body).toHaveProperty("_id");

        expect(response.body.equipmentId).toBe(equipmentId);
        expect(response.body.maintenanceType).toBe("Repair");
        expect(response.body.cost).toBe(100);

        maintenanceId = response.body._id;
    });

    // Test that invalid maintenance data is rejected
    it("POST /maintenance - rejects invalid maintenance data", async () => {

        const response = await request(app)
            .post("/api/v1/maintenance")
            .set("x-api-key", apiKey)
            .send({
                equipmentId,
                maintenanceType: "",
                description: "",
                startDate: "2026-12-10",
                endDate: "2026-12-05",
                cost: -100,
                notes: ""
            });

        expect(response.status).toBe(400);
    });

    // Test that the created maintenance record can be retrieved
    it("GET /maintenance/:id - returns the maintenance record", async () => {

        const response = await request(app)
            .get(`/api/v1/maintenance/${maintenanceId}`)
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);

        expect(response.body._id).toBe(maintenanceId);
        expect(response.body.equipmentId).toBe(equipmentId);
    });

    // Test that maintenance records can be filtered by equipment ID
    it("GET /maintenance?equipmentId - filters by equipment", async () => {

        const response = await request(app)
            .get(`/api/v1/maintenance?equipmentId=${equipmentId}`)
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);

        response.body.forEach((record: { equipmentId: string }) => {
            expect(record.equipmentId).toBe(equipmentId);
        });
    });

    // Test that a maintenance record is deleted successfully
    it("DELETE /maintenance/:id - deletes the maintenance record", async () => {

        const response = await request(app)
            .delete(`/api/v1/maintenance/${maintenanceId}`)
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);
    });

    // Test that the deleted maintenance record cannot be retrieved
    it("GET /maintenance/:id - returns 404 after deletion", async () => {

        const response = await request(app)
            .get(`/api/v1/maintenance/${maintenanceId}`)
            .set("x-api-key", apiKey);

        expect(response.status).toBe(404);
    });

    // Test that equipment with overlapping maintenance is excluded from available equipment
    it("GET /equipment/available - excludes equipment with overlapping maintenance", async () => {
        // Create equipment
        const equipmentResponse = await request(app)
            .post("/api/v1/equipment")
            .set("x-api-key", apiKey)
            .send({
                name: "Availability Test Equipment",
                category: "Tool",
                description: "Equipment for availability testing",
                dailyRate: 30,
                status: "Available",
                condition: "Good"
            });

        expect(equipmentResponse.status).toBe(201);

        const testEquipmentId = equipmentResponse.body._id;

        // Create overlapping maintenance
        const maintenanceResponse = await request(app)
            .post("/api/v1/maintenance")
            .set("x-api-key", apiKey)
            .send({
                equipmentId: testEquipmentId,
                maintenanceType: "Repair",
                description: "Availability test maintenance",
                startDate: "2026-12-10",
                endDate: "2026-12-15",
                cost: 50,
                notes: "Should make equipment unavailable"
            });

        expect(maintenanceResponse.status).toBe(201);

        // Check availability during maintenance
        const response = await request(app)
            .get("/api/v1/equipment/available?from=2026-12-12&to=2026-12-14")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

        // Get the IDs of all equipment returned by the availability search
        // .map() goes through every item in the array and returns a new array with the _id of each equipment,
        const equipmentIds = response.body.map(
            (equipment: { _id: string }) => equipment._id
        );

        // the ID of the equipment we put into maintenance must not be contained in the list of available equipment.
        expect(equipmentIds).not.toContain(testEquipmentId);
    });

    // Test that non-existent maintenance records return 404
    it("GET /maintenance/:id - returns 404 for non-existent maintenance record", async () => {
        const response = await request(app)
            .get("/api/v1/maintenance/000000000000000000000000")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(404);
    });

    // Test that deleting a non-existent maintenance record returns 404
    it("DELETE /maintenance/:id - returns 404 for non-existent maintenance record", async () => {
        const response = await request(app)
            .delete("/api/v1/maintenance/000000000000000000000000")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(404);
    });

});