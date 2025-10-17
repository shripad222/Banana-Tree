-- Add parking_started_at column to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS parking_started_at timestamp with time zone;