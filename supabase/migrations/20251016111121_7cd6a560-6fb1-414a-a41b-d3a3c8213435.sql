-- Add wallet column to profiles table
ALTER TABLE public.profiles
ADD COLUMN wallet_balance numeric DEFAULT 1000.00 NOT NULL;

-- Add comment to explain the column
COMMENT ON COLUMN public.profiles.wallet_balance IS 'User wallet balance for booking payments';