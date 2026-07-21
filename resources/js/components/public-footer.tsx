import { Link } from '@inertiajs/react';
import { home, dashboard } from '@/routes';
import { index as catalogIndex } from '@/routes/catalog';
import { ShoppingBag } from 'lucide-react';

export function PublicFooter() {
    return (
        <footer className="border-t bg-neutral-50 dark:bg-neutral-900">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <Link href={home()} className="flex items-center gap-2">
                            <ShoppingBag className="size-5 text-amber-600" />
                            <span className="font-semibold">SA Funeral Supplies</span>
                        </Link>
                        <p className="mt-3 text-sm text-muted-foreground">
                            Quality funeral furniture and memorial supplies with compassion and care.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Quick Links</h3>
                        <ul className="mt-3 space-y-2">
                            <li>
                                <Link href={home()} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link href={catalogIndex()} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Catalog</Link>
                            </li>
                            <li>
                                <Link href={dashboard()} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Contact</h3>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                            <li>info@safunerals.co.za</li>
                            <li>+27 11 234 5678</li>
                            <li>Johannesburg, South Africa</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} SA Funeral Supplies. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
