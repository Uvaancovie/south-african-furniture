import { Head, Link, router, usePage } from '@inertiajs/react';
import { index as cartIndex } from '@/routes/cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, ArrowLeft, Package, Check, AlertCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

type CartItem = {
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
};

type DeliveryZone = {
    id: number;
    area: string;
    fee: number;
};

type ProvinceGroup = {
    name: string;
    zones: DeliveryZone[];
};

type Props = {
    items: CartItem[];
    total: number;
    count: number;
    user: {
        name: string;
        email: string;
    };
    provinces: ProvinceGroup[];
    deliveryZones: DeliveryZone[];
};

const allProvinces = [
    'Gauteng',
    'Western Cape',
    'KwaZulu-Natal',
    'Eastern Cape',
    'Mpumalanga',
    'Limpopo',
    'North West',
    'Free State',
    'Northern Cape',
];

function FormField({
    id, label, error, touched, children,
}: {
    id: string; label: string; error?: string; touched?: boolean; children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id} className={cn(error && 'text-destructive')}>{label}</Label>
            <div className="relative">
                {children}
                {touched && !error && (
                    <Check className="pointer-events-none absolute right-2.5 top-2.5 size-4 text-green-500" />
                )}
                {touched && error && (
                    <AlertCircle className="pointer-events-none absolute right-2.5 top-2.5 size-4 text-destructive" />
                )}
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

export default function CheckoutIndex({ items, total, count, user, provinces, deliveryZones }: Props) {
    const { errors } = usePage().props;
    const [shippingSame, setShippingSame] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [deliveryZoneId, setDeliveryZoneId] = useState('');
    const [touched, setTouched] = useState<Set<string>>(new Set());

    const filteredZones = useMemo(() => {
        if (!selectedProvince) return [];
        const group = provinces.find((p) => p.name === selectedProvince);
        return group?.zones ?? [];
    }, [selectedProvince, provinces]);

    const selectedZone = deliveryZones.find((z) => z.id === Number(deliveryZoneId));
    const subtotal = Number(total);
    const tax = subtotal * 0.15;
    const shippingCost = Number(selectedZone?.fee ?? 0);
    const grandTotal = subtotal + tax + shippingCost;

    function handleProvinceChange(province: string) {
        setSelectedProvince(province);
        setDeliveryZoneId('');
    }

    function handleBlur(fieldName: string) {
        setTouched(prev => new Set(prev).add(fieldName));
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);

        const form = new FormData(e.currentTarget);
        const data: Record<string, unknown> = {};
        form.forEach((value, key) => {
            const keys = key.split('.');
            if (keys.length === 2) {
                if (!data[keys[0]]) data[keys[0]] = {};
                (data[keys[0]] as Record<string, string>)[keys[1]] = value as string;
            } else {
                data[key] = value;
            }
        });
        data.shipping_same = shippingSame;

        router.post('/checkout', data as any, {
            onFinish: () => setSubmitting(false),
        });
    }

    function renderAddressFields(prefix: string) {
        const t = (name: string) => `${prefix}.${name}`;
        const hasError = (name: string) => !!errors[t(name)];
        const isTouched = (name: string) => touched.has(t(name));

        return (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <FormField id={t('name')} label="Full Name" error={errors[t('name')]} touched={isTouched('name')}>
                        <Input
                            id={t('name')}
                            name={t('name')}
                            defaultValue={prefix === 'billing_address' ? user.name : ''}
                            required
                            autoComplete={prefix === 'billing_address' ? 'name' : 'shipping name'}
                            onBlur={() => handleBlur(t('name'))}
                            className={cn(hasError('name') && 'border-destructive')}
                        />
                    </FormField>
                </div>
                <div className="sm:col-span-2">
                    <FormField id={t('phone')} label="Phone (optional)" error={errors[t('phone')]} touched={isTouched('phone')}>
                        <Input
                            id={t('phone')}
                            name={t('phone')}
                            autoComplete={prefix === 'billing_address' ? 'tel' : 'shipping tel'}
                            onBlur={() => handleBlur(t('phone'))}
                            className={cn(hasError('phone') && 'border-destructive')}
                        />
                    </FormField>
                </div>
                <div className="sm:col-span-2">
                    <FormField id={t('address_line1')} label="Address Line 1" error={errors[t('address_line1')]} touched={isTouched('address_line1')}>
                        <Input
                            id={t('address_line1')}
                            name={t('address_line1')}
                            required
                            autoComplete={prefix === 'billing_address' ? 'address-line1' : 'shipping address-line1'}
                            onBlur={() => handleBlur(t('address_line1'))}
                            className={cn(hasError('address_line1') && 'border-destructive')}
                        />
                    </FormField>
                </div>
                <div className="sm:col-span-2">
                    <FormField id={t('address_line2')} label="Address Line 2 (optional)" error={errors[t('address_line2')]} touched={isTouched('address_line2')}>
                        <Input
                            id={t('address_line2')}
                            name={t('address_line2')}
                            autoComplete={prefix === 'billing_address' ? 'address-line2' : 'shipping address-line2'}
                            onBlur={() => handleBlur(t('address_line2'))}
                            className={cn(hasError('address_line2') && 'border-destructive')}
                        />
                    </FormField>
                </div>
                <div>
                    <FormField id={t('city')} label="City" error={errors[t('city')]} touched={isTouched('city')}>
                        <Input
                            id={t('city')}
                            name={t('city')}
                            required
                            autoComplete={prefix === 'billing_address' ? 'address-level2' : 'shipping address-level2'}
                            onBlur={() => handleBlur(t('city'))}
                            className={cn(hasError('city') && 'border-destructive')}
                        />
                    </FormField>
                </div>
                <div>
                    <FormField id={t('state')} label="Province" error={errors[t('state')]} touched={isTouched('state')}>
                        <Select
                            value={prefix === 'billing_address' ? selectedProvince : (shippingSame ? selectedProvince : '')}
                            onValueChange={(value) => {
                                if (prefix === 'billing_address') {
                                    handleProvinceChange(value);
                                }
                                handleBlur(t('state'));
                            }}
                        >
                            <SelectTrigger className={cn('w-full', hasError(t('state')) && 'border-destructive')}>
                                <SelectValue placeholder="Select province..." />
                            </SelectTrigger>
                            <SelectContent>
                                {allProvinces.map((p) => (
                                    <SelectItem key={p} value={p}>{p}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormField>
                </div>
                <div>
                    <FormField id={t('postal_code')} label="Postal Code (optional)" error={errors[t('postal_code')]} touched={isTouched('postal_code')}>
                        <Input
                            id={t('postal_code')}
                            name={t('postal_code')}
                            autoComplete={prefix === 'billing_address' ? 'postal-code' : 'shipping postal-code'}
                            onBlur={() => handleBlur(t('postal_code'))}
                            className={cn(hasError('postal_code') && 'border-destructive')}
                        />
                    </FormField>
                </div>
                <div>
                    <FormField id={t('country')} label="Country" error={errors[t('country')]} touched={isTouched('country')}>
                        <Input
                            id={t('country')}
                            name={t('country')}
                            defaultValue="South Africa"
                            required
                            autoComplete={prefix === 'billing_address' ? 'country-name' : 'shipping country-name'}
                            onBlur={() => handleBlur(t('country'))}
                            className={cn(hasError('country') && 'border-destructive')}
                        />
                    </FormField>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head title="Checkout" />

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Checkout</h1>
                        <p className="text-muted-foreground text-sm">{count} {count === 1 ? 'item' : 'items'}</p>
                    </div>
                    <Link href={cartIndex()}>
                        <Button variant="ghost" size="sm" className="gap-1">
                            <ArrowLeft className="size-4" />
                            Back to Cart
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="rounded-xl border bg-card p-6">
                                <h2 className="font-semibold">Billing Address</h2>
                                {renderAddressFields('billing_address')}
                            </div>

                            <div className="rounded-xl border bg-card p-6">
                                <div className="flex items-center gap-3">
                                    <Checkbox id="shipping_same" checked={shippingSame} onCheckedChange={(v) => setShippingSame(v === true)} />
                                    <Label htmlFor="shipping_same" className="font-medium">Ship to same address</Label>
                                </div>
                            </div>

                            {selectedProvince && (
                                <div className="rounded-xl border bg-card p-6">
                                    <h2 className="font-semibold">Delivery Area</h2>
                                    <p className="text-muted-foreground text-xs mt-1 mb-3">Select your city / town in {selectedProvince}</p>
                                    <Select
                                        value={deliveryZoneId}
                                        onValueChange={(value) => {
                                            setDeliveryZoneId(value);
                                            handleBlur('delivery_zone_id');
                                        }}
                                    >
                                        <SelectTrigger className={cn('w-full', errors['delivery_zone_id'] && 'border-destructive')}>
                                            <SelectValue placeholder="Select city / town..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filteredZones.map((z) => (
                                                <SelectItem key={z.id} value={String(z.id)}>
                                                    {z.area} — {formatPrice(z.fee)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors['delivery_zone_id'] && <p className="mt-1 text-xs text-destructive">{errors['delivery_zone_id']}</p>}
                                </div>
                            )}

                            {!selectedProvince && (
                                <div className="rounded-xl border bg-card p-6">
                                    <p className="text-sm text-muted-foreground">Select a province above to see available delivery areas and shipping costs.</p>
                                </div>
                            )}

                            {!shippingSame && (
                                <div className="rounded-xl border bg-card p-6">
                                    <h2 className="font-semibold">Shipping Address</h2>
                                    {renderAddressFields('shipping_address')}
                                </div>
                            )}

                            <div className="rounded-xl border bg-card p-6">
                                <h2 className="font-semibold">Order Notes (optional)</h2>
                                <textarea
                                    name="notes"
                                    className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                    rows={3}
                                    placeholder="Special instructions, delivery notes, etc."
                                />
                            </div>
                        </div>

                        <div>
                            <div className="rounded-xl border bg-card p-6">
                                <h2 className="font-semibold">Order Summary</h2>
                                <Separator className="my-4" />
                                <div className="space-y-3">
                                    {items.map((item) => (
                                        <div key={item.product_id} className="flex items-center gap-3">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                                {item.image ? (
                                                    <img src={'/storage/' + item.image} alt="" className="size-full rounded-lg object-cover" />
                                                ) : (
                                                    <Package className="size-4 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="truncate text-sm">{item.name}</p>
                                                <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                                            </div>
                                            <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                                <Separator className="my-4" />
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span>{shippingCost > 0 ? formatPrice(shippingCost) : <span className="text-muted-foreground">—</span>}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tax (15% VAT)</span>
                                        <span>{formatPrice(tax)}</span>
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>{formatPrice(grandTotal)}</span>
                                </div>
                                <Button type="submit" className="mt-6 w-full gap-2" disabled={submitting || !selectedZone}>
                                    <ShoppingBag className="size-4" />
                                    {submitting ? 'Placing Order...' : 'Place Order'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}
