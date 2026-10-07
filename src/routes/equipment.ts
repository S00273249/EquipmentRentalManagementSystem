import { Router } from 'express';
import { EquipmentController } from '../controllers/equipment';
import { authenticateKey } from '../middleware/authentication.middleware';
import { validate } from '../middleware/validate.middleware';
import { createEquipmentZSchema, updateEquipmentZSchema } from '../models/equipment';

// Create a new router instance
const router = Router();
// Create an instance of the EquipmentController
const equipmentController = new EquipmentController();

// Define the routes for equipment operations
router.get('/', authenticateKey, equipmentController.getEquipment);
router.get('/:id', authenticateKey, equipmentController.getEquipmentById);
router.post('/', authenticateKey, validate(createEquipmentZSchema), equipmentController.createEquipment);
router.put('/:id', authenticateKey, validate(updateEquipmentZSchema), equipmentController.updateEquipment);
router.delete('/:id', authenticateKey, equipmentController.deleteEquipment);

export default router;