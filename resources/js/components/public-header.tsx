import { Link, usePage } from '@inertiajs/react';
import { home, login, register, dashboard } from '@/routes';
import { index as catalogIndex } from '@/routes/catalog';
import { index as cartIndex } from '@/routes/cart';
import { ShoppingBag, ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn, toUrl } from '@/lib/utils';

function NavLink({ href, children, onClick }: { href: Parameters<typeof Link>[0]['href']; children: React.ReactNode; onClick?: () => void }) {
    const { url } = usePage();
    const target = typeof href === 'string' ? href : href?.url ?? '/';
    const isActive = url === target || (target !== '/' && url.startsWith(target));

    return (
        <Link
            href={href}
            onClick={onClick}
            className={cn(
                'text-sm font-medium transition-colors',
                isActive
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-muted-foreground hover:text-foreground'
            )}
        >
            {children}
        </Link>
    );
}

export function PublicHeader() {
    const { auth, cart_count } = usePage<{ auth: { user: any }; cart_count: number }>().props;
    const cartCount = cart_count ?? 0;
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-neutral-950/95 dark:supports-[backdrop-filter]:bg-neutral-950/60">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href={home()} className="flex items-center gap-2">
                    <ShoppingBag className="size-6 text-amber-600" />
                    <span className="text-lg font-semibold tracking-tight">SA Funeral Supplies</span>
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    <NavLink href={home()}>Home</NavLink>
                    <NavLink href={catalogIndex()}>Catalog</NavLink>
                    <NavLink href={cartIndex()}>
                        <span className="relative inline-flex">
                            <ShoppingCart className="size-5" />
                            {cartCount > 0 && (
                                <span className="absolute -right-2 -top-2 flex size-4 animate-in fade-in zoom-in items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white">
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </span>
                    </NavLink>
                    {auth.user ? (
                        <Link href={dashboard()}>
                            <Button size="sm">Dashboard</Button>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href={login()}>
                                <Button variant="ghost" size="sm">Log in</Button>
                            </Link>
                            <Link href={register()}>
                                <Button size="sm">Register</Button>
                            </Link>
                        </div>
                    )}
                </nav>

                <button
                    type="button"
                    className="relative md:hidden"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="size-5" /> : (
                        <span className="relative inline-flex">
                            <Menu className="size-5" />
                        </span>
                    )}
                </button>
            </div>

            {mobileOpen && (
                <div className="border-t md:hidden">
                    <nav className="flex flex-col gap-3 px-4 py-4">
                        <NavLink href={home()} onClick={() => setMobileOpen(false)}>Home</NavLink>
                        <NavLink href={catalogIndex()} onClick={() => setMobileOpen(false)}>Catalog</NavLink>
                        <NavLink href={cartIndex()} onClick={() => setMobileOpen(false)}>
                            Cart {cartCount > 0 && `(${cartCount})`}
                        </NavLink>
                        {auth.user ? (
                            <Link href={dashboard()} onClick={() => setMobileOpen(false)}>
                                <Button size="sm" className="w-full">Dashboard</Button>
                            </Link>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link href={login()} onClick={() => setMobileOpen(false)}>
                                    <Button variant="outline" size="sm" className="w-full">Log in</Button>
                                </Link>
                                <Link href={register()} onClick={() => setMobileOpen(false)}>
                                    <Button size="sm" className="w-full">Register</Button>
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}
