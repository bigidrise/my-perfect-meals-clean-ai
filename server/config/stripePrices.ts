
import type { LookupKey } from "../../client/src/data/planSkus";

export const STRIPE_PRICE_IDS: Record<LookupKey, string> = {
  mpm_basic_monthly: process.env.STRIPE_PRICE_BASIC || "price_basic_PLACEHOLDER",
  mpm_premium_monthly: process.env.STRIPE_PRICE_PREMIUM || "price_premium_PLACEHOLDER",
  mpm_premium_beta_monthly: process.env.STRIPE_PRICE_BETA || "price_beta_PLACEHOLDER",
  mpm_ultimate_monthly: process.env.STRIPE_PRICE_ULTIMATE || "price_ultimate_PLACEHOLDER",
  mpm_family_base_monthly: process.env.STRIPE_PRICE_FAMILY_BASE || "price_1SGls4JC1cXhpBKwB141c6aZ",
  mpm_family_all_premium_monthly: process.env.STRIPE_PRICE_FAMILY_PREMIUM || "price_1SGltpJC1cXhpBKwKqTOSUnj",
  mpm_family_all_ultimate_monthly: process.env.STRIPE_PRICE_FAMILY_ULTIMATE || "price_1SGlx1JC1cXhpBKwIWjvKL8g",
  mpm_procare_monthly: process.env.STRIPE_PRICE_PROCARE || "price_procare_PLACEHOLDER",
};
