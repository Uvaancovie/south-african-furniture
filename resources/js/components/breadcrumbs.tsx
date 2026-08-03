import { Link } from '@inertiajs/react';
import { Fragment } from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function Breadcrumbs({
    breadcrumbs,
}: {
    breadcrumbs: BreadcrumbItemType[];
}) {
    const showEllipsis = breadcrumbs.length > 3;

    return (
        <>
            {breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((item, index) => {
                            const isFirst = index === 0;
                            const isLast = index === breadcrumbs.length - 1;
                            const isSecond = index === 1;
                            const isHiddenOnMobile = showEllipsis && !isFirst && !isLast;

                            return (
                                <Fragment key={index}>
                                    {showEllipsis && isSecond && (
                                        <Fragment>
                                            <BreadcrumbItem className="md:hidden">
                                                <BreadcrumbEllipsis />
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator className="md:hidden" />
                                        </Fragment>
                                    )}

                                    <BreadcrumbItem className={isHiddenOnMobile ? "hidden md:inline-flex" : ""}>
                                        {isLast ? (
                                            <BreadcrumbPage>
                                                {item.title}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link href={item.href}>
                                                    {item.title}
                                                </Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && (
                                        <BreadcrumbSeparator className={isHiddenOnMobile ? "hidden md:block" : ""} />
                                    )}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </>
    );
}
