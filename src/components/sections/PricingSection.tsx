import { motion } from "framer-motion";
import { Check, Zap, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { SUBSCRIPTION_TIERS } from "@/lib/subscription-tiers";

const plans = [
  {
    name: SUBSCRIPTION_TIERS.free.name,
    price: "$0",
    period: "",
    description: "Start creating for free",
    features: SUBSCRIPTION_TIERS.free.features,
    cta: "Get Started",
    popular: false,
    icon: null,
  },
  {
    name: SUBSCRIPTION_TIERS.pro.name,
    price: `$${SUBSCRIPTION_TIERS.pro.price}`,
    period: "/mo",
    description: "Best for single models",
    features: SUBSCRIPTION_TIERS.pro.features,
    cta: "Get Pro",
    popular: true,
    icon: Zap,
  },
  {
    name: SUBSCRIPTION_TIERS.creator.name,
    price: `$${SUBSCRIPTION_TIERS.creator.price}`,
    period: "/mo",
    description: "Best for enthusiasts",
    features: SUBSCRIPTION_TIERS.creator.features,
    cta: "Get Creator",
    popular: false,
    icon: Sparkles,
  },
];

export function PricingSection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4">
            Simple <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Monthly subscriptions with credit-based generation.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
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
              
              <GlassCard 
                gradient={plan.popular}
                className={`h-full flex flex-col ${plan.popular ? 'scale-105 border-primary/30' : ''}`}
              >
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {plan.icon && <plan.icon className="w-5 h-5 text-primary" />}
                    <h3 className="font-mono text-xl font-semibold">{plan.name}</h3>
                  </div>
                  <div className="mb-2">
                    <span className="text-4xl font-mono font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.popular ? "hero" : "outline"} 
                  className="w-full"
                  size="lg"
                  onClick={() => navigate("/pricing")}
                >
                  {plan.cta}
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
