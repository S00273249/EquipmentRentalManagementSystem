import { Schema, model } from 'mongoose';
import { z } from 'zod';

// Define the TypeScript interface for Equipment Document
export interface IEquipment {
    name: string;
    category: string;
    description: string;
    dailyRate: number;
    status: string;
    condition: string;
}

// Define the Mongoose schema for the Equipment model
const equipmentSchema = new Schema<IEquipment>(
    {
        name: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String, required: true },
        dailyRate: { type: Number, required: true },
        status: { type: String, required: true },
        condition: { type: String, required: true },
    },
    { timestamps: true }
);

/**
 * @openapi
 * components:
 *   schemas:
 *     Equipment:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *         - dailyRate
 *         - status
 *         - condition
 *       properties:
 *         name:
 *           type: string
 *           example: Canon EOS Camera
 *         category:
 *           type: string
 *           example: Camera
 *         description:
 *           type: string
 *           example: Professional DSLR camera
 *         dailyRate:
 *           type: number
 *           example: 50
 *         status:
 *           type: string
 *           example: Available
 *         condition:
 *           type: string
 *           example: Good
 */
// Create the Equipment model using the schema
export const EquipmentModel = model<IEquipment>('Equipment', equipmentSchema);

// Define Zod schemas for validating equipment data
export const createEquipmentZSchema = z.object({
    name: z.string().min(1),
    category: z.string().min(1),
    description: z.string().min(1),
    dailyRate: z.number().positive(),
    status: z.string().min(1),
    condition: z.string().min(1),
});

// Define Zod schema for validating equipment update data, allowing optional fields
export const updateEquipmentZSchema = z.object({
    name: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    dailyRate: z.number().positive().optional(),
    status: z.string().min(1).optional(),
    condition: z.string().min(1).optional(),
});