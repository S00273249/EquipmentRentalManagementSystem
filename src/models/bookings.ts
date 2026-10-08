import { Schema, model } from 'mongoose';
import { z } from 'zod';

// #region Booking Interface

// Define the TypeScript interface for a Booking document
export interface IBooking {
    customerId: string;
    equipmentId: string;
    startDate: Date;
    endDate: Date;
    status: string;
    dailyRate: number;
    totalCost: number;
}

// #endregion

// #region Booking Schema and Model

// Define the Mongoose schema for the Booking model
const bookingSchema = new Schema<IBooking>(
    {
        customerId: { type: String, required: true },
        equipmentId: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: { type: String, required: true },
        dailyRate: { type: Number, required: true },
        totalCost: { type: Number, required: true },
    },
    { timestamps: true }
);

/**
 * @openapi
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - customerId
 *         - equipmentId
 *         - startDate
 *         - endDate
 *         - status
 *       properties:
 *         customerId:
 *           type: string
 *           example: 68e123456789abcdef123456
 *         equipmentId:
 *           type: string
 *           example: 68e123456789abcdef654321
 *         startDate:
 *           type: string
 *           format: date
 *           example: 2026-10-10
 *         endDate:
 *           type: string
 *           format: date
 *           example: 2026-10-15
 *         status:
 *           type: string
 *           example: Pending
 *         dailyRate:
 *           type: number
 *           example: 50
 *         totalCost:
 *           type: number
 *           example: 250
 */
// Create the Booking model using the defined schema
export const BookingModel = model<IBooking>('Booking', bookingSchema);

// #endregion

// #region Zod Schemas for Validation

// Define Zod schemas for validating booking data
export const createBookingZSchema = z.object({
    customerId: z.string().min(1),
    equipmentId: z.string().min(1),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    status: z.string().min(1),
});

// Define Zod schema for updating booking data, allowing optional fields
export const updateBookingZSchema = z.object({
    customerId: z.string().min(1).optional(),
    equipmentId: z.string().min(1).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    status: z.string().min(1).optional(),
});

// #endregion