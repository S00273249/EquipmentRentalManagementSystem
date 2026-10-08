import request from "supertest";
import { app } from "../../src/app.js";

// Integration test for the /ping endpoint
describe("GET /ping", () => {
    it("should return hello from Dan", async () => {
        const response = await request(app)
            .get("/ping");

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            message: "hello from Dan"
        });
    });
});