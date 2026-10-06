import { createCustomerZSchema, updateCustomerZSchema } from '../models/customers.js';
import { Request, Response } from 'express';
import { CustomerService } from '../services/customers.js';

const customerService = new CustomerService();

export class CustomerController {

    // Get all customers
    getCustomers = async (_req: Request, res: Response): Promise<void> => {
        try {

            const customers = await customerService.getAllCustomers();
            res.status(200).json(customers);

        } catch (error) {

            res.status(500).json({
                message: 'Error fetching customers',
                error
            });
        }
    };

    // Get a customer by ID
    getCustomerById = async (req: Request, res: Response): Promise<void> => {
        try {

            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const customer = await customerService.getCustomerById(id);

            if (!customer) {
                res.status(404).json({
                    message: 'Customer not found'
                });
                return;
            }

            res.status(200).json(customer);

        } catch (error) {

            res.status(500).json({
                message: 'Error fetching customer',
                error
            });
        }
    };

    // Create a new customer
    createCustomer = async (req: Request, res: Response): Promise<void> => {
        try {

            const validation = createCustomerZSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({
                    message: 'Invalid customer data',
                    errors: validation.error.issues
                });
                return;
            }

            const newCustomer = await customerService.createCustomer(req.body);
            res.status(201).json(newCustomer);

        } catch (error) {

            res.status(500).json({
                message: 'Error inserting into MongoDB',
                error
            });
        }
    };

    // Update an existing customer
    updateCustomer = async (req: Request, res: Response): Promise<void> => {
        try {

            const validation = updateCustomerZSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({
                    message: 'Invalid customer data',
                    errors: validation.error.issues
                });
                return;
            }

            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const updatedCustomer = await customerService.updateCustomer(id, req.body);

            if (!updatedCustomer) {
                res.status(404).json({
                    message: 'Customer not found'
                });
                return;
            }

            res.status(200).json(updatedCustomer);

        } catch (error) {

            res.status(500).json({
                message: 'Error updating customer',
                error
            });
        }
    };

    // Delete a customer by ID
    deleteCustomer = async (req: Request, res: Response): Promise<void> => {
        try {

            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const customer = await customerService.deleteCustomer(id);

            if (!customer) {
                res.status(404).json({
                    message: 'Customer not found'
                });
                return;
            }

            res.status(200).json(customer);

        } catch (error) {

            res.status(500).json({
                message: 'Error deleting customer',
                error
            });
        }
    };

}