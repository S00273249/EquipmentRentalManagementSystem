import { Schema, model } from 'mongoose';
import { z } from 'zod';

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

// Create the Booking model using the defined schema
export const BookingModel = model<IBooking>('Booking', bookingSchema);

// Define Zod schemas for validating booking data
export const createBookingZSchema = z.object({
    customerId: z.string().min(1),
    equipmentId: z.string().min(1),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    status: z.string().min(1),
    dailyRate: z.number().positive(),
    totalCost: z.number().positive(),
});

// Define Zod schema for updating booking data, allowing optional fields
export const updateBookingZSchema = z.object({
    customerId: z.string().min(1).optional(),
    equipmentId: z.string().min(1).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    status: z.string().min(1).optional(),
    dailyRate: z.number().positive().optional(),
    totalCost: z.number().positive().optional(),
});