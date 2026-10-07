import { Request, Response } from 'express';
import { BookingService } from '../services/bookings.js';

const bookingService = new BookingService();

export class BookingController {

    // #region Get All Bookings

    // Get all bookings
    getBookings = async (req: Request, res: Response): Promise<void> => {
        try {

            // Extract query parameters for filtering bookings
            const bookings = await bookingService.getAllBookings({
                customerId: typeof req.query.customerId === 'string'
                    ? req.query.customerId
                    : undefined,
                equipmentId: typeof req.query.equipmentId === 'string'
                    ? req.query.equipmentId
                    : undefined,
                status: typeof req.query.status === 'string'
                    ? req.query.status
                    : undefined
            });

            // Return the filtered bookings as a JSON response
            res.status(200).json(bookings); 

        } catch (error) {

            res.status(500).json({
                message: 'Error fetching bookings',
                error
            });
        }
    };

    // #endregion

    // #region Get Booking By ID

    // Get a booking by ID
    getBookingById = async (req: Request, res: Response): Promise<void> => {
        try {

            // Extract the booking ID from the request parameters, handling the case where it might be an array
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const booking = await bookingService.getBookingById(id);

            // If the booking is not found, return a 404 response
            if (!booking) {
                res.status(404).json({
                    message: 'Booking not found'
                });
                return;
            }

            // Return the booking as a JSON response
            res.status(200).json(booking);

        } catch (error) {

            // Handle any errors that occur during the fetching process
            res.status(500).json({
                message: 'Error fetching booking',
                error
            });
        }
    };

    // #endregion

    // #region Create Booking

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

    // #endregion

    // #region Update Booking

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

    // #endregion

    // #region Delete Booking

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

    // #endregion

}