import request from "supertest";
import { app } from "../../src/app.js";

// Setup Variables
const apiKey = "blahblah";
let customerId: string;

// Test suite for Customer API
describe("Customer API", () => {

    // Test that all customers can be retrieved
    it("GET /customers - returns all customers", async () => {

        const response = await request(app)
            .get("/api/v1/customers")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);
    });

    // Test that a new customer can be created
    it("POST /customers - creates a customer", async () => {

        const response = await request(app)
            .post("/api/v1/customers")
            .set("x-api-key", apiKey)
            .send({
                name: "Test Customer",
                email: "testcustomer@example.com",
                phone: "0871234567",
                address: "Sligo, Ireland"
            });

        expect(response.status).toBe(201);

        expect(response.body).toHaveProperty("_id");

        customerId = response.body._id;
    });

    // Test that the customer data is validated
    it("POST /customers - rejects invalid customer data", async () => {

        const response = await request(app)
            .post("/api/v1/customers")
            .set("x-api-key", apiKey)
            .send({
                name: "",
                email: "not-an-email",
                phone: "",
                address: ""
            });

        expect(response.status).toBe(400);
    });

    // Test that the created customer can be retrieved
    it("GET /customers/:id - returns the created customer", async () => {

        const response = await request(app)
            .get(`/api/v1/customers/${customerId}`)
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);

        expect(response.body._id).toBe(customerId);
        expect(response.body.name).toBe("Test Customer");
        expect(response.body.email).toBe("testcustomer@example.com");
    });

    // Test that the customer is updated
    it("PUT /customers/:id - updates the customer", async () => {

        const response = await request(app)
            .put(`/api/v1/customers/${customerId}`)
            .set("x-api-key", apiKey)
            .send({
                name: "Updated Customer",
                email: "updated@example.com",
                phone: "0877654321",
                address: "Carrick-on-Shannon, Ireland"
            });

        expect(response.status).toBe(200);

        expect(response.body.name).toBe("Updated Customer");
        expect(response.body.email).toBe("updated@example.com");
    });

    // Test that the customer is deleted
    it("DELETE /customers/:id - deletes the customer", async () => {

        const response = await request(app)
            .delete(`/api/v1/customers/${customerId}`)
            .set("x-api-key", apiKey);

        expect(response.status).toBe(200);
    });

    // Test that the deleted customer cannot be retrieved
    it("GET /customers/:id - returns 404 after deletion", async () => {

        const response = await request(app)
            .get(`/api/v1/customers/${customerId}`)
            .set("x-api-key", apiKey);

        expect(response.status).toBe(404);
    });

    // Test that retrieving a non-existent customer returns 404
    it("GET /customers/:id - returns 404 for non-existent customer", async () => {
        const response = await request(app)
            .get("/api/v1/customers/000000000000000000000000")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(404);
    });

    // Test that deleting a non-existent customer returns 404
    it("DELETE /customers/:id - returns 404 for non-existent customer", async () => {
        const response = await request(app)
            .delete("/api/v1/customers/000000000000000000000000")
            .set("x-api-key", apiKey);

        expect(response.status).toBe(404);
    });

});