import { Head, useForm } from '@inertiajs/react';
import { index as adminCategoriesIndex, create as adminCategoriesCreate, store as adminCategoriesStore, edit as adminCategoriesEdit, update as adminCategoriesUpdate, destroy as adminCategoriesDestroy } from '@/routes/admin/categories';
import { usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import Heading from '@/components/heading';

type ParentCategory = {
    id: number;
    name: string;
    depth?: number;
};

type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    parent_id: number | null;
    parent: { name: string } | null;
    sort_order: number;
    is_active: boolean;
};

type PageProps = {
    category: Category;
    parentCategories: ParentCategory[];
};

export default function Edit() {
    const { category, parentCategories } = usePage<PageProps>().props;

    const { data, setData, patch, processing, errors } = useForm({
        name: category.name,
        slug: category.slug,
        description: category.description ?? '',
        parent_id: String(category.parent_id ?? ''),
        sort_order: category.sort_order,
        is_active: category.is_active,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(adminCategoriesUpdate({ category: category.id }).url);
    };

    return (
        <>
            <Head title={`Edit "${category.name}"`} />

            <form onSubmit={submit} className="space-y-6">
                <Heading
                    title={`Edit "${category.name}"`}
                    description="Update the category information"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                        <CardDescription>
                            Update the category information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Category name"
                                required
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value)}
                                placeholder="category-slug"
                            />
                            <InputError message={errors.slug} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Category description"
                                className="border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-20 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive resize-y"
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="parent_id">Parent Category</Label>
                            <Select
                                value={data.parent_id}
                                onValueChange={(value) =>
                                    setData('parent_id', value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="None" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">
                                        None
                                    </SelectItem>
                                    {parentCategories
                                        .filter((cat) => cat.id !== category.id)
                                        .map((cat) => (
                                            <SelectItem
                                                key={cat.id}
                                                value={String(cat.id)}
                                            >
                                                {'— '.repeat(cat.depth ?? 0)}
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.parent_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="sort_order">Sort Order</Label>
                            <Input
                                id="sort_order"
                                type="number"
                                value={data.sort_order}
                                onChange={(e) =>
                                    setData(
                                        'sort_order',
                                        Number(e.target.value),
                                    )
                                }
                                placeholder="0"
                            />
                            <InputError message={errors.sort_order} />
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) =>
                                    setData('is_active', checked === true)
                                }
                            />
                            <Label htmlFor="is_active">Active</Label>
                            <InputError message={errors.is_active} />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center gap-4">
                    <Button disabled={processing}>Update Category</Button>
                </div>
            </form>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: adminCategoriesIndex(),
        },
        {
            title: 'Edit',
            href: '#',
        },
    ],
};
