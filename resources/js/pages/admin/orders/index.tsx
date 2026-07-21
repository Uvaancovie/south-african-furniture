import { Head, Link, router, usePage } from '@inertiajs/react';
import { index as adminOrdersIndex, show as adminOrdersShow } from '@/routes/admin/orders';
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, Package, Eye } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

type User = {
    id: number;
    name: string;
    email: string;
};

type Order = {
    id: number;
    order_number: string;
    status: string;
    total: number;
    created_at: string;
    user: User;
    items_count?: number;
};

type Props = {
    orders: { data: Order[]; links: { url: string | null; label: string; active: boolean }[]; current_page: number; last_page: number; total: number };
    filters: { search?: string; status?: string };
};

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pending: 'secondary',
    confirmed: 'default',
    processing: 'default',
    shipped: 'default',
    delivered: 'outline',
    cancelled: 'destructive',
};

export default function AdminOrdersIndex() {
    const { orders, filters } = usePage<Props>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const applyFilters = () => {
        router.get(adminOrdersIndex().url, { search, status: statusFilter }, { preserveState: true });
    };

    return (
        <>
            <Head title="Orders" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Orders</h1>
                        <p className="text-muted-foreground text-sm">{orders.total} total orders</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="text-muted-foreground pointer-events-none absolute left-2.5 top-2.5 size-4" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    placeholder="Search by order # or customer..."
                                    className="pl-8"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); router.get(adminOrdersIndex().url, { search, status: v }, { preserveState: true }); }}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Order #</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Customer</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Total</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                                        <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">No orders found.</td>
                                        </tr>
                                    ) : (
                                        orders.data.map((order) => (
                                            <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                                                <td className="px-4 py-3 text-sm font-medium">{order.order_number}</td>
                                                <td className="px-4 py-3 text-sm">{order.user?.name ?? 'Deleted User'}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant={statusVariant[order.status] || 'secondary'} className="capitalize">{order.status}</Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm font-semibold">{formatPrice(order.total)}</td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString('en-ZA')}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <Link href={adminOrdersShow({ order: order.id })}>
                                                        <Button variant="outline" size="sm" className="gap-1">
                                                            <Eye className="size-3.5" />
                                                            View
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {orders.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
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
