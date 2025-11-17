
import type { LookupKey } from "../../client/src/data/planSkus";

export const STRIPE_PRICE_IDS: Record<LookupKey, string> = {
  mpm_basic_monthly: (process.env.STRIPE_PRICE_BASIC || "price_1RbboHJC1cXhpBKwCPogwN6b").trim(),
  mpm_premium_monthly: (process.env.STRIPE_PRICE_UPGRADE || "price_1SGlZUJC1cXhpBKwvCSYVTv3").trim(),
  mpm_premium_beta_monthly: (process.env.STRIPE_PRICE_UPGRADE_BETA || "price_1SGlgNJC1cXhpBKwZFm8rFBV").trim(),
  mpm_ultimate_monthly: (process.env.STRIPE_PRICE_ULTIMATE || "price_1SGlpXJC1cXhpBKw4NbT5eD1").trim(),
  mpm_family_base_monthly: (process.env.STRIPE_PRICE_FAMILY_BASE || "price_1SGls4JC1cXhpBKwB141c6aZ").trim(),
  mpm_family_all_premium_monthly: (process.env.STRIPE_PRICE_FAMILY_ALL_PREMIUM || "price_1SGltpJC1cXhpBKwKqTOSUnj").trim(),
  mpm_family_all_ultimate_monthly: (process.env.STRIPE_PRICE_FAMILY_ALL_ULTIMATE || "price_1SGlx1JC1cXhpBKwIWjvKL8g").trim(),
  mpm_procare_monthly: (process.env.STRIPE_PRICE_PROCARE || "price_1SGlyUJC1cXhpBKwiHogNQEF").trim(),
};
