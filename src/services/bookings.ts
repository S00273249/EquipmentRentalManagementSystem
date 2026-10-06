import { BookingModel, IBooking } from '../models/bookings.js';
import { HydratedDocument } from 'mongoose';

export class BookingService {

    // Fetch all bookings from the database
    async getAllBookings(): Promise<IBooking[]> {
        return await BookingModel.find().lean();
    }

    // Fetch a single booking by its ID
    async getBookingById(id: string): Promise<IBooking | null> {
        return await BookingModel.findById(id).lean();
    }

    // Create a new booking in the database
    async createBooking(bookingData: IBooking): Promise<HydratedDocument<IBooking>> {
        const booking = new BookingModel(bookingData);
        return await booking.save();
    }

    // Update an existing booking by its ID
    async updateBooking(id: string, bookingData: Partial<IBooking>): Promise<IBooking | null> {
        return await BookingModel.findByIdAndUpdate(
            id,
            bookingData,
            { returnDocument: 'after' }
        ).lean();
    }

    // Delete a booking by its ID
    async deleteBooking(id: string): Promise<IBooking | null> {
        return await BookingModel.findByIdAndDelete(id).lean();
    }
}