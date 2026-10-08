import { Schema, model } from 'mongoose';
import { z } from 'zod';

// Define the TypeScript interface for Maintenance Record Document
export interface IMaintenanceRecord {
    equipmentId: string;
    maintenanceType: string;
    description: string;
    startDate: Date;
    endDate: Date;
    cost: number;
    notes: string;
}

// Define the Mongoose schema for the Maintenance Record model
const maintenanceSchema = new Schema<IMaintenanceRecord>(
    {
        equipmentId: { type: String, required: true },
        maintenanceType: { type: String, required: true },
        description: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        cost: { type: Number, required: true },
        notes: { type: String, required: true },
    },
    { timestamps: true }
);

/**
 * @openapi
 * components:
 *   schemas:
 *     MaintenanceRecord:
 *       type: object
 *       required:
 *         - equipmentId
 *         - maintenanceType
 *         - description
 *         - startDate
 *         - endDate
 *         - cost
 *         - notes
 *       properties:
 *         equipmentId:
 *           type: string
 *           example: 68e123456789abcdef654321
 *         maintenanceType:
 *           type: string
 *           example: Repair
 *         description:
 *           type: string
 *           example: Replace damaged lens
 *         startDate:
 *           type: string
 *           format: date
 *           example: 2026-10-20
 *         endDate:
 *           type: string
 *           format: date
 *           example: 2026-10-22
 *         cost:
 *           type: number
 *           example: 75
 *         notes:
 *           type: string
 *           example: Equipment unavailable during repair
 */
// Create the Maintenance Record model using the schema
export const MaintenanceModel = model<IMaintenanceRecord>(
    'MaintenanceRecord',
    maintenanceSchema
);

// Define Zod schemas for validating maintenance record data
export const createMaintenanceZSchema = z.object({
    equipmentId: z.string().min(1),
    maintenanceType: z.string().min(1),
    description: z.string().min(1),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    cost: z.number().nonnegative(),
    notes: z.string().min(1),
});

// Define Zod schema for validating maintenance record update data, allowing optional fields
export const updateMaintenanceZSchema = z.object({
    equipmentId: z.string().min(1).optional(),
    maintenanceType: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    cost: z.number().nonnegative().optional(),
    notes: z.string().min(1).optional(),
});