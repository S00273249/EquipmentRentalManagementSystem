import { Request, Response } from 'express';
import { EquipmentService } from '../services/equipment.js';

const equipmentService = new EquipmentService();

export class EquipmentController {

    // #region GetEquipment

    /**
     * @openapi
     * /equipment:
     *   get:
     *     summary: Get equipment with optional filtering and availability
     *     tags:
     *       - Equipment
     *     parameters:
     *       - name: category
     *         in: query
     *         required: false
     *         description: Filter equipment by category
     *         schema:
     *           type: string
     *           enum: [Camera, Audio, Lighting, Computer, Tool, Other]
     *       - name: status
     *         in: query
     *         required: false
     *         description: Filter equipment by status
     *         schema:
     *           type: string
     *           enum: [Available, Maintenance, Retired]
     *       - name: condition
     *         in: query
     *         required: false
     *         description: Filter equipment by condition
     *         schema:
     *           type: string
     *           enum: [Excellent, Good, Fair, Poor]
     *       - name: sort
     *         in: query
     *         required: false
     *         description: Sort equipment by daily rental rate in ascending order
     *         schema:
     *           type: string
     *           enum: [dailyRate]
     *       - name: from
     *         in: query
     *         required: false
     *         description: Start date of the rental period
     *         schema:
     *           type: string
     *           format: date
     *       - name: to
     *         in: query
     *         required: false
     *         description: End date of the rental period
     *         schema:
     *           type: string
     *           format: date
     *     responses:
     *       200:
     *         description: List of equipment matching the supplied filters
     *       400:
     *         description: Invalid or incomplete date range
     */

    // Get equipment with optional filtering and availability
    getEquipment = async (req: Request, res: Response): Promise<void> => {
        try {

            // Extract the date query parameters if they are strings
            const fromValue = typeof req.query.from === 'string'
                ? req.query.from
                : undefined;

            const toValue = typeof req.query.to === 'string'
                ? req.query.to
                : undefined;

            // Ensure that both dates are provided together
            if ((fromValue && !toValue) || (!fromValue && toValue)) {
                res.status(400).json({
                    message: 'Both from and to dates are required'
                });
                return;
            }

            // Convert the date query parameters into Date objects
            const from = fromValue ? new Date(fromValue) : undefined;
            const to = toValue ? new Date(toValue) : undefined;

            // Validate the supplied dates
            if (from && to) {

                // Check whether either date is invalid
                if (isNaN(from.getTime()) || isNaN(to.getTime())) {
                    res.status(400).json({
                        message: 'Invalid from or to date'
                    });
                    return;
                }

                // Ensure that the to date is after the from date
                if (to <= from) {
                    res.status(400).json({
                        message: 'The to date must be after the from date'
                    });
                    return;
                }
            }

            // Get equipment based on the supplied query parameters
            const equipment = await equipmentService.getEquipment({
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
                    : undefined,
                from,
                to
            });

            // Return the equipment items in the response
            res.status(200).json(equipment);

        } catch (error) {

            res.status(500).json({
                message: 'Error fetching equipment',
                error
            });
        }
    };

    // #endregion

    // #region GetEquipmentById

    /**
     * @openapi
     * /equipment/{id}:
     *   get:
     *     summary: Get equipment by ID
     *     tags:
     *       - Equipment
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Equipment found
     *       404:
     *         description: Equipment not found
     */

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

    // #endregion

    // #region CreateEquipment

    /**
     * @openapi
     * /equipment:
     *   post:
     *     summary: Create new equipment
     *     tags:
     *       - Equipment
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Equipment'
     *     responses:
     *       201:
     *         description: Equipment created successfully
     *       400:
     *         description: Validation failed
     */

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

    // #endregion

    // #region UpdateEquipment

    /**
     * @openapi
     * /equipment/{id}:
     *   put:
     *     summary: Update equipment
     *     tags:
     *       - Equipment
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Equipment'
     *     responses:
     *       200:
     *         description: Equipment updated successfully
     *       400:
     *         description: Validation failed
     *       404:
     *         description: Equipment not found
     */

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

    // #endregion

    // #region DeleteEquipment

    /**
     * @openapi
     * /equipment/{id}:
     *   delete:
     *     summary: Delete equipment
     *     tags:
     *       - Equipment
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Equipment deleted successfully
     *       404:
     *         description: Equipment not found
     */

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

    // #endregion

}