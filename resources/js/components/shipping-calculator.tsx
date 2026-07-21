import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { Truck, Weight, Package, AlertTriangle, Gift, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

type BreakdownLine = {
    label: string;
    amount: number;
};

type AlgorithmResult = {
    total_cost: number;
    is_free_shipping: boolean;
    free_shipping_info: {
        is_free: boolean;
        enabled: boolean;
        threshold: number;
        subtotal: number;
        remaining: number;
        progress_pct: number;
        blocked_by_weight: boolean;
        weight_limit_kg: number | null;
    };
    breakdown: BreakdownLine[];
    combined_weight: number;
    lines: { name: string; line_weight_kg: number }[];
    warnings: string[];
    calculator_enabled: boolean;
};

type FlatItem = {
    name: string;
    quantity: number;
    shipping_cost: number;
    line_total: number;
};

type ShippingBreakdown = {
    total_shipping: number;
    is_free_shipping: boolean;
    free_shipping_info: {
        is_free: boolean;
        enabled: boolean;
        threshold: number;
        subtotal: number;
        remaining: number;
        progress_pct: number;
        blocked_by_weight: boolean;
        weight_limit_kg: number | null;
    };
    algorithm_result: AlgorithmResult | null;
    flat_items: FlatItem[];
    warnings: string[];
    current_zone_fee: number;
    current_zone_area: string | null;
    current_zone_province: string | null;
};

type Props = {
    breakdown: ShippingBreakdown;
};

export default function ShippingCalculator({ breakdown }: Props) {
    const [expanded, setExpanded] = useState(false);

    const {
        total_shipping,
        is_free_shipping,
        free_shipping_info,
        algorithm_result,
        flat_items,
        warnings,
        current_zone_fee,
        current_zone_area,
        current_zone_province,
    } = breakdown;

    const hasWeightBreakdown = algorithm_result?.breakdown && algorithm_result.breakdown.length > 0;
    const combinedWeight = algorithm_result?.combined_weight ?? 0;
    const isFree = is_free_shipping || free_shipping_info.is_free;

    return (
        <div className="rounded-xl border bg-card p-6">
            <button
                onClick={() => setExpanded(!expanded)}
                className="flex w-full items-center justify-between"
            >
                <div className="flex items-center gap-2">
                    <Truck className="size-5 text-amber-600" />
                    <h2 className="font-semibold">Shipping Calculator</h2>
                </div>
                <div className="flex items-center gap-3">
                    {isFree ? (
                        <span className="text-sm font-medium text-green-600">Free Shipping</span>
                    ) : (
                        <span className="text-sm font-medium">{formatPrice(total_shipping)}</span>
                    )}
                    {expanded ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                </div>
            </button>

            {expanded && (
                <div className="mt-4 space-y-4">
                    <Separator />

                    {current_zone_area && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="size-4" />
                            <span>Delivery to {current_zone_area}, {current_zone_province}</span>
                            <span className="ml-auto font-medium text-foreground">
                                Zone fee: {formatPrice(current_zone_fee)}
                            </span>
                        </div>
                    )}


                    {combinedWeight > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Weight className="size-4" />
                            <span>Combined weight</span>
                            <span className="ml-auto font-medium text-foreground">{combinedWeight.toFixed(3)} kg</span>
                        </div>
                    )}

                    {hasWeightBreakdown && (
                        <div className="space-y-1.5 rounded-lg bg-muted/50 p-3">
                            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                <Package className="size-3.5" />
                                Cost breakdown
                            </p>
                            {algorithm_result.breakdown.map((line, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{line.label}</span>
                                    <span>{formatPrice(line.amount)}</span>
                                </div>
                            ))}
                            <Separator className="my-1.5" />
                            <div className="flex justify-between text-sm font-medium">
                                <span>Total shipping</span>
                                <span>{isFree ? <span className="text-green-600">Free</span> : formatPrice(total_shipping)}</span>
                            </div>
                        </div>
                    )}

                    {flat_items.length > 0 && (
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Flat-rate items</p>
                            {flat_items.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                                    <span>{formatPrice(item.line_total)}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {algorithm_result?.lines && algorithm_result.lines.length > 0 && (
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Weighted items</p>
                            {algorithm_result.lines.map((line, i) => (
                                <div key={i} className="flex justify-between text-sm text-muted-foreground">
                                    <span>{line.name}</span>
                                    <span>{line.line_weight_kg.toFixed(3)} kg</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {warnings.length > 0 && (
                        <div className="space-y-1 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
                            {warnings.map((w, i) => (
                                <p key={i} className="flex items-start gap-1.5 text-xs text-amber-800 dark:text-amber-400">
                                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                                    {w}
                                </p>
                            ))}
                        </div>
                    )}

                    {current_zone_fee > 0 && (
                        <div className="rounded-lg border p-3 text-sm">
                            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                                <MapPin className="size-3.5" />
                                Zone comparison
                            </p>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Current zone fee</span>
                                <span>{formatPrice(current_zone_fee)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Weight-based estimate</span>
                                <span>{formatPrice(total_shipping)}</span>
                            </div>
                            <Separator className="my-1.5" />
                            <div className="flex justify-between font-medium">
                                <span>Difference</span>
                                <span className={total_shipping <= current_zone_fee ? 'text-green-600' : 'text-destructive'}>
                                    {total_shipping <= current_zone_fee
                                        ? `Save ${formatPrice(current_zone_fee - total_shipping)}`
                                        : `${formatPrice(total_shipping - current_zone_fee)} more`}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
