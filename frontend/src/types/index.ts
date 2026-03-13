/*
the index file contains all the types used in the application
*/

// Import the types from the auth
export type { LoginPayload, RegisterPayload, TokenResponse, User } from './auth';

// Import the types from the booking
export type { Booking, BookingCreatePayload } from './booking';


// Import the types from the review
export type { Review, ReviewCreatePayload } from './review';

// Import the types from the room
export type { 
    Building,
    Equipment,
    Room,
    RoomPayload,
    BuildingPayload,
    EquipmentPayload
} from './room';
