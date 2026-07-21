import { Head, Link, usePage } from '@inertiajs/react';
import { index as catalogIndex } from '@/routes/catalog';
import { show as catalogShow } from '@/routes/catalog';
import { PublicHeader } from '@/components/public-header';
import { PublicFooter } from '@/components/public-footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { Sofa, Truck, ShieldCheck, RefreshCw, ArrowRight, Star } from 'lucide-react';

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
    material: string | null;
    color: string | null;
    is_featured: boolean;
    primary_image: ProductImage | null;
};

type Category = {
    id: number;
    name: string;
    slug: string;
    products_count: number;
};

export default function Welcome() {
    const { featuredProducts, categories } = usePage<{
        featuredProducts: Product[];
        categories: Category[];
    }>().props;

    const heroImage = featuredProducts[0]?.primary_image?.image_path ?? null;

    return (
        <>
            <Head title="SA Funeral Supplies — Funeral Furniture &amp; Services">
                <meta name="description" content="Quality funeral furniture and memorial supplies across South Africa. Coffins, caskets, memorial accessories and more — delivered with compassion." />
                <meta property="og:title" content="SA Funeral Supplies — Funeral Furniture &amp; Services" />
                <meta property="og:description" content="Compassionate funeral furniture and memorial supplies. Quality craftsmanship for your loved one's final farewell." />
                {heroImage && <meta property="og:image" content={`/storage/${heroImage}`} />}
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>

            <div className="flex min-h-screen flex-col">
                <PublicHeader />

                <main className="flex-1">
                    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-white dark:from-neutral-950 dark:to-neutral-900">
                        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
                            <div className="grid items-center gap-12 lg:grid-cols-2">
                                <div>
                                    <Badge variant="outline" className="mb-4 border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400">
                                        Serving South Africa with Dignity
                                    </Badge>
                                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                                        Funeral Furniture
                                        <span className="text-amber-600"> &amp; Supplies</span>
                                    </h1>
                                    <p className="mt-4 text-lg text-muted-foreground">
                                        Compassionate service, quality craftsmanship. From coffins and caskets to memorial accessories — everything you need with care and respect.
                                    </p>
                                    <div className="mt-8 flex flex-wrap gap-4">
                                        <Link href={catalogIndex()}>
                                            <Button size="lg" className="gap-2">
                                                Browse Catalog
                                                <ArrowRight className="size-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`${catalogIndex().url}?is_featured=1`}>
                                            <Button variant="outline" size="lg">
                                                View Featured
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-xl lg:aspect-[4/3]">
                                    {heroImage ? (
                                        <img
                                            src={'/storage/' + heroImage}
                                            alt="Featured furniture collection"
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex size-full items-center justify-center">
                                            <Sofa className="size-32 text-amber-200/60 dark:text-amber-800/40" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {featuredProducts.length > 0 && (
                        <section className="py-16 sm:py-20">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Featured Items</h2>
                                        <p className="mt-2 text-muted-foreground">Handpicked selections from our range</p>
                                    </div>
                                    <Link href={`${catalogIndex().url}?is_featured=1`}>
                                        <Button variant="ghost" className="gap-1">
                                            View All <ArrowRight className="size-4" />
                                        </Button>
                                    </Link>
                                </div>
                                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                    {featuredProducts.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={catalogShow({ product: product.slug })}
                                            className="group block"
                                        >
                                            <div className="overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
                                                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                                    {product.primary_image ? (
                                                        <img
                                                            src={'/storage/' + product.primary_image.image_path}
                                                            alt={product.name}
                                                            loading="lazy"
                                                            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex size-full items-center justify-center">
                                                            <Sofa className="size-12 text-muted-foreground/30" />
                                                        </div>
                                                    )}
                                                    <Badge className="absolute left-2 top-2 bg-amber-600 hover:bg-amber-700">Featured</Badge>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="truncate text-sm font-medium">{product.name}</h3>
                                                    <p className="mt-1 text-lg font-semibold">{formatPrice(product.price)}</p>
                                                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                                        {product.material && <span>{product.material}</span>}
                                                        {product.material && product.color && <span>·</span>}
                                                        {product.color && <span>{product.color}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {categories.length > 0 && (
                        <section className="bg-neutral-50 py-16 sm:py-20 dark:bg-neutral-900/50">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="text-center">
                                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Shop by Category</h2>
                                    <p className="mt-2 text-muted-foreground">Find exactly what you need</p>
                                </div>
                                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`${catalogIndex().url}?categories=${category.slug}`}
                                            className="group relative overflow-hidden rounded-xl border bg-card p-8 shadow-sm transition-all hover:shadow-md"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex size-12 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                    <Sofa className="size-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold group-hover:text-amber-600 transition-colors">{category.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{category.products_count} products</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="py-16 sm:py-20">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <h2 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">Why Choose Us</h2>
                            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="text-center">
                                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                        <Truck className="size-6" />
                                    </div>
                                    <h3 className="mt-4 font-semibold">Nationwide Delivery</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">Reliable delivery across all provinces</p>
                                </div>
                                <div className="text-center">
                                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                        <ShieldCheck className="size-6" />
                                    </div>
                                    <h3 className="mt-4 font-semibold">Compassionate Service</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">Serving families with dignity and care</p>
                                </div>
                                <div className="text-center">
                                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                        <RefreshCw className="size-6" />
                                    </div>
                                    <h3 className="mt-4 font-semibold">Easy Process</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">Simple ordering and prompt response</p>
                                </div>
                                <div className="text-center">
                                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                        <Star className="size-6" />
                                    </div>
                                    <h3 className="mt-4 font-semibold">Quality Craftsmanship</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">Premium materials and fine workmanship</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-amber-600 py-16 dark:bg-amber-800">
                        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">We Are Here for You</h2>
                            <p className="mt-3 text-lg text-amber-100">Browse our catalog of funeral furniture and memorial supplies.</p>
                            <Link href={catalogIndex()}>
                                <Button size="lg" variant="secondary" className="mt-6 gap-2 bg-white text-amber-700 hover:bg-amber-50">
                                    Explore Catalog <ArrowRight className="size-4" />
                                </Button>
                            </Link>
                        </div>
                    </section>
                </main>

                <PublicFooter />
            </div>
        </>
    );
}
