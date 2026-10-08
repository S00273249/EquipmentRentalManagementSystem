import { createEquipmentZSchema } from "../../src/models/equipment.js";

// Valid equipment data for testing
const validEquipment = {
    name: "Test Camera",
    category: "Camera",
    description: "Test camera",
    dailyRate: 50,
    status: "Available",
    condition: "Good"
};

// Test suite for equipment validation
describe("Test Equipment Validation", () => {

    // Test case for valid equipment data
    it("should pass for valid equipment data", () => {
        expect(() => createEquipmentZSchema.parse(validEquipment)).not.toThrow();
    });

    // Test case for missing name
    it("should fail when the name is missing", () => {
        expect(() =>
            createEquipmentZSchema.parse({ ...validEquipment, name: undefined })
        ).toThrow();
    });

    // Test case for invalid daily rate
    it("should fail when the daily rate is invalid", () => {
        expect(() =>
            createEquipmentZSchema.parse({ ...validEquipment, dailyRate: -10 })
        ).toThrow();
    });

    // Test case for missing category
    it("should fail when the category is missing", () => {
        expect(() =>
            createEquipmentZSchema.parse({ ...validEquipment, category: undefined })
        ).toThrow();
    });

    // Test case for missing status
    it("should fail when the status is missing", () => {
        expect(() =>
            createEquipmentZSchema.parse({ ...validEquipment, status: undefined })
        ).toThrow();
    });

    // Test case for missing condition
    it("should fail when the condition is missing", () => {
        expect(() =>
            createEquipmentZSchema.parse({ ...validEquipment, condition: undefined })
        ).toThrow();
    });

    // Test case for invalid category
    it("should fail for an invalid category", () => {
        expect(() =>
            createEquipmentZSchema.parse({
                ...validEquipment,
                category: "Banana"
            })
        ).toThrow();
    });

    // Test case for invalid status
    it("should fail for an invalid status", () => {
        expect(() =>
            createEquipmentZSchema.parse({
                ...validEquipment,
                status: "Rented"
            })
        ).toThrow();
    });

    // Test case for invalid condition
    it("should fail for an invalid condition", () => {
        expect(() =>
            createEquipmentZSchema.parse({
                ...validEquipment,
                condition: "Destroyed"
            })
        ).toThrow();
    });
});