
import request from "supertest";
import { app } from "../../src/app.js";

// Setup Variables
const apiKey = "blahblah";
let equipmentId: string;

// Test suite for Equipment API
describe("Equipment API", () => {

    // Test that all equipment can be retrieved
    it("GET /equipment - returns all equipment", async () => {

        const response = await request(app)
            .get("/api/v1/equipment")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);
    });

    // Test that new equipment can be created
    it("POST /equipment - creates equipment", async () => {

        const response = await request(app)
            .post("/api/v1/equipment")
            .set("x-api-key", apiKey)
            .send({
                name: "Test Camera",
                category: "Camera",
                description: "Test camera for integration testing",
                dailyRate: 50,
                status: "Available",
                condition: "Good"
            });

        expect(response.status).toBe(201);

        expect(response.body).toHaveProperty("_id");

        equipmentId = response.body._id;
    });

    // Test that the equipment data is validated
    it("POST /equipment - rejects invalid equipment data", async () => {

        const response = await request(app)
            .post("/api/v1/equipment")
            .set("x-api-key", apiKey)
            .send({
                name: "",
                category: "",
                description: "",
                dailyRate: -10,
                status: "",
                condition: ""
            });

        expect(response.status).toBe(400);
    });

    // Test that the created equipment can be retrieved
    it("GET /equipment/:id - returns the created equipment", async () => {

        const response = await request(app)
            .get(`/api/v1/equipment/${equipmentId}`)
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);

        expect(response.body._id).toBe(equipmentId);
        expect(response.body.name).toBe("Test Camera");
        expect(response.body.dailyRate).toBe(50);
    });

    it("PUT /equipment/:id - updates the equipment", async () => {

        const response = await request(app)
            .put(`/api/v1/equipment/${equipmentId}`)
            .set("x-api-key", apiKey)
            .send({
                name: "Updated Camera",
                category: "Camera",
                description: "Updated test camera",
                dailyRate: 60,
                status: "Available",
                condition: "Excellent"
            });

        expect(response.status).toBe(200);

        expect(response.body.name).toBe("Updated Camera");
        expect(response.body.dailyRate).toBe(60);
        expect(response.body.condition).toBe("Excellent");
    });

    // Test that the equipment is deleted
    it("DELETE /equipment/:id - deletes the equipment", async () => {

        const response = await request(app)
            .delete(`/api/v1/equipment/${equipmentId}`)
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);
    });

    // Test that the deleted equipment cannot be retrieved
    it("GET /equipment/:id - returns 404 after deletion", async () => {

        const response = await request(app)
            .get(`/api/v1/equipment/${equipmentId}`)
            .set("x-api-key", apiKey);

        expect(response.status).toBe(404);
    });

    // Test that equipment can be filtered by category
    it("GET /equipment?category=Camera - filters by category", async () => {

        const response = await request(app)
            .get("/api/v1/equipment?category=Camera")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);

        response.body.forEach((equipment: { category: string }) => {
            expect(equipment.category).toBe("Camera");
        });
    });

    // Test that equipment can be filtered by status
    it("GET /equipment?status=Available - filters by status", async () => {

        const response = await request(app)
            .get("/api/v1/equipment?status=Available")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);

        response.body.forEach((equipment: { status: string }) => {
            expect(equipment.status).toBe("Available");
        });
    });

    // Test that equipment can be filtered by condition
    it("GET /equipment?condition=Good - filters by condition", async () => {

        const response = await request(app)
            .get("/api/v1/equipment?condition=Good")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);

        response.body.forEach((equipment: { condition: string }) => {
            expect(equipment.condition).toBe("Good");
        });
    });

    // Test that equipment can be sorted by daily rate
    it("GET /equipment?sort=dailyRate - sorts by daily rate", async () => {

        const response = await request(app)
            .get("/api/v1/equipment?sort=dailyRate")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);

        for (let i = 1; i < response.body.length; i++) {
            expect(response.body[i].dailyRate)
                .toBeGreaterThanOrEqual(response.body[i - 1].dailyRate);
        }
    });

    // Test that available equipment can be retrieved for a given date range
    it("GET /equipment?from&to - returns available equipment", async () => {

        const response = await request(app)
            .get("/api/v1/equipment?from=2026-12-10&to=2026-12-15")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);

        response.body.forEach((equipment: { status: string }) => {
            expect(equipment.status).not.toBe("Retired");
        });
    });

    // Test that equipment can be filtered by category and date availability
    it("GET /equipment?category&from&to - filters available equipment by category", async () => {

        const response = await request(app)
            .get("/api/v1/equipment?category=Camera&from=2026-12-10&to=2026-12-15")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);

        response.body.forEach((equipment: { category: string; status: string }) => {
            expect(equipment.category).toBe("Camera");
            expect(equipment.status).not.toBe("Retired");
        });
    });

    // Test that an incomplete date range is rejected
    it("GET /equipment?from - rejects an incomplete date range", async () => {

        const response = await request(app)
            .get("/api/v1/equipment?from=2026-12-10")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(400);
    });

    // Test that an invalid date range is rejected
    it("GET /equipment?from&to - rejects an invalid date range", async () => {

        const response = await request(app)
            .get("/api/v1/equipment?from=2026-12-20&to=2026-12-10")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(400);
    });

    // Test that retrieving a non-existent equipment returns 404
    it("GET /equipment/:id - returns 404 for non-existent equipment", async () => {
        const response = await request(app)
            .get("/api/v1/equipment/000000000000000000000000")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(404);
    });

    // Test that updating a non-existent equipment returns 404
    it("DELETE /equipment/:id - returns 404 for non-existent equipment", async () => {
        const response = await request(app)
            .delete("/api/v1/equipment/000000000000000000000000")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(404);
    });

});
