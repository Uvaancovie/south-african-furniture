import { Head, Link, router } from '@inertiajs/react';
import { index as catalogIndex, show as catalogShow } from '@/routes/catalog';
import { index as checkoutIndex } from '@/routes/checkout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';
import {
    ShoppingBag, Trash2, Minus, Plus, ArrowLeft, Package, Percent, X, Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

type CartItem = {
    product_id: number;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    image: string | null;
    sku: string;
};

type Props = {
    items: CartItem[];
    total: number;
    count: number;
};

export default function CartIndex({ items, total, count }: Props) {
    const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());
    const [couponCode, setCouponCode] = useState('');

    async function updateQuantity(productId: number, quantity: number) {
        if (quantity < 1) return;
        setLoadingItems(prev => new Set(prev).add(productId));
        router.patch(`/cart/${productId}`, { quantity }, {
            preserveState: true,
            onFinish: () => {
                setLoadingItems(prev => {
                    const next = new Set(prev);
                    next.delete(productId);
                    return next;
                });
            },
        });
    }

    function removeItem(productId: number, itemName: string) {
        const undoKey = `undo_${productId}`;
        const toastId = toast(`${itemName} removed`, {
            description: 'Item has been removed from your cart.',
            action: {
                label: 'Undo',
                onClick: () => {
                    toast.dismiss(undoKey);
                },
            },
            duration: 5000,
            id: undoKey,
        });

        router.delete(`/cart/${productId}`, {
            preserveState: true,
            onError: () => toast.error('Failed to remove item. Please try again.'),
        });
    }

    return (
        <>
            <Head title="Shopping Cart" />

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Shopping Cart</h1>
                        <p className="text-muted-foreground text-sm">{count} {count === 1 ? 'item' : 'items'}</p>
                    </div>
                    <Link href={catalogIndex()}>
                        <Button variant="ghost" size="sm" className="gap-1">
                            <ArrowLeft className="size-4" />
                            Continue Shopping
                        </Button>
                    </Link>
                </div>

                {items.length > 0 ? (
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => {
                                const isLoading = loadingItems.has(item.product_id);
                                return (
                                    <div key={item.product_id} className="flex gap-4 rounded-xl border bg-card p-4">
                                        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                                            {item.image ? (
                                                <img src={'/storage/' + item.image} alt={item.name} className="size-full object-cover" />
                                            ) : (
                                                <Package className="size-8 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <Link href={catalogShow({ product: item.slug })} className="font-medium hover:text-amber-600 transition-colors">
                                                    {item.name}
                                                </Link>
                                                <p className="text-muted-foreground text-xs">SKU: {item.sku}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="size-8"
                                                        disabled={isLoading || item.quantity <= 1}
                                                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                    >
                                                        {isLoading ? <Loader2 className="size-3 animate-spin" /> : <Minus className="size-3" />}
                                                    </Button>
                                                    <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="size-8"
                                                        disabled={isLoading}
                                                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                    >
                                                        {isLoading ? <Loader2 className="size-3 animate-spin" /> : <Plus className="size-3" />}
                                                    </Button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                                                    <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive/80" onClick={() => removeItem(item.product_id, item.name)}>
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div>
                            <div className="rounded-xl border bg-card p-6">
                                <h2 className="font-semibold">Order Summary</h2>
                                <Separator className="my-4" />
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span>{total >= 500 ? <span className="text-green-600 font-medium">Free</span> : 'Calculated at checkout'}</span>
                                    </div>
                                    {total < 500 && (
                                        <p className="text-xs text-muted-foreground">Free shipping on orders over {formatPrice(500)}</p>
                                    )}
                                </div>

                                <Separator className="my-4" />

                                <div className="space-y-2">
                                    <label htmlFor="coupon" className="text-sm font-medium">Coupon Code</label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="coupon"
                                            value={couponCode}
                                            onChange={e => setCouponCode(e.target.value)}
                                            placeholder="Enter code"
                                            className="h-9 text-sm"
                                        />
                                        <Button variant="outline" size="sm" className="gap-1 shrink-0" disabled={!couponCode.trim()}>
                                            <Percent className="size-3.5" />
                                            Apply
                                        </Button>
                                    </div>
                                    {couponCode && (
                                        <p className="text-xs text-muted-foreground">Coupon codes are not yet available.</p>
                                    )}
                                </div>

                                <Separator className="my-4" />

                                <Link href={checkoutIndex()}>
                                    <Button className="w-full gap-2">
                                        <ShoppingBag className="size-4" />
                                        Proceed to Checkout
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <ShoppingBag className="text-muted-foreground mb-4 size-16" />
                        <h2 className="text-lg font-medium">Your cart is empty</h2>
                        <p className="text-muted-foreground mt-1 text-sm">Start browsing our catalog to add items.</p>
                        <Link href={catalogIndex()}>
                            <Button className="mt-4 gap-2">
                                <ArrowLeft className="size-4" />
                                Browse Catalog
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
