import { EquipmentModel, IEquipment } from '../models/equipment.js';
import { BookingModel } from '../models/bookings.js';
import { MaintenanceModel } from '../models/maintenance.js';
import { HydratedDocument } from 'mongoose';

export class EquipmentService {

    // Get all equipment from the database
    async getAllEquipment(): Promise<IEquipment[]> {
        return await EquipmentModel.find().lean();
    }

    // Get a single equipment item by ID from the database
    async getEquipmentById(id: string): Promise<IEquipment | null> {
        return await EquipmentModel.findById(id).lean();
    }

    // Create a new equipment item in the database
    async createEquipment(equipmentData: IEquipment): Promise<HydratedDocument<IEquipment>> {
        const equipment = new EquipmentModel(equipmentData);
        return await equipment.save();
    }

    // Update an existing equipment item in the database
    async updateEquipment(id: string, equipmentData: Partial<IEquipment>): Promise<IEquipment | null> {
        return await EquipmentModel.findByIdAndUpdate(
            id,
            equipmentData,
            { returnDocument: 'after' }
        ).lean();
    }

    // Delete an equipment item from the database
    async deleteEquipment(id: string): Promise<IEquipment | null> {
        return await EquipmentModel.findByIdAndDelete(id).lean();
    }

    // Get equipment items based on filters and sorting
    async getFilteredEquipment(filters: {
        category?: string;
        status?: string;
        condition?: string;
        sort?: string;
    }): Promise<IEquipment[]> {

        // Build the query object based on provided filters
        const query: Record<string, string> = {};

        // Add filters to the query if they are provided
        if (filters.category) {
            query.category = filters.category;
        }

        if (filters.status) {
            query.status = filters.status;
        }

        if (filters.condition) {
            query.condition = filters.condition;
        }

        // Build the equipment query
        let equipmentQuery = EquipmentModel.find(query);

        // Sort by daily rate if requested
        if (filters.sort === 'dailyRate') {
            equipmentQuery = equipmentQuery.sort({ dailyRate: 1 });
        }

        // Execute the query and return the filtered equipment items
        return await equipmentQuery.lean();
    }

    // Get available equipment within a specified date range
    async getAvailableEquipment(
        from: Date,
        to: Date
    ): Promise<IEquipment[]> {

        // Find bookings that overlap with the specified date range and are not cancelled or completed
        const unavailableBookings = await BookingModel.find({
            status: { $nin: ['Cancelled', 'Completed'] },
            startDate: { $lt: to },
            endDate: { $gt: from }
        }).select('equipmentId').lean();

        // Find maintenance records that overlap with the specified date range
        const unavailableMaintenance = await MaintenanceModel.find({
            startDate: { $lt: to },
            endDate: { $gt: from }
        }).select('equipmentId').lean();

        // Combine the IDs of unavailable equipment from bookings and maintenance
        const unavailableEquipmentIds = [
            ...unavailableBookings.map(booking => booking.equipmentId),
            ...unavailableMaintenance.map(record => record.equipmentId)
        ]; // ... spread operator - expands the arrays so their elements are combined into one array

        // Return equipment that is not retired and not in the list of unavailable equipment
        return await EquipmentModel.find({
            status: { $ne: 'Retired' },
            _id: { $nin: unavailableEquipmentIds }
        }).lean();
    }

}