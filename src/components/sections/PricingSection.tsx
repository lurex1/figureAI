import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

const plans = [
  {
    name: "Free Preview",
    price: "$0",
    description: "Try before you buy",
    features: [
      "1 free preview generation",
      "Low-res PNG preview",
      "Watermarked output",
      "Basic style options",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Single Model",
    price: "$9",
    description: "One-time purchase",
    features: [
      "1 high-quality 3D model",
      "STL + OBJ download",
      "All 4 style options",
      "Base plate included",
      "Print-ready files",
    ],
    cta: "Buy Now",
    popular: true,
  },
  {
    name: "Creator Pack",
    price: "$29",
    description: "Best for enthusiasts",
    features: [
      "5 high-quality 3D models",
      "Priority processing",
      "Commercial license",
      "Custom base options",
      "Email support",
    ],
    cta: "Get Pack",
    popular: false,
  },
];

export function PricingSection() {
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
            No subscriptions. Pay only for what you create.
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
                    Most Popular
                  </div>
                </div>
              )}
              
              <GlassCard 
                gradient={plan.popular}
                className={`h-full ${plan.popular ? 'scale-105 border-primary/30' : ''}`}
              >
                <div className="text-center mb-6">
                  <h3 className="font-mono text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-mono font-bold">{plan.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
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
