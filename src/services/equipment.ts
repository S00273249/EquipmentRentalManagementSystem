import { EquipmentModel, IEquipment } from '../models/equipment.js';
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
}