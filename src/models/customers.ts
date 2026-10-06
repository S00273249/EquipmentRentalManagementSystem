import { Schema, model } from 'mongoose';
import { z } from 'zod';

// Define the TypeScript interface for a Customer
export interface ICustomer {
    name: string;
    email: string;
    phone: string;
    address: string;
}

// Define the Mongoose schema for the Customer model
const customerSchema = new Schema<ICustomer>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
    },
    { timestamps: true }
);

// Create the Customer model using the schema
export const CustomerModel = model<ICustomer>('Customer', customerSchema);

// Define Zod schemas for validating customer data
export const createCustomerZSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    address: z.string().min(1),
});

// Define Zod schema for validating customer update data
export const updateCustomerZSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
});