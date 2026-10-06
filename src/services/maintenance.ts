import { MaintenanceModel, IMaintenanceRecord } from '../models/maintenance.js';
import { HydratedDocument } from 'mongoose';

export class MaintenanceService {

    // Fetch all maintenance records from the database
    async getAllMaintenanceRecords(): Promise<IMaintenanceRecord[]> {
        return await MaintenanceModel.find().lean();
    }

    // Fetch a single maintenance record by its ID
    async getMaintenanceRecordById(id: string): Promise<IMaintenanceRecord | null> {
        return await MaintenanceModel.findById(id).lean();
    }

    // Create a new maintenance record in the database
    async createMaintenanceRecord(
        maintenanceData: IMaintenanceRecord
    ): Promise<HydratedDocument<IMaintenanceRecord>> {
        const maintenanceRecord = new MaintenanceModel(maintenanceData);
        return await maintenanceRecord.save();
    }

    // Update an existing maintenance record by its ID
    async updateMaintenanceRecord(
        id: string,
        maintenanceData: Partial<IMaintenanceRecord>
    ): Promise<IMaintenanceRecord | null> {
        return await MaintenanceModel.findByIdAndUpdate(
            id,
            maintenanceData,
            { returnDocument: 'after' }
        ).lean();
    }

    // Delete a maintenance record by its ID
    async deleteMaintenanceRecord(id: string): Promise<IMaintenanceRecord | null> {
        return await MaintenanceModel.findByIdAndDelete(id).lean();
    }
}