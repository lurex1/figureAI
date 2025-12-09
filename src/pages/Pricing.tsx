import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Free",
    price: "0 zł",
    period: "",
    description: "Try before you buy",
    features: [
      "1 free preview generation",
      "Low-res PNG preview",
      "Watermarked output",
      "Basic style options",
    ],
    cta: "Current Plan",
    planId: "free",
    popular: false,
  },
  {
    name: "Pro",
    price: "29.99 zł",
    period: "/month",
    description: "Unlimited creativity",
    features: [
      "Unlimited 3D generations",
      "Priority processing",
      "All 4 style options",
      "STL + OBJ downloads",
      "No watermarks",
      "Commercial license",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    planId: "pro",
    popular: true,
  },
];

export default function PricingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription, isLoading, startCheckout, openCustomerPortal, refreshSubscription, isPro } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout === "success") {
      toast({
        title: "Payment Successful!",
        description: "Welcome to FigureAI Pro! Your subscription is now active.",
      });
      refreshSubscription();
    } else if (checkout === "canceled") {
      toast({
        variant: "destructive",
        title: "Checkout Canceled",
        description: "Your subscription was not completed.",
      });
    }
  }, [searchParams]);

  const handlePlanAction = (planId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (planId === "pro" && !isPro) {
      startCheckout();
    } else if (isPro) {
      openCustomerPortal();
    }
  };

  const getButtonText = (planId: string, defaultCta: string) => {
    if (!user) return "Sign In to Upgrade";
    if (planId === "free" && !isPro) return "Current Plan";
    if (planId === "free" && isPro) return "Downgrade";
    if (planId === "pro" && isPro) return "Manage Subscription";
    return defaultCta;
  };

  const isCurrentPlan = (planId: string) => {
    if (!user) return false;
    return planId === subscription.plan;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="font-mono text-3xl md:text-4xl font-bold mb-4">
              Simple <span className="gradient-text">Subscription</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Unlock unlimited 3D figurine generation with Pro.
            </p>

            {isPro && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30"
              >
                <Crown className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">You're a Pro member!</span>
              </motion.div>
            )}
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      <Zap className="w-3 h-3" />
                      Recommended
                    </div>
                  </div>
                )}

                {isCurrentPlan(plan.planId) && (
                  <div className="absolute -top-4 right-4 z-10">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                      Your Plan
                    </div>
                  </div>
                )}

                <GlassCard
                  gradient={plan.popular}
                  className={`h-full flex flex-col ${plan.popular ? "border-primary/30" : ""} ${isCurrentPlan(plan.planId) ? "ring-2 ring-primary/50" : ""}`}
                >
                  <div className="text-center mb-6">
                    <h3 className="font-mono text-xl font-semibold mb-2">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-mono font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.popular ? "hero" : "outline"}
                    className="w-full"
                    onClick={() => handlePlanAction(plan.planId)}
                    disabled={isLoading || (isCurrentPlan(plan.planId) && plan.planId === "free")}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      getButtonText(plan.planId, plan.cta)
                    )}
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Subscription Status for logged in users */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-md mx-auto mt-12"
            >
              <GlassCard className="p-6">
                <h3 className="font-mono font-semibold mb-4 text-center">Subscription Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="font-medium capitalize">{subscription.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`font-medium capitalize ${subscription.status === 'active' ? 'text-primary' : 'text-muted-foreground'}`}>
                      {subscription.status}
                    </span>
                  </div>
                  {subscription.subscriptionEnd && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Renews:</span>
                      <span className="font-medium">
                        {new Date(subscription.subscriptionEnd).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {subscription.cancelAtPeriodEnd && (
                    <p className="text-xs text-destructive mt-2">
                      Your subscription will be canceled at the end of the billing period.
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={refreshSubscription}
                  size="sm"
                >
                  Refresh Status
                </Button>
              </GlassCard>
            </motion.div>
          )}

          {/* Test Mode Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl mx-auto mt-12"
          >
            <GlassCard className="p-6 border-primary/20">
              <h3 className="font-mono font-semibold mb-3 text-center text-primary">
                Test Mode Active
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="text-center">Use these test cards for Stripe checkout:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                  <div className="p-2 rounded bg-card/50">
                    <p className="font-mono text-xs">Success: <code className="text-primary">4242 4242 4242 4242</code></p>
                  </div>
                  <div className="p-2 rounded bg-card/50">
                    <p className="font-mono text-xs">Decline: <code className="text-destructive">4000 0000 0000 0002</code></p>
                  </div>
                </div>
                <p className="text-xs text-center mt-3">
                  Use any future expiry date and any 3-digit CVC.
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-3xl mx-auto mt-24"
          >
            <h2 className="font-mono text-2xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: "How do I cancel my subscription?",
                  a: "You can cancel anytime from the Manage Subscription button. You'll retain access until the end of your billing period.",
                },
                {
                  q: "What payment methods are accepted?",
                  a: "We accept all major credit cards through Stripe's secure payment system.",
                },
                {
                  q: "Can I get a refund?",
                  a: "Yes, contact our support within 7 days of purchase for a full refund.",
                },
                {
                  q: "Do I keep my generated models if I cancel?",
                  a: "Yes! All models you've generated remain accessible in your dashboard forever.",
                },
              ].map((faq, i) => (
                <GlassCard key={i} className="p-5">
                  <h3 className="font-medium mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
