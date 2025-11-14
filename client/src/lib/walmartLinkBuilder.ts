// client/src/lib/walmartLinkBuilder.ts
import type { ShoppingListItem } from "@/stores/shoppingListStore";

/**
 * Build a Walmart search URL from the current shopping list.
 * We:
 * - Normalize names to lowercase
 * - Trim whitespace
 * - Deduplicate names
 * - Join into a single query string
 *
 * Walmart will show relevant products, and the user can choose
 * delivery or pickup inside Walmart like they normally do.
 */
export function buildWalmartSearchURL(items: ShoppingListItem[]): string {
  const names = items
    .map(i => (i.name || "").trim().toLowerCase())
    .filter(Boolean);

  if (!names.length) {
    return "https://www.walmart.com/";
  }

  const uniqueNames = Array.from(new Set(names));

  // Example: "chicken breast greek yogurt olive oil"
  const query = encodeURIComponent(uniqueNames.join(" "));

  return `https://www.walmart.com/search?q=${query}`;
}
