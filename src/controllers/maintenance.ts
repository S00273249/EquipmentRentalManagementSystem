import { Request, Response } from 'express';
import { MaintenanceService } from '../services/maintenance.js';

const maintenanceService = new MaintenanceService();

export class MaintenanceController {

    // #region Get All Maintenance Records

    // Get all maintenance records
    getMaintenanceRecords = async (req: Request, res: Response): Promise<void> => {
        try {

            // Extract query parameters for filtering maintenance records
            const maintenanceRecords = await maintenanceService.getAllMaintenanceRecords({
                equipmentId: typeof req.query.equipmentId === 'string'
                    ? req.query.equipmentId
                    : undefined
            });

            // Return the filtered maintenance records as a JSON response
            res.status(200).json(maintenanceRecords);

        } catch (error) {

            // Return a 500 Internal Server Error response if an error occurs
            res.status(500).json({
                message: 'Error fetching maintenance records',
                error
            });
        }
    };

    // #endregion

    // #region Get Maintenance Record By ID

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

    // #endregion

    // #region Create Records

    // Create a new maintenance record
    createMaintenanceRecord = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

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

    // #endregion

    // #region Update Records

    // Update an existing maintenance record
    updateMaintenanceRecord = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {

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

    // #endregion

    // #region Delete Records

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

    // #endregion

}