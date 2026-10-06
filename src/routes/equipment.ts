import { Router } from 'express';
import { EquipmentController } from '../controllers/equipment.js';

// Create a new router instance
const router = Router();
// Create an instance of the EquipmentController
const equipmentController = new EquipmentController();

// Define the routes for equipment operations
router.get('/', equipmentController.getEquipment);
router.get('/:id', equipmentController.getEquipmentById);
router.post('/', equipmentController.createEquipment);
router.put('/:id', equipmentController.updateEquipment);
router.delete('/:id', equipmentController.deleteEquipment);

export default router;