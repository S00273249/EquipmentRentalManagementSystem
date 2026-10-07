import { Request, Response } from 'express';
import { EquipmentService } from '../services/equipment.js';

const equipmentService = new EquipmentService();

export class EquipmentController {

    // Get all equipment
    getEquipment = async (_req: Request, res: Response): Promise<void> => {
        try {

            const equipment = await equipmentService.getAllEquipment();
            res.status(200).json(equipment);

        } catch (error) {

            res.status(500).json({
                message: 'Error fetching equipment',
                error
            });
        }
    };

    // Get equipment by ID
    getEquipmentById = async (req: Request, res: Response): Promise<void> => {
        try {

            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const equipment = await equipmentService.getEquipmentById(id);

            if (!equipment) {
                res.status(404).json({
                    message: 'Equipment not found'
                });
                return;
            }

            res.status(200).json(equipment);

        } catch (error) {

            res.status(500).json({
                message: 'Error fetching equipment',
                error
            });
        }
    };

    // Create new equipment
    createEquipment = async (req: Request, res: Response): Promise<void> => {
        try {

            const newEquipment = await equipmentService.createEquipment(req.body);
            res.status(201).json(newEquipment);

        } catch (error) {

            res.status(500).json({
                message: 'Error inserting into MongoDB',
                error
            });
        }
    };

    // Update existing equipment
    updateEquipment = async (req: Request, res: Response): Promise<void> => {
        try {

            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const updatedEquipment = await equipmentService.updateEquipment(id, req.body);

            if (!updatedEquipment) {
                res.status(404).json({
                    message: 'Equipment not found'
                });
                return;
            }

            res.status(200).json(updatedEquipment);

        } catch (error) {

            res.status(500).json({
                message: 'Error updating equipment',
                error
            });
        }
    };

    // Delete equipment
    deleteEquipment = async (req: Request, res: Response): Promise<void> => {
        try {

            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const equipment = await equipmentService.deleteEquipment(id);

            if (!equipment) {
                res.status(404).json({
                    message: 'Equipment not found'
                });
                return;
            }

            res.status(200).json(equipment);

        } catch (error) {

            res.status(500).json({
                message: 'Error deleting equipment',
                error
            });
        }
    };

    // Get filtered equipment
    getFilteredEquipment = async (req: Request, res: Response): Promise<void> => {
        try {

            // Call the service method to get filtered equipment based on query parameters
            const equipment = await equipmentService.getFilteredEquipment({
                // If the category query parameter is a string, use it, otherwise set it to undefined
                category: typeof req.query.category === 'string'
                    ? req.query.category
                    : undefined,
                status: typeof req.query.status === 'string'
                    ? req.query.status
                    : undefined,
                condition: typeof req.query.condition === 'string'
                    ? req.query.condition
                    : undefined,
                sort: typeof req.query.sort === 'string'
                    ? req.query.sort
                    : undefined
            });

            // Return the filtered equipment items in the response
            res.status(200).json(equipment);

        } catch (error) {

            // Handle any errors that occur during the filtering process
            res.status(500).json({
                message: 'Error fetching equipment',
                error
            });
        }
    };

    // Get available equipment within a specified date range
    getAvailableEquipment = async (req: Request, res: Response): Promise<void> => {
        try {

            // Parse the 'from' and 'to' query parameters as Date objects
            const from = new Date(req.query.from as string);
            const to = new Date(req.query.to as string);

            // isNaN (is Not a Number) checks if the date is invalid
            if (isNaN(from.getTime()) || isNaN(to.getTime())) { 
                res.status(400).json({
                    message: 'Invalid from or to date'
                });
                return;
            }

            // Ensure that the 'to' date is after the 'from' date
            if (to <= from) {
                res.status(400).json({
                    message: 'The to date must be after the from date'
                });
                return;
            }

            // Call the service method to get available equipment within the specified date range
            const equipment = await equipmentService.getAvailableEquipment(from, to);

            res.status(200).json(equipment); // Return the available equipment items in the response

        } catch (error) {

            // Handle any errors that occur during the process of fetching available equipment
            res.status(500).json({
                message: 'Error fetching available equipment',
                error
            });
        }
    };

}