import { useState, useEffect, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { formatPrice, cn } from '@/lib/utils';
import {
    Truck, MapPin, Weight, Package, Gift, AlertTriangle,
    ChevronDown, ChevronUp,
} from 'lucide-react';

type Zone = { id: number; area: string; fee: number };
type ProvinceGroup = { name: string; zones: Zone[] };
type BreakdownLine = { label: string; amount: number };
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
type EstimateResult = {
    total_shipping: number;
    is_free_shipping: boolean;
    free_shipping_info: AlgorithmResult['free_shipping_info'];
    algorithm_result: AlgorithmResult | null;
    flat_items: { name: string; quantity: number; shipping_cost: number; line_total: number }[];
    warnings: string[];
    current_zone_fee: number;
    current_zone_area: string | null;
    current_zone_province: string | null;
};

type Props = {
    productId: number;
    productName: string;
    productPrice: number;
    productWeight: number | null;
    quantity: number;
    provinces: ProvinceGroup[];
};

const allProvinces = [
    'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape',
    'Mpumalanga', 'Limpopo', 'North West', 'Free State', 'Northern Cape',
];

export default function DeliveryCalculator({
    productId, productName, productPrice, productWeight, quantity, provinces,
}: Props) {
    const [expanded, setExpanded] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedZoneId, setSelectedZoneId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<EstimateResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const filteredZones = useMemo(() => {
        if (!selectedProvince) return [];
        return provinces.find(p => p.name === selectedProvince)?.zones ?? [];
    }, [selectedProvince, provinces]);

    useEffect(() => {
        if (!selectedZoneId || quantity < 1) return;

        let cancelled = false;
        const controller = new AbortController();

        async function fetchEstimate() {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams({
                    product_id: String(productId),
                    quantity: String(quantity),
                    delivery_zone_id: String(selectedZoneId),
                });
                const res = await fetch(`/shipping/estimate?${params}`, { signal: controller.signal });
                if (cancelled) return;
                if (!res.ok) {
                    const body = await res.json().catch(() => ({}));
                    throw new Error(body.message || 'Failed to calculate shipping');
                }
                const data: EstimateResult = await res.json();
                if (!cancelled) setResult(data);
            } catch (err) {
                if (err instanceof DOMException && err.name === 'AbortError') return;
                if (!cancelled) setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchEstimate();

        return () => { cancelled = true; controller.abort(); };
    }, [selectedZoneId, quantity, productId]);

    function handleProvinceChange(province: string) {
        setSelectedProvince(province);
        setSelectedZoneId('');
        setResult(null);
        setError(null);
    }

    const freeInfo = result?.free_shipping_info;
    const algorithmResult = result?.algorithm_result;
    const hasBreakdown = algorithmResult?.breakdown && algorithmResult.breakdown.length > 0;
    const combinedWeight = algorithmResult?.combined_weight ?? 0;
    const isFree = result?.is_free_shipping || freeInfo?.is_free;

    return (
        <div className="rounded-xl border bg-card">
            <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="flex w-full items-center justify-between px-6 py-4"
            >
                <div className="flex items-center gap-2">
                    <Truck className="size-5 text-amber-600" />
                    <span className="font-semibold">Delivery Calculator</span>
                </div>
                <div className="flex items-center gap-2">
                    {result && !loading && (
                        isFree
                            ? <span className="text-sm font-medium text-green-600">Free Shipping</span>
                            : <span className="text-sm font-medium">{formatPrice(result.total_shipping)}</span>
                    )}
                    {expanded ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                </div>
            </button>

            {expanded && (
                <div className="px-6 pb-6">
                    <Separator className="mb-4" />

                    <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Province</label>
                                <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select province..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allProvinces.map(p => (
                                            <SelectItem key={p} value={p}>{p}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">City / Town</label>
                                <Select
                                    value={selectedZoneId}
                                    onValueChange={setSelectedZoneId}
                                    disabled={!selectedProvince || filteredZones.length === 0}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={selectedProvince ? 'Select area...' : 'Select province first'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredZones.map(z => (
                                            <SelectItem key={z.id} value={String(z.id)}>
                                                {z.area} &mdash; {formatPrice(z.fee)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {loading && (
                            <div className="flex items-center justify-center py-6">
                                <Spinner className="size-5 text-muted-foreground" />
                            </div>
                        )}

                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/30">
                                <p className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                                    <AlertTriangle className="size-3.5 shrink-0" />
                                    {error}
                                </p>
                            </div>
                        )}

                        {result && !loading && (
                            <div className="space-y-4 rounded-lg bg-muted/50 p-4">
                                {result.current_zone_area && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="size-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Delivery to</span>
                                        <span className="font-medium">{result.current_zone_area}, {result.current_zone_province}</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Weight className="size-4" />
                                    <span>Combined weight</span>
                                    <span className="ml-auto font-medium text-foreground">{combinedWeight.toFixed(3)} kg</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="size-4" />
                                    <span>Zone fee</span>
                                    <span className="ml-auto font-medium text-foreground">{formatPrice(result.current_zone_fee)}</span>
                                </div>

                                {hasBreakdown && (
                                    <div className="space-y-1.5 rounded-lg bg-background p-3">
                                        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                            <Package className="size-3.5" />
                                            Estimated shipping breakdown
                                        </p>
                                        {algorithmResult.breakdown.map((line, i) => (
                                            <div key={i} className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">{line.label}</span>
                                                <span>{formatPrice(line.amount)}</span>
                                            </div>
                                        ))}
                                        <Separator className="my-1.5" />
                                        <div className="flex justify-between text-sm font-medium">
                                            <span>Total shipping</span>
                                            <span>{isFree ? <span className="text-green-600">Free</span> : formatPrice(result.total_shipping)}</span>
                                        </div>
                                    </div>
                                )}

                                {result.warnings.length > 0 && (
                                    <div className="space-y-1 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
                                        {result.warnings.map((w, i) => (
                                            <p key={i} className="flex items-start gap-1.5 text-xs text-amber-800 dark:text-amber-400">
                                                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                                                {w}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedProvince && !selectedZoneId && !loading && (
                            <p className="py-2 text-center text-xs text-muted-foreground">
                                Select a city / town above to calculate shipping
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
