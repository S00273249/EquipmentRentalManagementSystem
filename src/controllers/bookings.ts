import { Request, Response } from 'express';
import { BookingService } from '../services/bookings.js';

const bookingService = new BookingService();

export class BookingController {

    // Get all bookings
    getBookings = async (_req: Request, res: Response): Promise<void> => {
        try {

            const bookings = await bookingService.getAllBookings();
            res.status(200).json(bookings);

        } catch (error) {

            res.status(500).json({
                message: 'Error fetching bookings',
                error
            });
        }
    };

    // Get a booking by ID
    getBookingById = async (req: Request, res: Response): Promise<void> => {
        try {

            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const booking = await bookingService.getBookingById(id);

            if (!booking) {
                res.status(404).json({
                    message: 'Booking not found'
                });
                return;
            }

            res.status(200).json(booking);

        } catch (error) {

            res.status(500).json({
                message: 'Error fetching booking',
                error
            });
        }
    };

    // Create a new booking
    createBooking = async (req: Request, res: Response): Promise<void> => {
        try {

            const newBooking = await bookingService.createBooking(req.body);
            res.status(201).json(newBooking);

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';

            res.status(400).json({
                message
            });
        }
    };

    // Update an existing booking
    updateBooking = async (req: Request, res: Response): Promise<void> => {
        try {

            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const updatedBooking = await bookingService.updateBooking(id, req.body);

            if (!updatedBooking) {
                res.status(404).json({
                    message: 'Booking not found'
                });
                return;
            }

            res.status(200).json(updatedBooking);

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';

            res.status(400).json({
                message
            });
        }
    };

    // Delete a booking by ID
    deleteBooking = async (req: Request, res: Response): Promise<void> => {
        try {

            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const booking = await bookingService.deleteBooking(id);

            if (!booking) {
                res.status(404).json({
                    message: 'Booking not found'
                });
                return;
            }

            res.status(200).json(booking);

        } catch (error) {

            res.status(500).json({
                message: 'Error deleting booking',
                error
            });
        }
    };

}