import { Router } from 'express';
import { MaintenanceController } from '../controllers/maintenance';
import { authenticateKey } from '../middleware/authentication.middleware';
import { validate } from '../middleware/validate.middleware';
import { createMaintenanceZSchema, updateMaintenanceZSchema } from '../models/maintenance';

// Create a new router instance for maintenance routes
const router = Router();
// Create an instance of the MaintenanceController
const maintenanceController = new MaintenanceController();

// Define the routes for maintenance operations
router.get('/', authenticateKey, maintenanceController.getMaintenanceRecords);
router.get('/:id', authenticateKey, maintenanceController.getMaintenanceRecordById);
router.post('/', authenticateKey, validate(createMaintenanceZSchema), maintenanceController.createMaintenanceRecord);
router.put('/:id', authenticateKey, validate(updateMaintenanceZSchema), maintenanceController.updateMaintenanceRecord);
router.delete('/:id', authenticateKey, maintenanceController.deleteMaintenanceRecord);

export default router;