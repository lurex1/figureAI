import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const { session, subscription, refreshSubscription } = useAuth();
  const { toast } = useToast();

  const startCheckout = async () => {
    if (!session?.access_token) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please sign in to upgrade your subscription.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast({
        variant: 'destructive',
        title: 'Checkout Failed',
        description: 'Unable to start checkout. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!session?.access_token) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please sign in to manage your subscription.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Portal error:', err);
      toast({
        variant: 'destructive',
        title: 'Portal Access Failed',
        description: 'Unable to open subscription portal. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    subscription,
    isLoading,
    startCheckout,
    openCustomerPortal,
    refreshSubscription,
    isPro: subscription.plan === 'pro' && subscription.subscribed,
  };
}
