import { Router } from 'express';
import { BookingController } from '../controllers/bookings.js';

// Create a new router instance for booking routes
const router = Router();
// Create an instance of the BookingController
const bookingController = new BookingController();

// Define the routes for booking operations
router.get('/', bookingController.getBookings);
router.get('/:id', bookingController.getBookingById);
router.post('/', bookingController.createBooking);
router.put('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

export default router;