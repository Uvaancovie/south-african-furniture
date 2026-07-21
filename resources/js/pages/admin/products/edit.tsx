import { Head, useForm, usePage } from '@inertiajs/react';
import { index as adminProductsIndex, create as adminProductsCreate, store as adminProductsStore, edit as adminProductsEdit, update as adminProductsUpdate, destroy as adminProductsDestroy } from '@/routes/admin/products';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import Heading from '@/components/heading';

type ProductImage = {
    id: number;
    image_path: string;
    alt_text: string | null;
    sort_order: number;
    is_primary: boolean;
};

type Category = {
    id: number;
    name: string;
    children?: Category[];
};

export default function Edit() {
    const { product, parentCategories } = usePage<{
        product: {
            id: number;
            name: string;
            slug: string;
            description: string;
            price: number;
            sku: string;
            stock_quantity: number;
            category_id: number | null;
            material: string | null;
            color: string | null;
            width: number | null;
            height: number | null;
            depth: number | null;
            weight: number | null;
            is_active: boolean;
            is_featured: boolean;
            images: ProductImage[];
        };
        parentCategories: Category[];
    }>().props;

    const { data, setData, patch, processing, errors } = useForm({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: String(product.price),
        sku: product.sku,
        stock_quantity: product.stock_quantity,
        category_id: String(product.category_id ?? ''),
        material: product.material ?? '',
        color: product.color ?? '',
        width: product.width ? String(product.width) : '',
        height: product.height ? String(product.height) : '',
        depth: product.depth ? String(product.depth) : '',
        weight: product.weight ? String(product.weight) : '',
        is_active: product.is_active,
        is_featured: product.is_featured,
        images: [] as File[],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(adminProductsUpdate({ product: product.id }).url, {
            preserveScroll: true,
        });
    };

    const renderCategoryOptions = (cats: Category[], depth = 0): React.ReactNode[] => {
        return cats.flatMap((cat) => [
            <SelectItem key={cat.id} value={String(cat.id)}>
                {'— '.repeat(depth)}{cat.name}
            </SelectItem>,
            ...(cat.children ? renderCategoryOptions(cat.children, depth + 1) : []),
        ]);
    };

    return (
        <>
            <Head title={`Edit "${product.name}"`} />

            <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                <Heading title={`Edit "${product.name}"`} description="Update the product information" />

                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Update the product details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                            <InputError message={errors.slug} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} className="border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-24 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive resize-y" />
                            <InputError message={errors.description} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price</Label>
                                <Input id="price" type="number" step="0.01" min="0" value={data.price} onChange={(e) => setData('price', e.target.value)} required />
                                <InputError message={errors.price} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sku">SKU</Label>
                                <Input id="sku" value={data.sku} onChange={(e) => setData('sku', e.target.value)} required />
                                <InputError message={errors.sku} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                                <Input id="stock_quantity" type="number" min="0" value={data.stock_quantity} onChange={(e) => setData('stock_quantity', Number(e.target.value))} />
                                <InputError message={errors.stock_quantity} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Category</Label>
                                <Select value={data.category_id} onValueChange={(v) => setData('category_id', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">None</SelectItem>
                                        {renderCategoryOptions(parentCategories)}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.category_id} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                        <CardDescription>Material, color, and dimensions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="material">Material</Label>
                                <Input id="material" value={data.material} onChange={(e) => setData('material', e.target.value)} />
                                <InputError message={errors.material} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="color">Color</Label>
                                <Input id="color" value={data.color} onChange={(e) => setData('color', e.target.value)} />
                                <InputError message={errors.color} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="width">Width (inches)</Label>
                                <Input id="width" type="number" step="0.01" min="0" value={data.width} onChange={(e) => setData('width', e.target.value)} />
                                <InputError message={errors.width} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="height">Height (inches)</Label>
                                <Input id="height" type="number" step="0.01" min="0" value={data.height} onChange={(e) => setData('height', e.target.value)} />
                                <InputError message={errors.height} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="depth">Depth (inches)</Label>
                                <Input id="depth" type="number" step="0.01" min="0" value={data.depth} onChange={(e) => setData('depth', e.target.value)} />
                                <InputError message={errors.depth} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input id="weight" type="number" step="0.01" min="0" value={data.weight} onChange={(e) => setData('weight', e.target.value)} />
                            <InputError message={errors.weight} />
                        </div>
                    </CardContent>
                </Card>

                {product.images.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Images</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                {product.images.map((img) => (
                                    <div key={img.id} className="relative size-24 overflow-hidden rounded-md border">
                                        <img src={'/storage/' + img.image_path} alt="" className="size-full object-cover" />
                                        {img.is_primary && (
                                            <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-xs text-center py-0.5">Primary</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Add Images</CardTitle>
                        <CardDescription>Upload additional images (JPEG, PNG, WebP, max 5MB each)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => setData('images', Array.from(e.target.files || []))}
                        />
                        <InputError message={errors.images} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked === true)} />
                                <Label htmlFor="is_active">Active</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="is_featured" checked={data.is_featured} onCheckedChange={(checked) => setData('is_featured', checked === true)} />
                                <Label htmlFor="is_featured">Featured</Label>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-4">
                    <Button disabled={processing}>Update Product</Button>
                </div>
            </form>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: adminProductsIndex(),
        },
        {
            title: 'Edit',
            href: '#',
        },
    ],
};
