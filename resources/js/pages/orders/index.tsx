import { Head, Link } from '@inertiajs/react';
import { index as ordersIndex, show as ordersShow } from '@/routes/orders';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { Package, ChevronRight } from 'lucide-react';

type OrderItem = {
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
};

type Order = {
    id: number;
    order_number: string;
    status: string;
    total: number;
    created_at: string;
    items: OrderItem[];
};

type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
};

type Props = {
    orders: PaginatedData<Order>;
};

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    confirmed: 'default',
    processing: 'default',
    shipped: 'default',
    delivered: 'outline',
    cancelled: 'destructive',
};

export default function OrderIndex({ orders }: Props) {
    return (
        <>
            <Head title="My Orders" />

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
                <p className="text-muted-foreground mt-1 text-sm">{orders.total} total orders</p>

                {orders.data.length > 0 ? (
                    <div className="mt-6 space-y-4">
                        {orders.data.map((order) => (
                            <Link
                                key={order.id}
                                href={ordersShow({ order: order.id })}
                                className="group block rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                                            <Package className="size-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{order.order_number}</p>
                                            <p className="text-muted-foreground text-xs">
                                                {new Date(order.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                {' · '}{order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
                                            <Badge variant={statusVariant[order.status] || 'secondary'} className="text-[10px] capitalize">
                                                {order.status}
                                            </Badge>
                                        </div>
                                        <ChevronRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Package className="text-muted-foreground mb-4 size-16" />
                        <h2 className="text-lg font-medium">No orders yet</h2>
                        <p className="text-muted-foreground mt-1 text-sm">Start shopping to see your orders here.</p>
                        <Link href="/catalog">
                            <Button className="mt-4">Browse Catalog</Button>
                        </Link>
                    </div>
                )}

                {orders.last_page > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-1">
                        {orders.links.map((link, i) => {
                            if (link.url === null) {
                                return <span key={i} className="text-muted-foreground flex size-9 items-center justify-center rounded-md text-sm" dangerouslySetInnerHTML={{ __html: link.label }} />;
                            }
                            return (
                                <Link key={i} href={link.url} className={`flex size-9 items-center justify-center rounded-md text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`} preserveState dangerouslySetInnerHTML={{ __html: link.label }} />
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
