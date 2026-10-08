import { createMaintenanceZSchema } from "../../src/models/maintenance.js";

// Valid maintenance data for testing
const validMaintenance = {
    equipmentId: "507f1f77bcf86cd799439011",
    maintenanceType: "Repair",
    description: "Camera repair",
    startDate: "2026-12-01",
    endDate: "2026-12-03",
    cost: 100,
    notes: "Test maintenance"
};

// Test suite for maintenance validation
describe("Test Maintenance Validation", () => {

    // Test case for valid maintenance data
    it("should pass for valid maintenance data", () => {
        expect(() => createMaintenanceZSchema.parse(validMaintenance)).not.toThrow();
    });

    // Test case for missing equipmentId
    it("should fail when equipmentId is missing", () => {
        expect(() =>
            createMaintenanceZSchema.parse({ ...validMaintenance, equipmentId: undefined })
        ).toThrow();
    });

    // Test case for missing maintenanceType
    it("should fail when maintenanceType is missing", () => {
        expect(() =>
            createMaintenanceZSchema.parse({ ...validMaintenance, maintenanceType: undefined })
        ).toThrow();
    });

    // Test case for missing startDate
    it("should fail when startDate is missing", () => {
        expect(() =>
            createMaintenanceZSchema.parse({ ...validMaintenance, startDate: undefined })
        ).toThrow();
    });

    // Test case for missing endDate
    it("should fail when endDate is missing", () => {
        expect(() =>
            createMaintenanceZSchema.parse({ ...validMaintenance, endDate: undefined })
        ).toThrow();
    });

    // Test case for negative cost
    it("should fail when cost is negative", () => {
        expect(() =>
            createMaintenanceZSchema.parse({ ...validMaintenance, cost: -100 })
        ).toThrow();
    });
});