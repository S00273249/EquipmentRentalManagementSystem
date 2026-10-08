import { createCustomerZSchema } from "../../src/models/customers.js";

// Sample valid customer data for testing
const validCustomer = {
    name: "Dan",
    email: "dan@example.com",
    phone: "0871234567",
    address: "Sligo, Ireland"
};

// Test suite for validating customer data using Zod schema
describe("Test Customer Validation", () => {

    // Test case for valid customer data
    it("should pass for valid customer data", () => {
        expect(() => createCustomerZSchema.parse(
            validCustomer
        )).not.toThrow();
    });

    // Test case for missing name
    it("should fail when the name is missing", () => {
        expect(() => createCustomerZSchema.parse(
            { ...validCustomer, name: undefined }
        )).toThrow();
    });

    // Test case for invalid email format
    it("should fail when the email is invalid", () => {
        expect(() => createCustomerZSchema.parse(
            { ...validCustomer, email: "not-an-email" }
        )).toThrow();
    });

    // Test case for missing phone number
    it("should fail when the phone is missing", () => {
        expect(() => createCustomerZSchema.parse(
            { ...validCustomer, phone: undefined }
        )).toThrow();
    });

    // Test case for missing address
    it("should fail when the address is missing", () => {
        expect(() => createCustomerZSchema.parse(
            { ...validCustomer, address: undefined }
        )).toThrow();
    });

    // Test case for empty name
    it("should fail when the name is empty", () => {
        expect(() => createCustomerZSchema.parse(
            { ...validCustomer, name: "" }
        )).toThrow();
    });

});