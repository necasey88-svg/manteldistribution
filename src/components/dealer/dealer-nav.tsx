"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDealerCart } from "@/lib/dealer-cart-context";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dealer/dashboard", label: "Dashboard" },
  { href: "/dealer/catalog", label: "Catalog" },
  { href: "/dealer/cart", label: "Order Builder" },
  { href: "/dealer/orders", label: "Orders" },
  { href: "/dealer/account", label: "Account" },
];

export function DealerNav({ companyName }: { companyName?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { lines } = useDealerCart();
  const cartCount = lines.reduce((sum, line) => sum + line.qty, 0);

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
                "px-3 py-1.5 rounded-sm font-medium whitespace-nowrap transition-colors inline-flex items-center gap-1.5",
                pathname === link.href
                  ? "bg-paper-dim text-ink"
                  : "text-ink-soft hover:text-ink"
              )}
            >
              {link.label}
              {link.href === "/dealer/cart" && cartCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-ember text-white text-[10px] font-bold leading-none">
                  {cartCount}
                </span>
              )}
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
