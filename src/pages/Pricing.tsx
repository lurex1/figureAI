import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useToast } from "@/hooks/use-toast";

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
  {
    name: "Studio Pro",
    price: "$99",
    description: "For professionals",
    features: [
      "20 high-quality 3D models",
      "Fastest processing",
      "Full commercial rights",
      "All base options",
      "Priority support",
      "API access",
    ],
    cta: "Go Pro",
    popular: false,
  },
];

export default function PricingPage() {
  const { toast } = useToast();

  const handlePurchase = (planName: string) => {
    toast({
      title: "Coming Soon",
      description: `${planName} plan will be available after backend integration.`,
    });
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
              Simple, Fair <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              No subscriptions. No hidden fees. Pay only for what you create.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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
                      Most Popular
                    </div>
                  </div>
                )}

                <GlassCard
                  gradient={plan.popular}
                  className={`h-full flex flex-col ${plan.popular ? "border-primary/30" : ""}`}
                >
                  <div className="text-center mb-6">
                    <h3 className="font-mono text-lg font-semibold mb-2">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-3xl font-mono font-bold">{plan.price}</span>
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
                    onClick={() => handlePurchase(plan.name)}
                  >
                    {plan.cta}
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </div>

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
                  q: "What file formats are included?",
                  a: "All paid plans include both STL and OBJ files, plus a preview PNG. These are compatible with all major 3D printers.",
                },
                {
                  q: "Can I use my figurine commercially?",
                  a: "The Creator Pack and Studio Pro plans include commercial licensing rights. Single Model is for personal use only.",
                },
                {
                  q: "How long does generation take?",
                  a: "Most models are generated within 30-60 seconds. Priority processing in higher tier plans reduces this to under 15 seconds.",
                },
                {
                  q: "What makes a good source photo?",
                  a: "A clear, front-facing photo with good lighting works best. We recommend photos where the subject fills most of the frame.",
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
