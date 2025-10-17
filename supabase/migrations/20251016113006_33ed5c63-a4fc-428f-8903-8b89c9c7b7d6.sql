-- Add vehicle information columns to bookings table
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS vehicle_type TEXT CHECK (vehicle_type IN ('2-wheeler', '4-wheeler')),
ADD COLUMN IF NOT EXISTS vehicle_size TEXT CHECK (vehicle_size IN ('small', 'medium', 'large')),
ADD COLUMN IF NOT EXISTS fuel_type TEXT CHECK (fuel_type IN ('ev', 'non-ev'));