import { Head, Link, router, usePage } from '@inertiajs/react';
import { index as adminProductsIndex, create as adminProductsCreate, store as adminProductsStore, edit as adminProductsEdit, update as adminProductsUpdate, destroy as adminProductsDestroy } from '@/routes/admin/products';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { formatPrice } from '@/lib/utils';
import { Pencil, Plus, Trash2, Search, Package } from 'lucide-react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';

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
    category: { id: number; name: string } | null;
    primary_image: ProductImage | null;
    images_count: number;
    created_at: string;
};

type Category = {
    id: number;
    name: string;
    parent_id: number | null;
};

export default function Index() {
    const { products, categories, filters } = usePage<{
        products: { data: Product[]; links: { url: string | null; label: string; active: boolean }[]; current_page: number; last_page: number; total: number; from: number; to: number };
        categories: Category[];
        filters: { search?: string; category_id?: string };
    }>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    useFlashToast();

    const productsIndexUrl = '/admin/products';

    const applyFilters = () => {
        router.get(productsIndexUrl, {
            search,
            category_id: categoryId,
        }, { preserveState: true });
    };

    const confirmDelete = (product: Product) => {
        setProductToDelete(product);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (!productToDelete) return;
        router.delete(adminProductsDestroy({ product: productToDelete.id }).url);
        setDeleteDialogOpen(false);
        setProductToDelete(null);
    };

    return (
        <>
            <Head title="Products" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">Products</h1>
                    <Link href={adminProductsCreate()}>
                        <Button>
                            <Plus className="size-4" />
                            New Product
                        </Button>
                    </Link>
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
                                    placeholder="Search by name or SKU..."
                                    className="pl-8"
                                />
                            </div>
                            <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); router.get(productsIndexUrl, { search, category_id: v }, { preserveState: true }); }}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All Categories</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground w-16"></th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">SKU</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Price</th>
                                        <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Stock</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                                        <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Featured</th>
                                        <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Status</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="px-4 py-8 text-center text-sm text-muted-foreground">
                                                No products found.
                                            </td>
                                        </tr>
                                    ) : (
                                        products.data.map((product) => (
                                            <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                                                <td className="px-4 py-3">
                                                    <div className="size-10 overflow-hidden rounded bg-muted">
                                                        {product.primary_image ? (
                                                            <img src={'/storage/' + product.primary_image.image_path} alt="" className="size-full object-cover" />
                                                        ) : (
                                                            <div className="flex size-full items-center justify-center">
                                                                <Package className="size-4 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">{product.sku}</td>
                                                <td className="px-4 py-3 text-sm">{formatPrice(product.price)}</td>
                                                <td className="px-4 py-3 text-center text-sm">{product.stock_quantity}</td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">{product.category?.name ?? '—'}</td>
                                                <td className="px-4 py-3 text-center">
                                                    {product.is_featured ? <Badge variant="default">Featured</Badge> : <Badge variant="outline">No</Badge>}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                                        {product.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={adminProductsEdit({ product: product.id })}>
                                                            <Button variant="outline" size="sm">
                                                                <Pencil className="size-3.5" />
                                                            </Button>
                                                        </Link>
                                                        <Button variant="destructive" size="sm" onClick={() => confirmDelete(product)}>
                                                            <Trash2 className="size-3.5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {products.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {products.links.map((link, i) => {
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

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Product</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: '#',
        },
    ],
};
