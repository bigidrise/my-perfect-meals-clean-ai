import { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ChevronDown, ChevronUp, Edit2, Home, Info, Plus, ShoppingCart, Trash2, X, Camera } from "lucide-react";
import { useLocation } from "wouter";
import TrashButton from "@/components/ui/TrashButton";
import { useShoppingListStore, ShoppingListItem } from "@/stores/shoppingListStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MACRO_SOURCES, getMacroSourceBySlug } from "@/lib/macroSourcesConfig";
import AddOtherItems from "@/components/AddOtherItems";
import { readOtherItems } from "@/stores/otherItemsStore";
import { buildWalmartSearchURL } from "@/lib/walmartLinkBuilder";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import BarcodeScanner from "@/components/BarcodeScanner";

export default function ShoppingListMasterView() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Extract "from" query parameter once on mount
  const [fromSlug, setFromSlug] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('from') || '';
  });

  // Subscribe to Zustand store
  const items = useShoppingListStore(s => s.items);
  const addItem = useShoppingListStore(s => s.addItem);
  const toggleItem = useShoppingListStore(s => s.toggleItem);
  const removeItem = useShoppingListStore(s => s.removeItem);
  const clearChecked = useShoppingListStore(s => s.clearChecked);
  const clearAll = useShoppingListStore(s => s.clearAll);
  const updateItem = useShoppingListStore(s => s.updateItem);
  const replaceItems = useShoppingListStore(s => s.replaceItems);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [quickAddText, setQuickAddText] = useState("");
  const [opts, setOpts] = useState({ 
    groupByAisle: false, 
    excludePantryStaples: false, 
    scopeByWeek: false, 
    rounding: 'friendly' as 'friendly' | 'none'
  });
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [purchasedOpen, setPurchasedOpen] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleBarcodeScanned = useCallback((barcode: string, productName: string) => {
    addItem({
      name: productName,
      quantity: 1,
      unit: '',
      notes: `Barcode: ${barcode}`
    });
    setScannerOpen(false);
    toast({ 
      title: "Item added", 
      description: `${productName} added to shopping list` 
    });
  }, [addItem, toast]);

  const toggleOpt = useCallback(<K extends keyof typeof opts>(key: K) => {
    setOpts(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const counts = useMemo(()=>({
    total: items.length,
    checked: items.filter(i=>i.isChecked).length
  }), [items]);

  const onInlineEdit = useCallback((id: string, field: "quantity"|"unit"|"name"|"notes") => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = field === "quantity" ? Number(e.target.value) : e.target.value;
      updateItem(id, field === "quantity" ? { quantity: Number.isFinite(v as number) ? (v as number) : 1 } : { [field]: v });
    };
  }, [updateItem]);

  const onClearChecked = useCallback(() => {
    if (!confirm("Clear all checked items?")) return;
    clearChecked();
  }, [clearChecked]);

  const onClearAll = useCallback(() => {
    if (!confirm("Clear entire shopping list?")) return;
    clearAll();
  }, [clearAll]);

  const onQuickAdd = useCallback(() => {
    if (!quickAddText.trim()) return;
    const name = quickAddText.trim();
    addItem({
      name,
      quantity: 1,
      unit: ''
    });
    setQuickAddText("");
    toast({ title: "Item added", description: name });
  }, [quickAddText, addItem, toast]);

  const onCopyToClipboard = useCallback(async () => {
    const mealItems = items
      .filter(i => !i.isChecked)
      .map(i => `• ${i.name}${i.quantity ? ` — ${i.quantity}${i.unit ? ' ' + i.unit : ''}` : ''}`);

    const otherItems = readOtherItems().items
      .filter(i => !i.checked)
      .map(i => `• ${i.brand ? i.brand + ' ' : ''}${i.name} — ${i.qty} ${i.unit} (${i.category})`);

    const sections = [];
    if (mealItems.length > 0) {
      sections.push("Meal Ingredients:\n" + mealItems.join("\n"));
    }
    if (otherItems.length > 0) {
      sections.push("Other Items:\n" + otherItems.join("\n"));
    }

    const text = sections.join("\n\n");
    const totalCount = mealItems.length + otherItems.length;

    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard", description: `${totalCount} items copied` });
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      toast({ title: "Copied to clipboard", description: `${totalCount} items copied` });
    }
  }, [items, toast]);

  const uncheckedItems = useMemo(() => items.filter(i => !i.isChecked), [items]);
  const checkedItems = useMemo(() => items.filter(i => i.isChecked), [items]);

  const handleShopAtWalmart = useCallback(() => {
    // Use only unchecked items – user hasn't bought these yet
    if (uncheckedItems.length === 0) {
      toast({
        title: "No items to shop",
        description: "Add items to your shopping list before sending to Walmart."
      });
      return;
    }

    const url = buildWalmartSearchURL(uncheckedItems);

    try {
      window.open(url, "_blank", "noopener,noreferrer");
      toast({
        title: "Opening Walmart",
        description: "Your shopping list is being sent to Walmart search."
      });
    } catch (err) {
      console.error("Failed to open Walmart", err);
      toast({
        title: "Unable to open Walmart",
        description: "Please check your popup blocker or try again."
      });
    }
  }, [uncheckedItems, toast]);

  const groupedUnchecked = useMemo(()=>{
    if (!opts.groupByAisle) return { All: uncheckedItems };
    const map: Record<string, ShoppingListItem[]> = {};
    for (const it of uncheckedItems) {
      const k = it.category || "Other";
      (map[k] ||= []).push(it);
    }
    return map;
  }, [uncheckedItems, opts.groupByAisle]);

  const groupedChecked = useMemo(()=>{
    if (!opts.groupByAisle) return { All: checkedItems };
    const map: Record<string, ShoppingListItem[]> = {};
    for (const it of checkedItems) {
      const k = it.category || "Other";
      (map[k] ||= []).push(it);
    }
    return map;
  }, [checkedItems, opts.groupByAisle]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-black/60 via-orange-600 to-black/80 pb-safe-nav"
    >
      <Button
        onClick={() => setLocation("/dashboard")}
        className="fixed top-4 left-4 z-50 bg-black/30 hover:bg-black/50 text-white rounded-2xl border border-white/10 backdrop-blur-none"
        size="sm"
        data-testid="button-back-dashboard"
      >
        <Home className="h-4 w-4" />
      </Button>

      <div className="container mx-auto p-4 max-w-4xl space-y-4 pt-16">
        {/* Header */}
        <div className="rounded-2xl bg-white/5 border border-white/20 p-4 backdrop-blur">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-white text-2xl font-md flex items-center gap-2">
                  <ShoppingCart className="h-6 w-6" />
                  Master Shopping List
                </h1>
                <Popover>
                  <PopoverTrigger asChild>
                    <button 
                      className="flex items-center justify-center w-8 h-8 rounded-xl bg-lime-700 hover:bg-lime-800 border-2 border-lime-600 text-white text-sm font-bold flash-border"
                      aria-label="How to use shopping list"
                      data-testid="shopping-list-info-button"
                    >
                      ?
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-black/90 border-orange-400/50 text-white">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-orange-400 flex items-center gap-2">
                        <Info className="h-4 w-4 text-orange-400" />
                        How to Use Your Shopping List
                      </h3>
                      <div className="text-sm text-white/90 space-y-2">
                        <p>
                          You can add items from your meal plans and other grocery lists here. Use this list to go grocery shopping—either check items off as you shop in-store or use one of the grocery delivery services.
                        </p>
                        <p>
                          Add your other groceries using the "Add Other Items" section so you have one complete list. Send your grocery list to a delivery service and have your groceries come right to your house.
                        </p>
                        <p>
                          <strong>Tips:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-white/80">
                          <li>Delete items you already have at home</li>
                          <li>Keep items you need to pick up on the list</li>
                          <li>Check items off as you buy them—they'll move to the bottom</li>
                        </ul>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="text-white/70 text-sm mt-1">
                {counts.total} items • {counts.checked} checked
              </div>
            </div>
          </div>

          {/* Quick Add */}
          <div className="mt-4 flex gap-2">
            <Input
              value={quickAddText}
              onChange={(e) => setQuickAddText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onQuickAdd()}
              placeholder="Quick add item..."
              className="bg-black/30 border-white/30 text-white placeholder:text-white/50"
              data-testid="input-quick-add"
            />
            <Button 
              onClick={onQuickAdd} 
              disabled={!quickAddText.trim()}
              className="bg-blue-600/20 border border-blue-400/30 text-blue-200 hover:bg-blue-600/30"
              data-testid="button-quick-add"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => setScannerOpen(true)}
              className="bg-black/60 border border-white/20 text-white hover:bg-black/70"
              data-testid="button-scan-barcode"
            >
              <Camera className="h-4 w-4 mr-2" />
              Barcode Scanner
            </Button>
          </div>

          {/* Options */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-white/80 text-sm" data-testid="option-group-by-aisle">
              <Checkbox 
                checked={opts.groupByAisle} 
                onCheckedChange={()=>toggleOpt("groupByAisle")} 
                className="h-3 w-3 border-white/40"
              />
              <span>Group by aisle</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm" data-testid="option-exclude-pantry">
              <Checkbox 
                checked={opts.excludePantryStaples} 
                onCheckedChange={()=>toggleOpt("excludePantryStaples")} 
                className="h-3 w-3 border-white/40"
              />
              <span>Exclude pantry staples</span>
            </div>
            <select
              value={opts.rounding}
              onChange={(e)=>setOpts({ ...opts, rounding: e.target.value as "none" | "friendly" })}
              className="bg-white/10 border border-white/20 text-white/90 text-sm rounded-md px-2 py-1"
              title="Rounding"
              data-testid="select-rounding"
            >
              <option value="friendly">Rounding: Friendly</option>
              <option value="none">Rounding: None</option>
            </select>
          </div>
        </div>

        {/* Add Other Items Section */}
        <AddOtherItems />

        {/* Access / Entitlement Card */}
        <div className="rounded-2xl border border-white/20 bg-black/60 text-white p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-lg font-semibold">Shopping Delivery</div>
              <div className="text-sm text-white/80">$29.99 / month</div>
            </div>

            {/* Locked state (show this by default) */}
            <button className="rounded-xl px-4 py-2 border border-white/30 bg-white/10 hover:bg-white/20 text-white transition-colors">
              Unlock Shopping Delivery
            </button>

            {/* Active state (swap the two elements when entitled) */}
            {/* <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-emerald-500/20 border border-emerald-300/40 text-emerald-200 text-xs">Active — Shopping Delivery</div>
            <button className="rounded-xl px-3 py-2 border border-white/30 bg-white/10 hover:bg-white/20 text-white text-sm">
              Manage Subscription
            </button> */}
          </div>
        </div>

        {/* Grocery Services Dropdown (Walmart only – Coming Soon) */}
        <details className="rounded-2xl border border-white/20 bg-black/60 text-white">
          <summary className="list-none cursor-pointer select-none px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors">
            <span className="text-sm font-semibold">Walmart Grocery (Coming Soon)</span>
            <ChevronDown className="h-4 w-4 text-white/70" />
          </summary>

          <div className="px-4 pb-4 pt-2 space-y-3">
            <div className="rounded-xl border border-white/20 bg-black/50 p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Walmart</div>
                <span className="text-[11px] rounded-full px-2 py-0.5 bg-yellow-500/20 border border-yellow-300/40 text-yellow-200">
                  Coming Soon — Pending Approval
                </span>
              </div>
              <div className="text-xs text-white/70 mt-2">
                Once Walmart approves our integration, you&apos;ll be able to send your shopping list to Walmart.com in one tap and finish checkout there.
              </div>
              <div className="mt-3 text-[11px] text-white/50 italic">
                For now, you can still use this list to shop in-store or manually add items to your Walmart cart.
              </div>
            </div>

            <p className="text-xs text-white/60 pt-2 border-t border-white/10">
              We never mark up grocery prices. Retailer delivery/pickup fees apply at checkout.
            </p>
          </div>
        </details>

        {/* Actions */}
        {(counts.checked > 0 || counts.total > 0) && (
          <div className="flex flex-wrap gap-2">
            {counts.checked > 0 && (
              <Button
                onClick={onClearChecked}
                className="bg-orange-600/20 border border-orange-400/30 text-orange-200 hover:bg-orange-600/30"
                size="sm"
                data-testid="button-clear-purchased"
              >
                Clear Purchased
              </Button>
            )}
            {counts.total > 0 && (
              <Button
                onClick={onClearAll}
                variant="destructive"
                size="sm"
                data-testid="button-clear-all"
              >
                Clear All
              </Button>
            )}
          </div>
        )}

        {/* Shopping List - Unchecked Items */}
        {uncheckedItems.length === 0 && checkedItems.length === 0 ? (
          <div className="rounded-2xl bg-white/5 border border-white/20 p-12 text-center backdrop-blur">
            <ShoppingCart className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/60 text-lg">Your shopping list is empty</p>
            <p className="text-white/40 text-sm mt-2">Paste items or quick add to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedUnchecked).map(([cat, arr])=>(
              <div key={cat} className="rounded-2xl bg-white/5 border border-white/20 p-4 backdrop-blur">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{cat}</h3>
                    <span className="text-white/50 text-xs">{arr.length} items</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      className="h-9 px-3 text-sm bg-white/10 border border-white/25 text-white active:scale-[.98]"
                      onClick={() => {
                        const updated = items.map(i => 
                          (cat === "All" || i.category === cat) 
                            ? {...i, isChecked: true} 
                            : i
                        );
                        replaceItems(updated);
                      }}
                      data-testid={`button-check-all-${cat}`}
                    >
                      Check all
                    </Button>
                    <Button 
                      size="sm"
                      className="h-9 px-3 text-sm bg-white/10 border border-white/25 text-white active:scale-[.98]"
                      onClick={() => {
                        const updated = items.map(i => 
                          (cat === "All" || i.category === cat) 
                            ? {...i, isChecked: false} 
                            : i
                        );
                        replaceItems(updated);
                      }}
                      data-testid={`button-uncheck-all-${cat}`}
                    >
                      Uncheck
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {arr.map(item => (
                    <div 
                      key={item.id} 
                      className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                        item.isChecked ? 'bg-white/5 opacity-50' : 'bg-white/10'
                      }`}
                    >
                      <Checkbox
                        checked={item.isChecked || false}
                        onCheckedChange={() => toggleItem(item.id)}
                        className="border-white/30"
                        data-testid={`checkbox-bought-${item.id}`}
                      />

                      {editingId === item.id ? (
                        <>
                          <Input
                            defaultValue={item.name}
                            onBlur={(e) => {
                              updateItem(item.id, { name: e.target.value });
                              setEditingId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                updateItem(item.id, { name: (e.target as HTMLInputElement).value });
                                setEditingId(null);
                              }
                            }}
                            className="flex-1 bg-black/30 border-white/30 text-white h-8"
                            autoFocus
                          />
                          <Input
                            defaultValue={item.quantity ?? ""}
                            onBlur={onInlineEdit(item.id, "quantity")}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const val = Number((e.target as HTMLInputElement).value);
                                updateItem(item.id, { quantity: Number.isFinite(val) ? val : 1 });
                              }
                            }}
                            className="w-16 bg-black/30 border-white/30 text-white h-8"
                            placeholder="Qty"
                            data-testid={`input-qty-${item.id}`}
                          />
                          <Input
                            defaultValue={item.unit ?? ""}
                            onBlur={onInlineEdit(item.id, "unit")}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                updateItem(item.id, { unit: (e.target as HTMLInputElement).value });
                              }
                            }}
                            className="w-20 bg-black/30 border-white/30 text-white h-8"
                            placeholder="Unit"
                            data-testid={`input-unit-${item.id}`}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingId(null)}
                            className="text-white hover:bg-white/10"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className={`flex-1 text-white ${item.isChecked ? 'line-through' : ''}`}>
                            {item.name}
                          </div>
                          <div className="text-white/70 text-sm shrink-0">
                            {item.quantity} {item.unit}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingId(item.id)}
                            className="text-white hover:bg-white/10"
                            data-testid={`button-edit-${item.id}`}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <TrashButton
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            confirm
                            confirmMessage="Delete this shopping list item?"
                            ariaLabel="Delete item"
                            title="Delete item"
                            data-testid={`button-delete-${item.id}`}
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Purchased Today Section */}
            {checkedItems.length > 0 && (
              <div className="rounded-2xl bg-white/5 border border-white/20 overflow-hidden backdrop-blur mt-6">
                <button
                  onClick={() => setPurchasedOpen(!purchasedOpen)}
                  className="w-full p-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-400" />
                    <span className="font-semibold">
                      Purchased Today ({checkedItems.length})
                    </span>
                  </div>
                  {purchasedOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
                {purchasedOpen && (
                  <div className="p-4 pt-0 space-y-4">
                    {Object.entries(groupedChecked).map(([cat, arr])=>(
                      <div key={cat}>
                        <h4 className="text-white/70 text-sm font-semibold mb-2">{cat}</h4>
                        <div className="space-y-2">
                          {arr.map(item => (
                            <div 
                              key={item.id} 
                              className="flex items-center gap-3 p-2 rounded-lg bg-white/5 opacity-60"
                            >
                              <Checkbox
                                checked={item.isChecked || false}
                                onCheckedChange={() => toggleItem(item.id)}
                                className="border-white/30"
                                data-testid={`checkbox-purchased-${item.id}`}
                              />
                              <div className="flex-1 text-white line-through">
                                {item.name}
                              </div>
                              <div className="text-white/70 text-sm shrink-0">
                                {item.quantity} {item.unit}
                              </div>
                              <TrashButton
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                confirm
                                confirmMessage="Delete this purchased item?"
                                ariaLabel="Delete item"
                                title="Delete item"
                                data-testid={`button-delete-purchased-${item.id}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Barcode Scanner Modal */}
        {scannerOpen && (
          <BarcodeScanner
            onItemScanned={handleBarcodeScanned}
            onClose={() => setScannerOpen(false)}
          />
        )}
      </div>
    </motion.div>
  );
}