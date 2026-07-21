import { Head, useForm, usePage } from '@inertiajs/react';
import { index as adminProductsIndex, create as adminProductsCreate, store as adminProductsStore, edit as adminProductsEdit, update as adminProductsUpdate, destroy as adminProductsDestroy } from '@/routes/admin/products';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import Heading from '@/components/heading';

type Category = {
    id: number;
    name: string;
    children?: Category[];
};

export default function Create() {
    const { parentCategories } = usePage<{ parentCategories: Category[] }>().props;
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        price: '',
        sku: '',
        stock_quantity: 0,
        category_id: '',
        material: '',
        color: '',
        width: '',
        height: '',
        depth: '',
        weight: '',
        is_active: true,
        is_featured: false,
        images: [] as File[],
    });

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setData('name', name);
        if (!slugManuallyEdited) {
            setData('slug', name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(adminProductsStore().url, {
            preserveScroll: true,
        });
    };

    const renderCategoryOptions = (cats: Category[], depth = 0) => {
        return cats.map((cat) => (
            <SelectItem key={cat.id} value={String(cat.id)}>
                {'— '.repeat(depth)}{cat.name}
                {cat.children?.map((child) => renderCategoryOptions([child], depth + 1))}
            </SelectItem>
        ));
    };

    return (
        <>
            <Head title="Create Product" />

            <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                <Heading title="Create Product" description="Add a new product to the catalog" />

                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Enter the product details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={data.name} onChange={handleNameChange} placeholder="Product name" required />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" value={data.slug} onChange={(e) => { setSlugManuallyEdited(true); setData('slug', e.target.value); }} placeholder="product-slug" />
                            <InputError message={errors.slug} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder="Product description" className="border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-24 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive resize-y" />
                            <InputError message={errors.description} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price</Label>
                                <Input id="price" type="number" step="0.01" min="0" value={data.price} onChange={(e) => setData('price', e.target.value)} placeholder="0.00" required />
                                <InputError message={errors.price} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sku">SKU</Label>
                                <Input id="sku" value={data.sku} onChange={(e) => setData('sku', e.target.value)} placeholder="FUR-001" required />
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
                                <Input id="material" value={data.material} onChange={(e) => setData('material', e.target.value)} placeholder="e.g. Oak Wood" />
                                <InputError message={errors.material} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="color">Color</Label>
                                <Input id="color" value={data.color} onChange={(e) => setData('color', e.target.value)} placeholder="e.g. Walnut" />
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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="weight">Weight (kg)</Label>
                                <Input id="weight" type="number" step="0.01" min="0" value={data.weight} onChange={(e) => setData('weight', e.target.value)} />
                                <InputError message={errors.weight} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Images</CardTitle>
                        <CardDescription>Upload product images (JPEG, PNG, WebP, max 5MB each)</CardDescription>
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
                    <Button disabled={processing}>Create Product</Button>
                </div>
            </form>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Products',
            href: adminProductsIndex(),
        },
        {
            title: 'Create',
            href: '#',
        },
    ],
};
