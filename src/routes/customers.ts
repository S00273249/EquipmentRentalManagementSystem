import { Router } from 'express';
import { CustomerController } from '../controllers/customers.js';

// Create a new router instance
const router = Router();
// Create an instance of the CustomerController
const customerController = new CustomerController();

// Define the routes for customer operations
router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export default router;