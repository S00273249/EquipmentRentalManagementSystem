import { Request, Response } from 'express';
import { EquipmentService } from '../services/equipment.js';

const equipmentService = new EquipmentService();

export class EquipmentController {

    // #region GetAllEquipment

    /**
     * @openapi
     * /equipment:
     *   get:
     *     summary: Get all equipment
     *     tags:
     *       - Equipment
     *     responses:
     *       200:
     *         description: List of equipment
     */
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

    // #region GetFilteredEquipment

    /**
     * @openapi
     * /equipment/search:
     *   get:
     *     summary: Search and filter equipment
     *     tags:
     *       - Equipment
     *     parameters:
     *       - name: category
     *         in: query
     *         required: false
     *         schema:
     *           type: string
     *         description: Filter equipment by category
     *       - name: status
     *         in: query
     *         required: false
     *         schema:
     *           type: string
     *         description: Filter equipment by status
     *       - name: condition
     *         in: query
     *         required: false
     *         schema:
     *           type: string
     *         description: Filter equipment by condition
     *       - name: sort
     *         in: query
     *         required: false
     *         schema:
     *           type: string
     *           enum:
     *             - dailyRate
     *         description: Sort equipment by daily rental rate
     *     responses:
     *       200:
     *         description: Filtered list of equipment
     */
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

    // #endregion

    // #region GetAvailableEquipment

    /**
     * @openapi
     * /equipment/available:
     *   get:
     *     summary: Get equipment available for a date range
     *     tags:
     *       - Equipment
     *     parameters:
     *       - name: from
     *         in: query
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *         description: Start date of the rental period
     *       - name: to
     *         in: query
     *         required: true
     *         schema:
     *           type: string
     *           format: date
     *         description: End date of the rental period
     *     responses:
     *       200:
     *         description: List of equipment available for the requested period
     *       400:
     *         description: Invalid or missing dates
     */
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

    // #endregion

}