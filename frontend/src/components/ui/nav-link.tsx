"use client";

import { usePathname } from "next/navigation";
import Link, { LinkProps } from "next/link";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface NavLinkProps extends LinkProps {
    className?: string;
    activeClassName?: string;
    children: React.ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
    ({ className, activeClassName, href, children, ...props }, ref) => {
        const pathname = usePathname();
        const isActive = pathname === href;

        return (
            <Link
                ref={ref}
                href={href}
                className={cn(className, isActive && activeClassName)}
                {...props}
            >
                {children}
            </Link>
        );
    }
);

NavLink.displayName = "NavLink";

export { NavLink };
