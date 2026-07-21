import { Head, Link, router, usePage } from '@inertiajs/react';
import { index as adminCategoriesIndex, create as adminCategoriesCreate, store as adminCategoriesStore, edit as adminCategoriesEdit, update as adminCategoriesUpdate, destroy as adminCategoriesDestroy } from '@/routes/admin/categories';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Pencil, Plus, Trash2 } from 'lucide-react';

type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    parent_id: number | null;
    parent: { name: string } | null;
    sort_order: number;
    is_active: boolean;
    products_count: number;
    children_count: number;
    created_at: string;
};

type PageProps = {
    categories: Category[];
};

export default function Index() {
    const { categories } = usePage<PageProps>().props;
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    useFlashToast();

    const confirmDelete = (category: Category) => {
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (!categoryToDelete) return;

        router.delete(adminCategoriesDestroy({ category: categoryToDelete.id }).url);
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
    };

    return (
        <>
            <Head title="Categories" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">Categories</h1>
                    <Link href={adminCategoriesCreate()}>
                        <Button>
                            <Plus className="size-4" />
                            New Category
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Categories</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Slug</th>
                                        <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Products</th>
                                        <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Children</th>
                                        <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">Status</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-8 text-center text-sm text-muted-foreground"
                                            >
                                                No categories found.
                                            </td>
                                        </tr>
                                    ) : (
                                        categories.map((category) => (
                                            <tr
                                                key={category.id}
                                                className="border-b border-border last:border-0 hover:bg-muted/50"
                                            >
                                                <td className="px-4 py-3 text-sm font-medium">
                                                    {category.name}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                                    {category.slug}
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm">
                                                    {category.products_count}
                                                </td>
                                                <td className="px-4 py-3 text-center text-sm">
                                                    {category.children_count}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Badge variant={category.is_active ? 'default' : 'secondary'}>
                                                        {category.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={adminCategoriesEdit({ category: category.id })}>
                                                            <Button variant="outline" size="sm">
                                                                <Pencil className="size-3.5" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => confirmDelete(category)}
                                                        >
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
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{' '}
                            <strong>{categoryToDelete?.name}</strong>? This action
                            cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: '#',
        },
    ],
};
