import Link from "next/link";
import { Container } from "./container";
import { CartIndicator } from "./cart-indicator";

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/products?material=precast", label: "Precast" },
  { href: "/products?material=wood", label: "Wood" },
  { href: "/shipping-freight", label: "Shipping & Freight" },
  { href: "/become-a-dealer", label: "Become a Dealer" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper/95 backdrop-blur sticky top-0 z-40">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-steel-dark text-paper font-bold text-sm">
            HL
          </span>
          <span className="font-semibold tracking-tight text-ink text-lg leading-none">
            Hearthline
            <span className="block text-[10px] font-medium tracking-[0.2em] text-ink-soft uppercase">
              Supply Co.
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-ink-soft">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/contact"
            className="hidden sm:inline-flex text-sm font-medium text-ink-soft hover:text-ink transition-colors"
          >
            Contact
          </Link>
          <CartIndicator />
          <Link
            href="/dealer/login"
            className="inline-flex items-center rounded-sm bg-steel-dark px-4 py-2 text-sm font-semibold text-paper hover:bg-ink transition-colors"
          >
            Dealer Login
          </Link>
        </div>
      </Container>
    </header>
  );
}
