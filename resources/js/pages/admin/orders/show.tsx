import { Head, Link, router } from '@inertiajs/react';
import { index as adminOrdersIndex, update as adminOrdersUpdate, message as adminOrdersMessage } from '@/routes/admin/orders';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, Package, Send } from 'lucide-react';
import { useState } from 'react';

type OrderItem = {
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    product_data: { sku?: string } | null;
};

type User = {
    id: number;
    name: string;
    email: string;
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
    notes: string | null;
    billing_address: Record<string, string>;
    shipping_address: Record<string, string>;
    created_at: string;
    items: OrderItem[];
    user: User;
    messages: Message[];
    delivery_zone: DeliveryZone | null;
};

type Props = {
    order: Order;
    authUserId: number;
};

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-400',
    processing: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-400',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrderShow({ order, authUserId }: Props) {
    const [notes, setNotes] = useState(order.notes || '');
    const [messageText, setMessageText] = useState('');
    const [sending, setSending] = useState(false);

    function updateStatus(status: string) {
        router.patch(adminOrdersUpdate({ order: order.id }).url, { status, notes }, { preserveState: true });
    }

    function sendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!messageText.trim() || sending) return;
        setSending(true);
        router.post(adminOrdersMessage({ order: order.id }).url, { message: messageText }, {
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
                <p className="text-muted-foreground">{address.city}{address.state ? `, ${address.state}` : ''} {address.postal_code ?? ''}</p>
                <p className="text-muted-foreground">{address.country}</p>
                {address.phone && <p className="text-muted-foreground">{address.phone}</p>}
            </div>
        );
    }

    return (
        <>
            <Head title={`Order ${order.order_number}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={adminOrdersIndex()}>
                            <Button variant="ghost" size="sm" className="gap-1">
                                <ArrowLeft className="size-4" />
                                Orders
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-semibold tracking-tight">{order.order_number}</h1>
                            <p className="text-muted-foreground text-xs">
                                by {order.user.name} · {new Date(order.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <Badge className={`capitalize text-sm px-3 py-1 ${statusColors[order.status] || ''}`}>{order.status}</Badge>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
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
                                                    <p className="text-sm font-medium">{item.product_name}</p>
                                                    <p className="text-muted-foreground text-xs">SKU: {item.product_data?.sku ?? '—'} · Qty: {item.quantity}</p>
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

                        <div className="rounded-xl border bg-card p-6">
                            <h2 className="font-semibold">Update Status</h2>
                            <Separator className="my-4" />
                            <div className="flex flex-wrap gap-2">
                                {statuses.map((s) => (
                                    <Button
                                        key={s}
                                        variant={s === order.status ? 'default' : 'outline'}
                                        size="sm"
                                        className="capitalize"
                                        onClick={() => updateStatus(s)}
                                    >
                                        {s}
                                    </Button>
                                ))}
                            </div>
                            <Separator className="my-4" />
                            <h3 className="text-sm font-medium mb-2">Admin Notes</h3>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                                rows={3}
                                placeholder="Internal notes..."
                            />
                            <Button size="sm" className="mt-2" onClick={() => updateStatus(order.status)}>Save Notes</Button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-xl border bg-card p-6">
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
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>{formatPrice(order.tax)}</span>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>{formatPrice(order.total)}</span>
                            </div>
                        </div>

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

                        <div className="rounded-xl border bg-card p-6">
                            <h2 className="font-semibold">Customer</h2>
                            <Separator className="my-3" />
                            <p className="text-sm font-medium">{order.user.name}</p>
                            <p className="text-sm text-muted-foreground">{order.user.email}</p>
                        </div>

                        {order.delivery_zone && (
                            <div className="rounded-xl border bg-card p-6">
                                <h2 className="font-semibold">Delivery Area</h2>
                                <Separator className="my-3" />
                                <p className="text-sm font-medium">{order.delivery_zone.province} — {order.delivery_zone.area}</p>
                                <p className="text-muted-foreground text-xs">{order.delivery_zone.km_from_base} km · {formatPrice(order.delivery_zone.fee)}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-6">
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
                            placeholder="Reply to customer..."
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
