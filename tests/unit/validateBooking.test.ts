import { createBookingZSchema } from "../../src/models/bookings.js";

// Valid booking data for testing
const validBooking = {
    customerId: "507f1f77bcf86cd799439011",
    equipmentId: "507f1f77bcf86cd799439012",
    startDate: "2026-11-01",
    endDate: "2026-11-05",
    status: "Confirmed"
};

// Test suite for booking validation
describe("Test Booking Validation", () => {

    // Test case for valid booking data
    it("should pass for valid booking data", () => {
        expect(() => createBookingZSchema.parse(validBooking)).not.toThrow();
    });

    // Test case for missing customerId
    it("should fail when customerId is missing", () => {
        expect(() =>
            createBookingZSchema.parse({ ...validBooking, customerId: undefined })
        ).toThrow();
    });

    // Test case for missing equipmentId
    it("should fail when equipmentId is missing", () => {
        expect(() =>
            createBookingZSchema.parse({ ...validBooking, equipmentId: undefined })
        ).toThrow();
    });

    // Test case for missing startDate
    it("should fail when startDate is missing", () => {
        expect(() =>
            createBookingZSchema.parse({ ...validBooking, startDate: undefined })
        ).toThrow();
    });

    // Test case for missing endDate
    it("should fail when endDate is missing", () => {
        expect(() =>
            createBookingZSchema.parse({ ...validBooking, endDate: undefined })
        ).toThrow();
    });

    // Test case for missing status
    it("should fail when status is missing", () => {
        expect(() =>
            createBookingZSchema.parse({ ...validBooking, status: undefined })
        ).toThrow();
    });

    // Test case for invalid booking status
    it("should fail for an invalid booking status", () => {
        expect(() =>
            createBookingZSchema.parse({
                ...validBooking,
                status: "Invalid"
            })
        ).toThrow();
    });
});