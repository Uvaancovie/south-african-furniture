import { Head, Link, router } from '@inertiajs/react';
import { index as ordersIndex, invoice as ordersInvoice, message as ordersMessage } from '@/routes/orders';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import ShippingCalculator from '@/components/shipping-calculator';
import { ArrowLeft, Download, Package, Send } from 'lucide-react';
import { useState } from 'react';

type OrderItem = {
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    product_data: { sku?: string; slug?: string } | null;
};

type Message = {
    id: number;
    message: string;
    user_id: number;
    created_at: string;
    user: { name: string };
};

type DeliveryZone = {
    id: number;
    area: string;
    province: string;
    km_from_base: number;
    fee: number;
};

type Order = {
    id: number;
    order_number: string;
    status: string;
    subtotal: number;
    tax: number;
    shipping_cost: number;
    discount: number;
    total: number;
    currency: string;
    notes: string | null;
    billing_address: Record<string, string>;
    shipping_address: Record<string, string>;
    paid_at: string | null;
    created_at: string;
    items: OrderItem[];
    messages: Message[];
    delivery_zone: DeliveryZone | null;
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
    algorithm_result: {
        total_cost: number;
        is_free_shipping: boolean;
        free_shipping_info: Record<string, unknown>;
        breakdown: { label: string; amount: number }[];
        combined_weight: number;
        lines: { name: string; line_weight_kg: number }[];
        warnings: string[];
        calculator_enabled: boolean;
    } | null;
    flat_items: { name: string; quantity: number; shipping_cost: number; line_total: number }[];
    warnings: string[];
    current_zone_fee: number;
    current_zone_area: string | null;
    current_zone_province: string | null;
};

type Props = {
    order: Order;
    authUserId: number;
    shippingBreakdown: ShippingBreakdown;
};

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    processing: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function OrderShow({ order, authUserId }: Props) {
    const [messageText, setMessageText] = useState('');
    const [sending, setSending] = useState(false);

    function sendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!messageText.trim() || sending) return;
        setSending(true);
        router.post(ordersMessage({ order: order.id }).url, { message: messageText }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => { setSending(false); setMessageText(''); },
        });
    }

    function AddressBlock(address: Record<string, string>) {
        return (
            <div className="text-sm">
                <p className="font-medium">{address.name}</p>
                <p className="text-muted-foreground">{address.address_line1}</p>
                {address.address_line2 && <p className="text-muted-foreground">{address.address_line2}</p>}
                <p className="text-muted-foreground">
                    {address.city}{address.state ? `, ${address.state}` : ''} {address.postal_code ?? ''}
                </p>
                <p className="text-muted-foreground">{address.country}</p>
                {address.phone && <p className="text-muted-foreground">{address.phone}</p>}
            </div>
        );
    }

    return (
        <>
            <Head title={`Order ${order.order_number}`} />

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={ordersIndex()}>
                            <Button variant="ghost" size="sm" className="gap-1">
                                <ArrowLeft className="size-4" />
                                Orders
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">{order.order_number}</h1>
                            <p className="text-muted-foreground text-xs">
                                Placed on {new Date(order.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={`capitalize ${statusColors[order.status] || ''}`}>{order.status}</Badge>
                        <Link href={ordersInvoice({ order: order.id })}>
                            <Button variant="outline" size="sm" className="gap-1">
                                <Download className="size-4" />
                                Invoice
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="rounded-xl border bg-card">
                    <div className="p-6">
                        <h2 className="font-semibold">Order Items</h2>
                        <Separator className="my-4" />
                        <div className="divide-y">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                                            <Package className="size-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {item.product_data?.slug ? (
                                                    <Link href={`/catalog/${item.product_data.slug}`} className="hover:text-amber-600 transition-colors">{item.product_name}</Link>
                                                ) : item.product_name}
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                SKU: {item.product_data?.sku ?? '—'} · Qty: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{formatPrice(item.subtotal)}</p>
                                        <p className="text-muted-foreground text-xs">{formatPrice(item.unit_price)} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div className="rounded-xl border bg-card p-6">
                        <h2 className="font-semibold">Billing Address</h2>
                        <Separator className="my-3" />
                        {AddressBlock(order.billing_address)}
                    </div>
                    <div className="rounded-xl border bg-card p-6">
                        <h2 className="font-semibold">Shipping Address</h2>
                        <Separator className="my-3" />
                        {AddressBlock(order.shipping_address)}
                    </div>
                </div>

                <div className="mt-6 rounded-xl border bg-card p-6">
                    <h2 className="font-semibold">Payment Summary</h2>
                    <Separator className="my-4" />
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Shipping</span>
                            <span>{order.shipping_cost > 0 ? formatPrice(order.shipping_cost) : <span className="text-green-600">Free</span>}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax (15% VAT)</span>
                            <span>{formatPrice(order.tax)}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Discount</span>
                                <span className="text-green-600">-{formatPrice(order.discount)}</span>
                            </div>
                        )}
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{formatPrice(order.total)}</span>
                    </div>
                </div>

                {order.notes && (
                    <div className="mt-6 rounded-xl border bg-card p-6">
                        <h2 className="font-semibold">Order Notes</h2>
                        <Separator className="my-3" />
                        <p className="text-sm text-muted-foreground">{order.notes}</p>
                    </div>
                )}

                <div className="mt-6">
                    <ShippingCalculator breakdown={shippingBreakdown} />
                </div>

                <div className="mt-6 rounded-xl border bg-card p-6">
                    <h2 className="font-semibold">Messages</h2>
                    <Separator className="my-4" />
                    <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                        {order.messages.length === 0 && (
                            <p className="text-sm text-muted-foreground">No messages yet.</p>
                        )}
                        {order.messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.user_id === authUserId ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${msg.user_id === authUserId ? 'bg-amber-600 text-white' : 'bg-muted'}`}>
                                    <p>{msg.message}</p>
                                    <p className={`text-xs mt-1 ${msg.user_id === authUserId ? 'text-amber-100' : 'text-muted-foreground'}`}>
                                        {msg.user.name} · {new Date(msg.created_at).toLocaleString('en-ZA')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={sendMessage} className="flex gap-2">
                        <input
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
                            placeholder="Type a message..."
                            maxLength={1000}
                        />
                        <Button type="submit" size="sm" className="gap-1" disabled={sending || !messageText.trim()}>
                            <Send className="size-4" />
                            Send
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
