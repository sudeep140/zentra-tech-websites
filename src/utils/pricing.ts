/**
 * Pure calculation logic for pricing, discounts, and custom estimates.
 */

export interface PriceCalculation {
  basePrice: number;
  finalPrice: number;
  discountAmount: number;
  discountPercentage: number;
  billingCycle: 'monthly' | 'yearly';
  formattedPrice: string;
}

export function calculateTierPrice(
  monthlyPrice: number,
  billingCycle: 'monthly' | 'yearly',
  discountPercentage: number = 20
): PriceCalculation {
  if (monthlyPrice < 0) {
    throw new Error('Price cannot be negative');
  }

  if (billingCycle === 'yearly') {
    const discountAmount = Math.round(monthlyPrice * (discountPercentage / 100));
    const discountedMonthly = monthlyPrice - discountAmount;
    const finalYearlyPerMonth = discountedMonthly;
    return {
      basePrice: monthlyPrice,
      finalPrice: finalYearlyPerMonth,
      discountAmount,
      discountPercentage,
      billingCycle: 'yearly',
      formattedPrice: `$${finalYearlyPerMonth.toLocaleString()}`,
    };
  }

  return {
    basePrice: monthlyPrice,
    finalPrice: monthlyPrice,
    discountAmount: 0,
    discountPercentage: 0,
    billingCycle: 'monthly',
    formattedPrice: `$${monthlyPrice.toLocaleString()}`,
  };
}

export function estimateProjectBudget(
  services: string[],
  scopeTier: 'starter' | 'pro' | 'enterprise',
  urgentDelivery: boolean = false
): number {
  const baseRates: Record<string, number> = {
    starter: 1499,
    pro: 2499,
    enterprise: 4999,
  };

  let total = baseRates[scopeTier] || 999;
  
  // Extra services add incremental cost
  if (services.length > 1) {
    total += (services.length - 1) * 600;
  }

  // Rush turnaround surcharge 25%
  if (urgentDelivery) {
    total = Math.round(total * 1.25);
  }

  return total;
}
