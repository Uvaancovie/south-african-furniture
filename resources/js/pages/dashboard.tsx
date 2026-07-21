import { Head, Link } from '@inertiajs/react';
import { index as adminProductsIndex } from '@/routes/admin/products';
import { index as adminCategoriesIndex } from '@/routes/admin/categories';
import { index as catalogIndex } from '@/routes/catalog';
import { index as adminOrdersIndex } from '@/routes/admin/orders';
import { index as adminCustomersIndex } from '@/routes/admin/customers';
import { Package, ShoppingBag, ShoppingCart, Tags, Star, AlertTriangle, TrendingUp, ArrowRight, Eye, Users } from 'lucide-react';
import { dashboard } from '@/routes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';

type ProductImage = {
    id: number;
    image_path: string;
    is_primary: boolean;
};

type Product = {
    id: number;
    name: string;
    slug: string;
    price: number;
    sku: string;
    stock_quantity: number;
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
    primary_image: ProductImage | null;
};

type Category = {
    id: number;
    name: string;
    slug: string;
    products_count: number;
};

type OrderUser = {
    id: number;
    name: string;
};

type Order = {
    id: number;
    order_number: string;
    status: string;
    total: number;
    user: OrderUser | null;
};

type Stats = {
    total_products: number;
    active_products: number;
    inactive_products: number;
    featured_products: number;
    total_categories: number;
    low_stock_products: number;
    out_of_stock: number;
    categories_with_products: number;
    total_orders: number;
    pending_orders: number;
    total_revenue: number;
    total_customers: number;
};

type Props = {
    stats: Stats;
    recentProducts: Product[];
    categoryBreakdown: Category[];
    recentOrders: Order[];
};

export default function Dashboard({ stats, recentProducts, categoryBreakdown, recentOrders }: Props) {
    const statCards = [
        { label: 'Total Revenue', value: 'R' + Number(stats.total_revenue).toLocaleString(), icon: TrendingUp, href: adminOrdersIndex().url, color: 'bg-emerald-500' },
        { label: 'Total Orders', value: stats.total_orders, icon: ShoppingCart, href: adminOrdersIndex().url, color: 'bg-blue-500' },
        { label: 'Total Products', value: stats.total_products, icon: Package, href: adminProductsIndex().url, color: 'bg-purple-500' },
        { label: 'Active Products', value: stats.active_products, icon: Eye, href: adminProductsIndex().url, color: 'bg-green-500' },
        { label: 'Customers', value: stats.total_customers, icon: Users, href: adminCustomersIndex().url, color: 'bg-cyan-500' },
        { label: 'Categories', value: stats.total_categories, icon: Tags, href: adminCategoriesIndex().url, color: 'bg-amber-500' },
    ];

    const alertCards = [
        ...(stats.pending_orders > 0
            ? [{ label: 'Pending Orders', value: stats.pending_orders, icon: ShoppingCart, href: adminOrdersIndex().url + '?status=pending', color: 'bg-yellow-500' }]
            : []),
        ...(stats.low_stock_products > 0
            ? [{ label: 'Low Stock', value: stats.low_stock_products, icon: AlertTriangle, href: adminProductsIndex().url + '?stock_status=low', color: 'bg-orange-500' }]
            : []),
        ...(stats.out_of_stock > 0
            ? [{ label: 'Out of Stock', value: stats.out_of_stock, icon: AlertTriangle, href: adminProductsIndex().url + '?stock_status=out', color: 'bg-red-500' }]
            : []),
    ];

    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground text-sm">Overview of your funeral supplies store</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map(card => (
                        <Link key={card.label} href={card.href} className="group block">
                            <div className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
                                <div className={`flex size-12 items-center justify-center rounded-lg ${card.color} text-white`}>
                                    <card.icon className="size-6" />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs font-medium">{card.label}</p>
                                    <p className="text-2xl font-bold">{card.value}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {alertCards.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {alertCards.map(card => (
                            <Link key={card.label} href={card.href} className="group block">
                                <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-3 transition-colors hover:bg-destructive/10">
                                    <card.icon className="size-5 text-destructive" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-destructive">{card.label}</p>
                                        <p className="text-xs text-destructive/70">{card.value} product{card.value !== 1 ? 's' : ''} need{card.value === 1 ? 's' : ''} attention</p>
                                    </div>
                                    <ArrowRight className="size-4 text-destructive/50" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border bg-card">
                        <div className="flex items-center justify-between p-4 pb-3">
                            <div>
                                <h2 className="font-semibold">Recent Products</h2>
                                <p className="text-muted-foreground text-xs">Latest items added to your catalog</p>
                            </div>
                            <Link href={adminProductsIndex().url}>
                                <Button variant="ghost" size="sm" className="gap-1">
                                    View All <ArrowRight className="size-3" />
                                </Button>
                            </Link>
                        </div>
                        <Separator />
                        <div className="divide-y">
                            {recentProducts.map(product => (
                                <Link
                                    key={product.id}
                                    href={`/admin/products/${product.id}/edit`}
                                    className="flex items-center gap-3 p-3 transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                                        {product.primary_image ? (
                                            <img src={'/storage/' + product.primary_image.image_path} alt="" className="size-full rounded-lg object-cover" />
                                        ) : (
                                            <Package className="size-5" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm font-medium">{product.name}</p>
                                        <p className="text-muted-foreground text-xs">
                                            {formatPrice(product.price)} · SKU: {product.sku}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={product.is_active ? 'default' : 'secondary'} className="text-[10px]">
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                        {product.stock_quantity <= 5 && (
                                            <Badge variant="destructive" className="text-[10px]">
                                                {product.stock_quantity <= 0 ? 'OOS' : 'Low'}
                                            </Badge>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card">
                        <div className="flex items-center justify-between p-4 pb-3">
                            <div>
                                <h2 className="font-semibold">Category Breakdown</h2>
                                <p className="text-muted-foreground text-xs">Products per category</p>
                            </div>
                            <Link href={adminCategoriesIndex().url}>
                                <Button variant="ghost" size="sm" className="gap-1">
                                    Manage <ArrowRight className="size-3" />
                                </Button>
                            </Link>
                        </div>
                        <Separator />
                        {categoryBreakdown.length > 0 ? (
                            <div className="divide-y">
                                {categoryBreakdown.map(category => {
                                    const maxCount = Math.max(...categoryBreakdown.map(c => c.products_count), 1);
                                    const percentage = Math.round((category.products_count / maxCount) * 100);
                                    return (
                                        <Link
                                            key={category.id}
                                            href={`/admin/categories/${category.id}/edit`}
                                            className="flex items-center gap-3 p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                                <Tags className="size-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="truncate text-sm font-medium">{category.name}</p>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <div className="h-1.5 flex-1 rounded-full bg-muted">
                                                        <div
                                                            className="h-1.5 rounded-full bg-purple-500"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                                                        {category.products_count}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-8 text-center">
                                <Tags className="text-muted-foreground mb-2 size-8" />
                                <p className="text-sm text-muted-foreground">No categories yet</p>
                                <Link href={adminCategoriesIndex().url}>
                                    <Button variant="outline" size="sm" className="mt-3">
                                        Create Category
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl border bg-card">
                        <div className="flex items-center justify-between p-4 pb-3">
                            <div>
                                <h2 className="font-semibold">Recent Orders</h2>
                                <p className="text-muted-foreground text-xs">Latest customer orders</p>
                            </div>
                            <Link href={adminOrdersIndex().url}>
                                <Button variant="ghost" size="sm" className="gap-1">
                                    View All <ArrowRight className="size-3" />
                                </Button>
                            </Link>
                        </div>
                        <Separator />
                        {recentOrders.length > 0 ? (
                            <div className="divide-y">
                                {recentOrders.map(order => (
                                    <Link
                                        key={order.id}
                                        href={`/admin/orders/${order.id}`}
                                        className="flex items-center gap-3 p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                            <ShoppingCart className="size-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm font-medium">{order.order_number}</p>
                                            <p className="text-muted-foreground text-xs">
                                                {order.user?.name ?? 'Unknown'} · {formatPrice(order.total)}
                                            </p>
                                        </div>
                                        <Badge variant={order.status === 'pending' ? 'secondary' : order.status === 'cancelled' ? 'destructive' : 'default'} className="capitalize text-[10px]">
                                            {order.status}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-8 text-center">
                                <ShoppingCart className="text-muted-foreground mb-2 size-8" />
                                <p className="text-sm text-muted-foreground">No orders yet</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-3">
                    <Link href={adminProductsIndex().url}>
                        <Button className="gap-2">
                            <Package className="size-4" />
                            Manage Products
                        </Button>
                    </Link>
                    <Link href={adminCategoriesIndex().url}>
                        <Button variant="outline" className="gap-2">
                            <Tags className="size-4" />
                            Manage Categories
                        </Button>
                    </Link>
                    <Link href={catalogIndex().url}>
                        <Button variant="outline" className="gap-2">
                            <ShoppingBag className="size-4" />
                            View Catalog
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
