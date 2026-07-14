"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dealer/dashboard", label: "Dashboard" },
  { href: "/dealer/catalog", label: "Catalog" },
  { href: "/dealer/cart", label: "PO Cart" },
  { href: "/dealer/purchase-orders", label: "Purchase Orders" },
  { href: "/dealer/orders", label: "Order History" },
  { href: "/dealer/account", label: "Account" },
];

export function DealerNav({ companyName }: { companyName?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/dealer/login");
    router.refresh();
  }

  return (
    <div className="border-b border-line bg-white">
      <div className="container-page flex items-center justify-between h-12 text-sm">
        <nav className="flex gap-1 overflow-x-auto">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-sm font-medium whitespace-nowrap transition-colors",
                pathname === link.href
                  ? "bg-paper-dim text-ink"
                  : "text-ink-soft hover:text-ink"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 shrink-0 pl-3">
          {companyName && (
            <span className="text-ink-soft text-xs hidden sm:inline">{companyName}</span>
          )}
          <button onClick={handleSignOut} className="text-ink-soft hover:text-warn font-medium">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
