import { BookingModel, IBooking } from '../models/bookings.js';
import { CustomerModel } from '../models/customers.js';
import { EquipmentModel } from '../models/equipment.js';
import { MaintenanceModel } from '../models/maintenance.js';
import { HydratedDocument } from 'mongoose';

export class BookingService {

    // #region Get All Bookings

    // Fetch all bookings from the database
    async getAllBookings(): Promise<IBooking[]> {
        return await BookingModel.find().lean(); 
    } // Use 'lean()' to return a plain JavaScript object instead of a Mongoose document

    // #endregion

    // #region Get Booking By ID

    // Fetch a single booking by its ID
    async getBookingById(id: string): Promise<IBooking | null> {
        return await BookingModel.findById(id).lean();
    }

    // #endregion

    // #region Create Booking

    // Create a new booking in the database
    async createBooking(bookingData: IBooking): Promise<HydratedDocument<IBooking>> {
        const customer = await CustomerModel.findById(bookingData.customerId);

        // Validate that the customer exists
        if (!customer) {
            throw new Error('Customer not found');
        }

        // Validate that the equipment exists
        const equipment = await EquipmentModel.findById(bookingData.equipmentId);

        if (!equipment) {
            throw new Error('Equipment not found');
        }

        // Validate that the end date is after the start date
        if (bookingData.endDate <= bookingData.startDate) {
            throw new Error('End date must be after start date');
        }

        // Check for overlapping bookings for the same equipment
        const overlappingBooking = await BookingModel.findOne({
            equipmentId: bookingData.equipmentId,
            status: { $nin: ['Cancelled', 'Completed'] },
            startDate: { $lt: bookingData.endDate },
            endDate: { $gt: bookingData.startDate }
        });

        // If an overlapping booking is found, throw an error indicating that 
        // the equipment is already booked for the selected dates
        if (overlappingBooking) {
            throw new Error('Equipment is already booked for the selected dates');
        }

        // Check for maintenance records that overlap with the booking dates
        const maintenanceRecord = await MaintenanceModel.findOne({
            equipmentId: bookingData.equipmentId,
            startDate: { $lt: bookingData.endDate },
            endDate: { $gt: bookingData.startDate }
        });

        // If a maintenance record is found, throw an error indicating that 
        // the equipment is under maintenance for the selected dates
        if (maintenanceRecord) {
            throw new Error('Equipment is under maintenance for the selected dates');
        }

        // Calculate the total cost based on the daily rate and rental duration
        const dailyRate = equipment.dailyRate;

        // JavaScript stores a Date internally as milliseconds
        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        // Calculate the number of rental days, rounding up to ensure partial days are counted as full days
        const rentalDays = Math.ceil(
            (bookingData.endDate.getTime() - bookingData.startDate.getTime()) /
            millisecondsPerDay
        );

        // Calculate the total cost for the booking
        const totalCost = rentalDays * dailyRate;

        // Create a new booking document with the calculated daily rate and total cost
        const booking = new BookingModel({
            ...bookingData,
            dailyRate,
            totalCost
        });

        // Save the new booking to the database and return the saved document
        return await booking.save();
    }

    // #endregion

    // #region Update Booking

    // Update an existing booking by its ID
    async updateBooking(
        id: string,
        bookingData: Partial<IBooking>
    ): Promise<IBooking | null> {

        // Fetch the existing booking from the database using the provided ID
        const existingBooking = await BookingModel.findById(id);

        // If the booking does not exist, return null to indicate that no update can be performed
        if (!existingBooking) {
            return null;
        }

        // Use the provided booking data to update the existing booking, 
        // falling back to the existing values if not provided
        const customerId = bookingData.customerId ?? existingBooking.customerId;
        const equipmentId = bookingData.equipmentId ?? existingBooking.equipmentId;
        const startDate = bookingData.startDate ?? existingBooking.startDate;
        const endDate = bookingData.endDate ?? existingBooking.endDate;

        // Validate that the customer exists
        const customer = await CustomerModel.findById(customerId);

        // If the customer does not exist, throw an error indicating that the customer was not found
        if (!customer) {
            throw new Error('Customer not found');
        }

        // Validate that the equipment exists
        const equipment = await EquipmentModel.findById(equipmentId);

        // If the equipment does not exist, throw an error indicating that the equipment was not found
        if (!equipment) {
            throw new Error('Equipment not found');
        }

        // Validate that the end date is after the start date
        if (endDate <= startDate) {
            throw new Error('End date must be after start date');
        }

        // Check for overlapping bookings for the same equipment, excluding the current booking being updated
        const overlappingBooking = await BookingModel.findOne({
            _id: { $ne: id },
            equipmentId,
            status: { $nin: ['Cancelled', 'Completed'] },
            startDate: { $lt: endDate },
            endDate: { $gt: startDate }
        });

        // If an overlapping booking is found, throw an error indicating that 
        // the equipment is already booked for the selected dates
        if (overlappingBooking) {
            throw new Error('Equipment is already booked for the selected dates');
        }

        // Check for maintenance records that overlap with the booking dates, excluding the current booking being updated
        const maintenanceRecord = await MaintenanceModel.findOne({
            equipmentId,
            startDate: { $lt: endDate },
            endDate: { $gt: startDate }
        });

        // If a maintenance record is found, throw an error indicating that
        // the equipment is under maintenance for the selected dates
        if (maintenanceRecord) {
            throw new Error('Equipment is under maintenance for the selected dates');
        }

        // Calculate the total cost based on the daily rate and rental duration
        const dailyRate = equipment.dailyRate;

        // JavaScript stores a Date internally as milliseconds
        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        // Calculate the number of rental days, rounding up to ensure partial days are counted as full days
        const rentalDays = Math.ceil(
            (endDate.getTime() - startDate.getTime()) /
            millisecondsPerDay
        );

        // Calculate the total cost for the booking
        const totalCost = rentalDays * dailyRate;

        // Update the existing booking in the database with the new data and return the updated document
        const updatedBooking = await BookingModel.findByIdAndUpdate(
            id,
            {
                ...bookingData,
                customerId,
                equipmentId,
                startDate,
                endDate,
                dailyRate,
                totalCost
            },
            { returnDocument: 'after' }
        ).lean(); 

        // Return the updated booking document, or null if the update failed
        return updatedBooking;
    }

    // #endregion

    // #region Delete Booking

    // Delete a booking by its ID
    async deleteBooking(id: string): Promise<IBooking | null> {
        return await BookingModel.findByIdAndDelete(id).lean();
    }

    // #endregion
}