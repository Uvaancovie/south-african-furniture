import { Head, Link } from '@inertiajs/react';
import { index as adminProductsIndex } from '@/routes/admin/products';
import { index as adminCategoriesIndex } from '@/routes/admin/categories';
import { index as catalogIndex } from '@/routes/catalog';
import { index as adminOrdersIndex } from '@/routes/admin/orders';
import { index as adminCustomersIndex } from '@/routes/admin/customers';
import {
    AlertTriangle,
    ArrowRight,
    ArrowUpRight,
    CheckCircle2,
    CircleAlert,
    Clock3,
    Eye,
    LayoutGrid,
    Package,
    PackageOpen,
    ShoppingBag,
    ShoppingCart,
    Tags,
    TrendingUp,
    Users,
} from 'lucide-react';
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
    created_at: string;
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
    const activeProductRate = stats.total_products > 0 ? Math.round((stats.active_products / stats.total_products) * 100) : 0;
    const stockPressure = stats.total_products > 0 ? Math.round(((stats.low_stock_products + stats.out_of_stock) / stats.total_products) * 100) : 0;
    const categoryCoverage = stats.total_categories > 0 ? Math.round((stats.categories_with_products / stats.total_categories) * 100) : 0;

    const statCards = [
        {
            label: 'Total Revenue',
            value: formatPrice(Number(stats.total_revenue)),
            icon: TrendingUp,
            href: adminOrdersIndex().url,
            color: 'bg-emerald-500',
            detail: `${stats.total_orders} orders placed`,
        },
        {
            label: 'Total Orders',
            value: stats.total_orders,
            icon: ShoppingCart,
            href: adminOrdersIndex().url,
            color: 'bg-blue-500',
            detail: `${stats.pending_orders} pending review`,
        },
        {
            label: 'Products',
            value: stats.total_products,
            icon: Package,
            href: adminProductsIndex().url,
            color: 'bg-purple-500',
            detail: `${stats.active_products} active items`,
        },
        {
            label: 'Customers',
            value: stats.total_customers,
            icon: Users,
            href: adminCustomersIndex().url,
            color: 'bg-cyan-500',
            detail: 'Registered accounts',
        },
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

    const quickActions = [
        { title: 'Manage Products', href: adminProductsIndex().url, icon: Package },
        { title: 'Review Orders', href: adminOrdersIndex().url, icon: ShoppingCart },
        { title: 'Edit Categories', href: adminCategoriesIndex().url, icon: Tags },
        { title: 'View Customers', href: adminCustomersIndex().url, icon: Users },
        { title: 'Browse Catalog', href: catalogIndex().url, icon: ShoppingBag },
    ];

    const maxCategoryCount = Math.max(...categoryBreakdown.map((category) => category.products_count), 1);

    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6 p-4 md:p-6">
                <div className="overflow-hidden rounded-2xl border bg-gradient-to-br from-card via-card to-muted/30 shadow-sm">
                    <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1 text-xs">
                                    <LayoutGrid className="size-3.5" />
                                    Admin overview
                                </Badge>
                                <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1 text-xs">
                                    <Clock3 className="size-3.5" />
                                    Live store metrics
                                </Badge>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Dashboard</h1>
                                <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
                                    Track revenue, inventory health, orders, and customer activity from one place.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[360px]">
                            <div className="rounded-xl border bg-background/70 p-4 backdrop-blur">
                                <p className="text-xs font-medium text-muted-foreground">Active products</p>
                                <div className="mt-1 flex items-end justify-between gap-3">
                                    <span className="text-2xl font-bold tabular-nums">{activeProductRate}%</span>
                                    <Eye className="size-5 text-emerald-600" />
                                </div>
                            </div>
                            <div className="rounded-xl border bg-background/70 p-4 backdrop-blur">
                                <p className="text-xs font-medium text-muted-foreground">Stock pressure</p>
                                <div className="mt-1 flex items-end justify-between gap-3">
                                    <span className="text-2xl font-bold tabular-nums">{stockPressure}%</span>
                                    <CircleAlert className="size-5 text-amber-600" />
                                </div>
                            </div>
                            <div className="rounded-xl border bg-background/70 p-4 backdrop-blur">
                                <p className="text-xs font-medium text-muted-foreground">Category coverage</p>
                                <div className="mt-1 flex items-end justify-between gap-3">
                                    <span className="text-2xl font-bold tabular-nums">{categoryCoverage}%</span>
                                    <CheckCircle2 className="size-5 text-blue-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map(card => (
                        <Link key={card.label} href={card.href} className="group block">
                            <div className="flex h-full items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                                <div className={`flex size-12 items-center justify-center rounded-xl ${card.color} text-white shadow-sm`}>
                                    <card.icon className="size-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                                    <p className="truncate text-2xl font-bold tracking-tight">{card.value}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{card.detail}</p>
                                </div>
                                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                        </Link>
                    ))}
                </div>

                {alertCards.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {alertCards.map(card => (
                            <Link key={card.label} href={card.href} className="group block">
                                <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 transition-colors hover:bg-destructive/10">
                                    <div className={`flex size-10 items-center justify-center rounded-lg ${card.color} text-white`}>
                                        <card.icon className="size-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-destructive">{card.label}</p>
                                        <p className="text-xs text-destructive/70">{card.value} item{card.value !== 1 ? 's' : ''} need{card.value === 1 ? 's' : ''} attention</p>
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
                                <p className="text-muted-foreground text-xs">Latest items added to the catalog</p>
                            </div>
                            <Link href={adminProductsIndex().url}>
                                <Button variant="ghost" size="sm" className="gap-1">
                                    View All <ArrowRight className="size-3" />
                                </Button>
                            </Link>
                        </div>
                        <Separator />
                        <div className="divide-y">
                            {recentProducts.length > 0 ? recentProducts.map(product => (
                                <Link
                                    key={product.id}
                                    href={`${adminProductsIndex().url}/${product.id}/edit`}
                                    className="flex items-center gap-3 p-3 transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-xs font-medium text-muted-foreground">
                                        {product.primary_image ? (
                                            <img src={'/storage/' + product.primary_image.image_path} alt="" className="size-full rounded-lg object-cover" />
                                        ) : (
                                            <Package className="size-5" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm font-medium">{product.name}</p>
                                        <p className="text-muted-foreground text-xs">{formatPrice(product.price)} · SKU: {product.sku}</p>
                                        <p className="mt-1 text-[11px] text-muted-foreground">Added {new Date(product.created_at).toLocaleDateString('en-ZA')}</p>
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
                            )) : (
                                <div className="flex flex-col items-center py-8 text-center">
                                    <PackageOpen className="text-muted-foreground mb-2 size-8" />
                                    <p className="text-sm text-muted-foreground">No products yet</p>
                                    <Link href={adminProductsIndex().url}>
                                        <Button variant="outline" size="sm" className="mt-3">
                                            Add Product
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card">
                        <div className="flex items-center justify-between p-4 pb-3">
                            <div>
                                <h2 className="font-semibold">Category Breakdown</h2>
                                <p className="text-muted-foreground text-xs">Product distribution across categories</p>
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
                                    const percentage = Math.round((category.products_count / maxCategoryCount) * 100);
                                    return (
                                        <Link
                                            key={category.id}
                                            href={`${adminCategoriesIndex().url}/${category.id}/edit`}
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
                                        href={`${adminOrdersIndex().url}/${order.id}`}
                                        className="flex items-center gap-3 p-3 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                            <ShoppingCart className="size-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm font-medium">{order.order_number}</p>
                                            <p className="text-muted-foreground text-xs">{order.user?.name ?? 'Unknown'} · {formatPrice(order.total)}</p>
                                            <p className="mt-1 text-[11px] text-muted-foreground">Placed {new Date(order.created_at).toLocaleDateString('en-ZA')}</p>
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

                <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="rounded-xl border bg-card p-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <h2 className="font-semibold">Quick actions</h2>
                                <p className="text-muted-foreground text-xs">Common admin tasks</p>
                            </div>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {quickActions.map((action) => (
                                <Link key={action.title} href={action.href} className="group rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:border-border hover:bg-muted/50">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <action.icon className="size-4" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium">{action.title}</p>
                                            <p className="text-xs text-muted-foreground">Open section</p>
                                        </div>
                                        <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-4">
                        <h2 className="font-semibold">Store health</h2>
                        <p className="text-muted-foreground text-xs">Quick operational snapshot</p>
                        <div className="mt-4 space-y-4">
                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Inventory health</span>
                                    <span className="font-medium tabular-nums">{Math.max(0, 100 - stockPressure)}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted">
                                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.max(0, 100 - stockPressure)}%` }} />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Active catalog</span>
                                    <span className="font-medium tabular-nums">{activeProductRate}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted">
                                    <div className="h-2 rounded-full bg-blue-500" style={{ width: `${activeProductRate}%` }} />
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Category coverage</span>
                                    <span className="font-medium tabular-nums">{categoryCoverage}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-muted">
                                    <div className="h-2 rounded-full bg-amber-500" style={{ width: `${categoryCoverage}%` }} />
                                </div>
                            </div>
                        </div>
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
