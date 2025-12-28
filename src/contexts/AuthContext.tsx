import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { SubscriptionPlan } from '@/lib/subscription-tiers';

interface SubscriptionStatus {
  subscribed: boolean;
  plan: SubscriptionPlan;
  status: 'active' | 'inactive' | 'canceled' | 'past_due';
  subscriptionEnd: string | null;
  cancelAtPeriodEnd: boolean;
  creditsBalance: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscription: SubscriptionStatus;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const defaultSubscription: SubscriptionStatus = {
  subscribed: false,
  plan: 'free',
  status: 'inactive',
  subscriptionEnd: null,
  cancelAtPeriodEnd: false,
  creditsBalance: 15,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionStatus>(defaultSubscription);

  const refreshSubscription = async () => {
    if (!session?.access_token) {
      setSubscription(defaultSubscription);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }

      setSubscription({
        subscribed: data.subscribed || false,
        plan: data.plan || 'free',
        status: data.status || 'inactive',
        subscriptionEnd: data.subscription_end || null,
        cancelAtPeriodEnd: data.cancel_at_period_end || false,
        creditsBalance: data.credits_balance ?? 15,
      });
    } catch (err) {
      console.error('Failed to check subscription:', err);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Defer subscription check
        if (session?.user) {
          setTimeout(() => {
            refreshSubscription();
          }, 0);
        } else {
          setSubscription(defaultSubscription);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        setTimeout(() => {
          refreshSubscription();
        }, 0);
      }
    });

    return () => authSubscription.unsubscribe();
  }, []);

  // Refresh subscription every minute
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(refreshSubscription, 60000);
    return () => clearInterval(interval);
  }, [session]);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error: error as Error | null };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSubscription(defaultSubscription);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      subscription,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      refreshSubscription,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
