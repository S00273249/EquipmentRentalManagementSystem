import { Router } from 'express';
import { BookingController } from '../controllers/bookings.js';
import { authenticateKey } from '../middleware/authentication.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createBookingZSchema, updateBookingZSchema } from '../models/bookings.js';

// Create a new router instance for booking routes
const router = Router();
// Create an instance of the BookingController
const bookingController = new BookingController();

// Define the routes for booking operations
router.get('/', authenticateKey, bookingController.getBookings);
router.get('/:id', authenticateKey, bookingController.getBookingById);
router.post('/', authenticateKey, validate(createBookingZSchema), bookingController.createBooking);
router.put('/:id', authenticateKey, validate(updateBookingZSchema), bookingController.updateBooking);
router.delete('/:id', authenticateKey, bookingController.deleteBooking);

export default router;