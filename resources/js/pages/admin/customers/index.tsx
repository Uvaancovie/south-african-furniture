import { Head, Link, router, usePage } from '@inertiajs/react';
import { index as adminCustomersIndex } from '@/routes/admin/customers';
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';
import { Search, Users, Eye } from 'lucide-react';

type Customer = {
    id: number;
    name: string;
    email: string;
    created_at: string;
    orders_count: number;
    orders_sum_total: number | null;
};

type Props = {
    customers: { data: Customer[]; links: { url: string | null; label: string; active: boolean }[]; current_page: number; last_page: number; total: number };
    filters: { search?: string };
};

export default function AdminCustomersIndex() {
    const { customers, filters } = usePage<Props>().props;
    const [search, setSearch] = useState(filters.search || '');

    const applyFilters = () => {
        router.get(adminCustomersIndex().url, { search }, { preserveState: true });
    };

    return (
        <>
            <Head title="Customers" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">Customers</h1>
                        <p className="text-muted-foreground text-sm">{customers.total} total customers</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="relative flex-1 max-w-sm">
                            <Search className="text-muted-foreground pointer-events-none absolute left-2.5 top-2.5 size-4" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                placeholder="Search by name or email..."
                                className="pl-8"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                                        <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Orders</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Total Spent</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">No customers found.</td>
                                        </tr>
                                    ) : (
                                        customers.data.map((customer) => (
                                            <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                                                <td className="px-4 py-3 text-sm font-medium">{customer.name}</td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">{customer.email}</td>
                                                <td className="px-4 py-3 text-center text-sm">{customer.orders_count}</td>
                                                <td className="px-4 py-3 text-right text-sm font-semibold">{customer.orders_sum_total ? formatPrice(customer.orders_sum_total) : '—'}</td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(customer.created_at).toLocaleDateString('en-ZA')}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {customers.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {customers.links.map((link, i) => {
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
