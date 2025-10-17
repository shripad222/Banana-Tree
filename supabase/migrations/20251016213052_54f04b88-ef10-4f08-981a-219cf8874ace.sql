-- Add vehicle registration number to bookings table
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS vehicle_registration_number text NOT NULL DEFAULT '';