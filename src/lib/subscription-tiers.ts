// Subscription tiers configuration
// Maps Stripe product/price IDs to plan features

export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    priceId: null,
    productId: null,
    credits: 15,
    price: 0,
    features: [
      '15 credits',
      'Low-res PNG preview',
      'Watermarked output',
      'Basic style options',
    ],
  },
  pro: {
    name: 'Pro',
    priceId: 'price_1SjEkV72P9RKFpwCL1IT8GKM',
    productId: 'prod_TgbyCn0X5fiSUa',
    credits: 200,
    price: 9,
    features: [
      '200 credits/month',
      'STL + OBJ download',
      'All 4 style options',
      'Base plate included',
      'Print-ready files',
    ],
  },
  creator: {
    name: 'Creator Pack',
    priceId: 'price_1SjEki72P9RKFpwC9qKVF2cb',
    productId: 'prod_TgbyxWTWCj1dOv',
    credits: 800,
    price: 29,
    features: [
      '800 credits/month',
      'Priority processing',
      'Commercial license',
      'Custom base options',
      'Email support',
    ],
  },
} as const;

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_TIERS;

export function getPlanByProductId(productId: string | null): SubscriptionPlan {
  if (!productId) return 'free';
  
  for (const [plan, tier] of Object.entries(SUBSCRIPTION_TIERS)) {
    if (tier.productId === productId) {
      return plan as SubscriptionPlan;
    }
  }
  
  return 'free';
}

export function getPlanByPriceId(priceId: string | null): SubscriptionPlan {
  if (!priceId) return 'free';
  
  for (const [plan, tier] of Object.entries(SUBSCRIPTION_TIERS)) {
    if (tier.priceId === priceId) {
      return plan as SubscriptionPlan;
    }
  }
  
  return 'free';
}

export function getCreditsForPlan(plan: SubscriptionPlan): number {
  return SUBSCRIPTION_TIERS[plan]?.credits ?? 15;
}
