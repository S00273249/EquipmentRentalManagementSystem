import { Schema, model } from 'mongoose';
import { z } from 'zod';

// #region Equipment Interface

// Define the TypeScript interface for Equipment Document
export interface IEquipment {
    name: string;
    category: string;
    description: string;
    dailyRate: number;
    status: string;
    condition: string;
}

// #endregion

// #region Equipment Categories, Statuses, and Conditions

// Define the possible categories, statuses, and conditions for equipment
const equipmentCategories = [
    "Camera",
    "Audio",
    "Lighting",
    "Computer",
    "Tool",
    "Other"
] as const;

const equipmentStatuses = [
    "Available",
    "Maintenance",
    "Retired"
] as const;

const equipmentConditions = [
    "Excellent",
    "Good",
    "Fair",
    "Poor"
] as const;

// #endregion

// #region Equipment Schema and Model

// Define the Mongoose schema for the Equipment model
const equipmentSchema = new Schema<IEquipment>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        dailyRate: { type: Number, required: true },
        category: {
            type: String,
            required: true,
            enum: equipmentCategories
        },
        status: {
            type: String,
            required: true,
            enum: equipmentStatuses
        },
        condition: {
            type: String,
            required: true,
            enum: equipmentConditions
        },
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

// #endregion

// #region Zod Schemas for Equipment Validation

// Define Zod schemas for validating equipment data
export const createEquipmentZSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    dailyRate: z.number().positive(),
    category: z.enum(equipmentCategories),
    status: z.enum(equipmentStatuses),
    condition: z.enum(equipmentConditions),
});

// Define Zod schema for validating equipment update data, allowing optional fields
export const updateEquipmentZSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    dailyRate: z.number().positive().optional(),
    category: z.enum(equipmentCategories),
    status: z.enum(equipmentStatuses),
    condition: z.enum(equipmentConditions),
});

// #endregion