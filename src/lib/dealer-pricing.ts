import type {
  HearthOption,
  Product,
  ProductFinish,
} from "@/lib/data/products";

export type DealerPricingTier =
  | "approved"
  | "stocking"
  | "program"
  | "national";

export const DEALER_TIER_LABELS: Record<DealerPricingTier, string> = {
  approved: "Approved Dealer",
  stocking: "Stocking Dealer",
  program: "Program Dealer",
  national: "National Account",
};

export const DEALER_TIER_DISCOUNT_BPS: Record<DealerPricingTier, number> = {
  approved: 0,
  stocking: 500,
  program: 800,
  national: 1000,
};

export const DEALER_FINISH_ADJUSTMENTS: Record<ProductFinish, number> = {
  "Paint Grade": 0,
  Smooth: 8500,
  "Stone World": 18500,
};

export const MSRP_FINISH_ADJUSTMENTS: Record<ProductFinish, number> = {
  "Paint Grade": 0,
  Smooth: 17500,
  "Stone World": 37500,
};

export const DEALER_HEARTH_ADJUSTMENTS: Record<HearthOption, number> = {
  "No Hearth": 0,
  "Square Edge Hearth": 29500,
  "Ogee Edge Hearth": 39500,
};

export const MSRP_HEARTH_ADJUSTMENTS: Record<HearthOption, number> = {
  "No Hearth": 0,
  "Square Edge Hearth": 59500,
  "Ogee Edge Hearth": 79500,
};

export function getTierDiscountBps(
  tier: DealerPricingTier = "approved",
  customDiscountBps?: number | null
) {
  if (typeof customDiscountBps === "number") {
    return Math.max(0, Math.min(customDiscountBps, 1500));
  }
  return DEALER_TIER_DISCOUNT_BPS[tier];
}

export function applyDealerDiscount(priceCents: number, discountBps: number) {
  return Math.round((priceCents * (10000 - discountBps)) / 10000);
}

export function getDealerConfiguredPrice(
  product: Product,
  finish: ProductFinish,
  hearth: HearthOption,
  discountBps = 0
) {
  const standardNet =
    product.priceCents +
    DEALER_FINISH_ADJUSTMENTS[finish] +
    DEALER_HEARTH_ADJUSTMENTS[hearth];
  return applyDealerDiscount(standardNet, discountBps);
}

export function getConfiguredMsrp(
  product: Product,
  finish: ProductFinish,
  hearth: HearthOption
) {
  return (
    product.msrpCents +
    MSRP_FINISH_ADJUSTMENTS[finish] +
    MSRP_HEARTH_ADJUSTMENTS[hearth]
  );
}

