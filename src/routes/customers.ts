import { Router } from 'express';
import { CustomerController } from '../controllers/customers';
import { authenticateKey } from '../middleware/authentication.middleware';
import { validate } from '../middleware/validate.middleware';
import { createCustomerZSchema, updateCustomerZSchema } from '../models/customers';

// Create a new router instance
const router = Router();
// Create an instance of the CustomerController
const customerController = new CustomerController();

// Define the routes for customer operations
router.get('/', authenticateKey, customerController.getCustomers);
router.get('/:id', authenticateKey, customerController.getCustomerById);
router.post('/', authenticateKey, validate(createCustomerZSchema), customerController.createCustomer);
router.put('/:id', authenticateKey, validate(updateCustomerZSchema), customerController.updateCustomer);
router.delete('/:id', authenticateKey, customerController.deleteCustomer);

export default router;