import { createMaintenanceZSchema, updateMaintenanceZSchema } from '../models/maintenance.js';
import { Request, Response } from 'express';
import { MaintenanceService } from '../services/maintenance.js';

const maintenanceService = new MaintenanceService();

export class MaintenanceController {

    // Get all maintenance records
    getMaintenanceRecords = async (_req: Request, res: Response): Promise<void> => {
        try {

            const maintenanceRecords =
                await maintenanceService.getAllMaintenanceRecords();

            res.status(200).json(maintenanceRecords);

        } catch (error) {

            res.status(500).json({
                message: 'Error fetching maintenance records',
                error
            });
        }
    };

    // Get a maintenance record by ID
    getMaintenanceRecordById = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            const id = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;

            const maintenanceRecord =
                await maintenanceService.getMaintenanceRecordById(id);

            if (!maintenanceRecord) {
                res.status(404).json({
                    message: 'Maintenance record not found'
                });
                return;
            }

            res.status(200).json(maintenanceRecord);

        } catch (error) {

            res.status(500).json({
                message: 'Error fetching maintenance record',
                error
            });
        }
    };

    // Create a new maintenance record
    createMaintenanceRecord = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            const validation =
                createMaintenanceZSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({
                    message: 'Invalid maintenance data',
                    errors: validation.error.issues
                });
                return;
            }

            const newMaintenanceRecord =
                await maintenanceService.createMaintenanceRecord(req.body);

            res.status(201).json(newMaintenanceRecord);

        } catch (error) {

            res.status(500).json({
                message: 'Error inserting into MongoDB',
                error
            });
        }
    };

    // Update an existing maintenance record
    updateMaintenanceRecord = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            const validation =
                updateMaintenanceZSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({
                    message: 'Invalid maintenance data',
                    errors: validation.error.issues
                });
                return;
            }

            const id = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;

            const updatedMaintenanceRecord =
                await maintenanceService.updateMaintenanceRecord(
                    id,
                    req.body
                );

            if (!updatedMaintenanceRecord) {
                res.status(404).json({
                    message: 'Maintenance record not found'
                });
                return;
            }

            res.status(200).json(updatedMaintenanceRecord);

        } catch (error) {

            res.status(500).json({
                message: 'Error updating maintenance record',
                error
            });
        }
    };

    // Delete a maintenance record by ID
    deleteMaintenanceRecord = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

            const id = Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;

            const maintenanceRecord =
                await maintenanceService.deleteMaintenanceRecord(id);

            if (!maintenanceRecord) {
                res.status(404).json({
                    message: 'Maintenance record not found'
                });
                return;
            }

            res.status(200).json(maintenanceRecord);

        } catch (error) {

            res.status(500).json({
                message: 'Error deleting maintenance record',
                error
            });
        }
    };

}