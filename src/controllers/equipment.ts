import { createEquipmentZSchema, updateEquipmentZSchema } from '../models/equipment.js';
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

            const validation = createEquipmentZSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({
                    message: 'Invalid equipment data',
                    errors: validation.error.issues
                });
                return;
            }

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

            const validation = updateEquipmentZSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({
                    message: 'Invalid equipment data',
                    errors: validation.error.issues
                });
                return;
            }

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

}