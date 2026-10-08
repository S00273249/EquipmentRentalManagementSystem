import { Request, Response } from 'express';
import { CustomerService } from '../services/customers.js';

const customerService = new CustomerService();

export class CustomerController {

    // #region GetAllCustomers
    /**
     * @openapi
     * /customers:
     *   get:
     *     summary: Get all customers
     *     tags:
     *       - Customers
     *     responses:
     *       200:
     *         description: List of customers
     */
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

    // #endregion

    // #region GetCustomerById
    
    /**
     * @openapi
     * /customers/{id}:
     *   get:
     *     summary: Get a customer by ID
     *     tags:
     *       - Customers
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Customer data
     *       404:
     *         description: Customer not found
     */
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

    // #endregion

    // #region CreateCustomer
    /**
     * @openapi
     * /customers:
     *   post:
     *     summary: Create a new customer
     *     tags:
     *       - Customers
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Customer'
     *     responses:
     *       201:
     *         description: Customer created successfully
     *       400:
     *         description: Validation failed
     */
    // Create a new customer
    createCustomer = async (req: Request, res: Response): Promise<void> => {
        try {

            const newCustomer = await customerService.createCustomer(req.body);
            res.status(201).json(newCustomer);

        } catch (error) {

            res.status(500).json({
                message: 'Error inserting into MongoDB',
                error
            });
        }
    };

    // #endregion

    // #region UpdateCustomer

    /**
     * @openapi
     * /customers/{id}:
     *   put:
     *     summary: Update a customer
     *     tags:
     *       - Customers
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
     *             $ref: '#/components/schemas/Customer'
     *     responses:
     *       200:
     *         description: Customer updated successfully
     *       400:
     *         description: Validation failed
     *       404:
     *         description: Customer not found
     */
    // Update an existing customer
    updateCustomer = async (req: Request, res: Response): Promise<void> => {
        try {

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

    // #endregion

    // #region DeleteCustomer

    /**
     * @openapi
     * /customers/{id}:
     *   delete:
     *     summary: Delete a customer
     *     tags:
     *       - Customers
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Customer deleted successfully
     *       404:
     *         description: Customer not found
     */
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

    // #endregion

}