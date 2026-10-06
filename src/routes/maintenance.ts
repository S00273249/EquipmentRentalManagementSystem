import { Router } from 'express';
import { MaintenanceController } from '../controllers/maintenance.js';

// Create a new router instance for maintenance routes
const router = Router();
// Create an instance of the MaintenanceController
const maintenanceController = new MaintenanceController();

// Define the routes for maintenance operations
router.get('/', maintenanceController.getMaintenanceRecords);
router.get('/:id', maintenanceController.getMaintenanceRecordById);
router.post('/', maintenanceController.createMaintenanceRecord);
router.put('/:id', maintenanceController.updateMaintenanceRecord);
router.delete('/:id', maintenanceController.deleteMaintenanceRecord);

export default router;