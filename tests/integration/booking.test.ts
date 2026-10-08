import request from "supertest";
import { app } from "../../src/app.js";

// Setup Variables
const apiKey = "blahblah";
let customerId: string;
let equipmentId: string;
let bookingId: string;

// Test suite for Booking API
describe("Booking API", () => {

    // Test that a test customer and test equipment are created for booking tests
    it("POST /customers - creates a test customer", async () => {

        const response = await request(app)
            .post("/api/v1/customers")
            .set("x-api-key", apiKey)
            .send({
                name: "Booking Test Customer",
                email: "bookingtest@example.com",
                phone: "0871111111",
                address: "Sligo, Ireland"
            });

        expect(response.status).toBe(201);

        customerId = response.body._id;
    });

    // Test that a test equipment is created for booking tests
    it("POST /equipment - creates test equipment", async () => {

        const response = await request(app)
            .post("/api/v1/equipment")
            .set("x-api-key", apiKey)
            .send({
                name: "Booking Test Camera",
                category: "Camera",
                description: "Camera for booking integration tests",
                dailyRate: 50,
                status: "Available",
                condition: "Good"
            });

        expect(response.status).toBe(201);

        equipmentId = response.body._id;
    });

    // Test that a booking can be created
    it("POST /bookings - creates a booking", async () => {

        const response = await request(app)
            .post("/api/v1/bookings")
            .set("x-api-key", apiKey)
            .send({
                customerId,
                equipmentId,
                startDate: "2026-11-01",
                endDate: "2026-11-05",
                status: "Confirmed"
            });

        expect(response.status).toBe(201);

        expect(response.body).toHaveProperty("_id");

        expect(response.body.customerId).toBe(customerId);
        expect(response.body.equipmentId).toBe(equipmentId);

        expect(response.body.dailyRate).toBe(50);
        expect(response.body.totalCost).toBe(200);

        bookingId = response.body._id;
    });

    // Test that the created booking can be retrieved
    it("GET /bookings/:id - returns the booking", async () => {

        const response = await request(app)
            .get(`/api/v1/bookings/${bookingId}`)
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);

        expect(response.body._id).toBe(bookingId);
    });

    // Test that all bookings can be retrieved
    it("GET /bookings - returns all bookings", async () => {

        const response = await request(app)
            .get("/api/v1/bookings")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);
    });

    // Test that overlapping bookings are rejected
    it("POST /bookings - rejects overlapping booking", async () => {

        const response = await request(app)
            .post("/api/v1/bookings")
            .set("x-api-key", apiKey)
            .send({
                customerId,
                equipmentId,
                startDate: "2026-11-03",
                endDate: "2026-11-07",
                status: "Confirmed"
            });

        expect(response.status).toBe(400);
    });

    // Test that invalid date ranges are rejected
    it("POST /bookings - rejects invalid date range", async () => {

        const response = await request(app)
            .post("/api/v1/bookings")
            .set("x-api-key", apiKey)
            .send({
                customerId,
                equipmentId,
                startDate: "2026-11-10",
                endDate: "2026-11-05",
                status: "Confirmed"
            });

        expect(response.status).toBe(400);
    });

    // Test that non-existent customers are rejected
    it("POST /bookings - rejects non-existent customer", async () => {

        const response = await request(app)
            .post("/api/v1/bookings")
            .set("x-api-key", apiKey)
            .send({
                customerId: "000000000000000000000000",
                equipmentId,
                startDate: "2026-12-01",
                endDate: "2026-12-05",
                status: "Confirmed"
            });

        expect(response.status).toBe(400);
    });

    // Test that non-existent equipment are rejected
    it("POST /bookings - rejects non-existent equipment", async () => {

        const response = await request(app)
            .post("/api/v1/bookings")
            .set("x-api-key", apiKey)
            .send({
                customerId,
                equipmentId: "000000000000000000000000",
                startDate: "2026-12-01",
                endDate: "2026-12-05",
                status: "Confirmed"
            });

        expect(response.status).toBe(400);
    });

    // Test that bookings can be filtered by customer
    it("GET /bookings?customerId - filters by customer", async () => {

        const response = await request(app)
            .get(`/api/v1/bookings?customerId=${customerId}`)
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);

        response.body.forEach((booking: { customerId: string }) => {
            expect(booking.customerId).toBe(customerId);
        });
    });

    // Test that bookings can be filtered by equipment
    it("GET /bookings?equipmentId - filters by equipment", async () => {

        const response = await request(app)
            .get(`/api/v1/bookings?equipmentId=${equipmentId}`)
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);

        response.body.forEach((booking: { equipmentId: string }) => {
            expect(booking.equipmentId).toBe(equipmentId);
        });
    });

    // Test that bookings can be filtered by status
    it("GET /bookings?status - filters by booking status", async () => {

        const response = await request(app)
            .get("/api/v1/bookings?status=Confirmed")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);

        expect(Array.isArray(response.body)).toBe(true);

        response.body.forEach((booking: { status: string }) => {
            expect(booking.status).toBe("Confirmed");
        });
    });

    // Test that retrieving a non-existent booking returns 404
    it("GET /bookings/:id - returns 404 for non-existent booking", async () => {
        const response = await request(app)
            .get("/api/v1/bookings/000000000000000000000000")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(404);
    });

    // Test that deleting a non-existent booking returns 404
    it("DELETE /bookings/:id - returns 404 for non-existent booking", async () => {
        const response = await request(app)
            .delete("/api/v1/bookings/000000000000000000000000")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(404);
    });

});