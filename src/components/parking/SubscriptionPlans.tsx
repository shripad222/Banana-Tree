import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Check, Crown, GraduationCap, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  duration_months: number;
  price: number;
  benefits: string;
  discount_percentage: number;
  unlimited_parking: boolean;
}

interface UserSubscription {
  id: string;
  plan_name: string;
  start_date: string;
  end_date: string;
  status: string;
}

export const SubscriptionPlans = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<UserSubscription | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch plans
      const { data: plansData, error: plansError } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true });

      if (plansError) throw plansError;
      setPlans(plansData || []);

      // Fetch active subscription
      const { data: subData, error: subError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .maybeSingle();

      if (subError) throw subError;
      setActiveSubscription(subData);

      // Fetch wallet balance
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      setWalletBalance(profileData?.wallet_balance || 0);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subscription plans',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const purchaseSubscription = async (plan: SubscriptionPlan) => {
    if (!user) return;

    if (walletBalance < plan.price) {
      toast({
        title: 'Insufficient Balance',
        description: `You need ₹${plan.price} but only have ₹${walletBalance.toFixed(2)} in your wallet`,
        variant: 'destructive',
      });
      return;
    }

    setPurchasing(plan.id);
    try {
      // Deduct from wallet
      const newBalance = walletBalance - plan.price;
      const { error: walletError } = await supabase
        .from('profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', user.id);

      if (walletError) throw walletError;

      // Create subscription
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.duration_months);

      const { error: subError } = await supabase.from('user_subscriptions').insert({
        user_id: user.id,
        plan_id: plan.id,
        plan_name: plan.name,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        status: 'active',
        price_paid: plan.price,
      });

      if (subError) throw subError;

      toast({
        title: 'Subscription Activated!',
        description: `Your ${plan.name} is now active`,
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: 'Purchase Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setPurchasing(null);
    }
  };

  const getPlanIcon = (planName: string) => {
    if (planName.includes('Student')) return GraduationCap;
    if (planName.includes('Annual')) return Crown;
    if (planName.includes('Quarterly')) return Zap;
    return Calendar;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Subscription Plans</h2>
        {activeSubscription && (
          <Badge variant="default" className="gap-2">
            <Check className="w-4 h-4" />
            Active: {activeSubscription.plan_name}
          </Badge>
        )}
      </div>

      {activeSubscription && (
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{activeSubscription.plan_name}</h3>
              <p className="text-sm text-muted-foreground">
                Valid until {new Date(activeSubscription.end_date).toLocaleDateString()}
              </p>
            </div>
            <Badge variant="default">Active</Badge>
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => {
          const Icon = getPlanIcon(plan.name);
          const isActive = activeSubscription?.plan_name === plan.name;
          
          return (
            <Card key={plan.id} className={`p-6 ${isActive ? 'border-primary border-2' : ''}`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Icon className="w-8 h-8 text-primary" />
                  {plan.unlimited_parking && (
                    <Badge variant="secondary">Unlimited</Badge>
                  )}
                  {plan.discount_percentage > 0 && (
                    <Badge variant="secondary">{plan.discount_percentage}% Off</Badge>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-2xl font-bold text-primary mt-2">₹{plan.price}</p>
                  <p className="text-sm text-muted-foreground">
                    for {plan.duration_months} month{plan.duration_months > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{plan.benefits}</p>
                </div>

                <Button
                  className="w-full"
                  onClick={() => purchaseSubscription(plan)}
                  disabled={isActive || purchasing === plan.id || walletBalance < plan.price}
                >
                  {isActive ? 'Current Plan' : purchasing === plan.id ? 'Processing...' : 'Subscribe'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};