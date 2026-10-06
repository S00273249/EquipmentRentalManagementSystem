import { CustomerModel, ICustomer } from '../models/customers.js';
import { HydratedDocument } from 'mongoose';

export class CustomerService {

    // Get all customers from the database
    async getAllCustomers(): Promise<ICustomer[]> {
        return await CustomerModel.find().lean();
    }

    // Get a single customer by ID from the database
    async getCustomerById(id: string): Promise<ICustomer | null> {
        return await CustomerModel.findById(id).lean();
    }

    // Create a new customer in the database
    async createCustomer(customerData: ICustomer): Promise<HydratedDocument<ICustomer>> {
        const customer = new CustomerModel(customerData);
        return await customer.save();
    }

    // Update an existing customer in the database
    async updateCustomer(id: string, customerData: Partial<ICustomer>): Promise<ICustomer | null> {
        return await CustomerModel.findByIdAndUpdate(
            id,
            customerData,
            { returnDocument: 'after' }
        ).lean();
    }

    // Delete a customer from the database
    async deleteCustomer(id: string): Promise<ICustomer | null> {
        return await CustomerModel.findByIdAndDelete(id).lean();
    }
}