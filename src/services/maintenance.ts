import { MaintenanceModel, IMaintenanceRecord } from '../models/maintenance.js';
import { HydratedDocument } from 'mongoose';

export class MaintenanceService {

    // #region Get All Maintenance Records

    // Fetch all maintenance records from the database
    async getAllMaintenanceRecords(filters: {
        equipmentId?: string;
    }): Promise<IMaintenanceRecord[]> {

        // Create a query object to hold the filters for the database query
        const query: Record<string, string> = {};

        // If a filter is provided, add it to the query object
        if (filters.equipmentId) {
            query.equipmentId = filters.equipmentId;
        }

        // Execute the query to find maintenance records that match the filters
        return await MaintenanceModel.find(query).lean();
    }

    // #endregion

    // #region Get Maintenance Record By ID

    // Fetch a single maintenance record by its ID
    async getMaintenanceRecordById(id: string): Promise<IMaintenanceRecord | null> {
        return await MaintenanceModel.findById(id).lean();
    }

    // #endregion

    // #region Create Records

    // Create a new maintenance record in the database
    async createMaintenanceRecord(
        maintenanceData: IMaintenanceRecord
    ): Promise<HydratedDocument<IMaintenanceRecord>> {
        const maintenanceRecord = new MaintenanceModel(maintenanceData);
        return await maintenanceRecord.save();
    }

    // #endregion

    // #region Update Records

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

    // #endregion

    // #region Delete Records

    // Delete a maintenance record by its ID
    async deleteMaintenanceRecord(id: string): Promise<IMaintenanceRecord | null> {
        return await MaintenanceModel.findByIdAndDelete(id).lean();
    }

    // #endregion
}