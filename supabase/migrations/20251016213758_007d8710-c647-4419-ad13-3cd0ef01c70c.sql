-- Create subscription plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  duration_months integer NOT NULL,
  price numeric NOT NULL,
  benefits text NOT NULL,
  discount_percentage integer DEFAULT 0,
  unlimited_parking boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_id uuid REFERENCES public.subscription_plans(id),
  plan_name text NOT NULL,
  start_date timestamp with time zone NOT NULL DEFAULT now(),
  end_date timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'active',
  price_paid numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscription_plans (public read)
CREATE POLICY "Anyone can view subscription plans"
ON public.subscription_plans
FOR SELECT
USING (true);

-- RLS policies for user_subscriptions
CREATE POLICY "Users can view their own subscriptions"
ON public.user_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions"
ON public.user_subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Managers can view all subscriptions"
ON public.user_subscriptions
FOR SELECT
USING (has_role(auth.uid(), 'manager'::app_role));

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, duration_months, price, benefits, discount_percentage, unlimited_parking) VALUES
('Monthly Pass', 1, 999, 'Unlimited parking for 30 days across all zones', 0, true),
('Quarterly Pass', 3, 2499, 'Unlimited parking for 90 days across all zones + Priority booking', 0, true),
('Annual Pass', 12, 7999, 'Unlimited parking for 365 days + Priority booking + EV charging included', 0, true),
('Student Monthly', 1, 599, '50% discount on all parking for 30 days', 50, false);