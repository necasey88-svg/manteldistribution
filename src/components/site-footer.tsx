import Link from "next/link";
import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-steel-dark text-paper">
      <Container className="py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-semibold tracking-tight text-lg">Hearthline Supply Co.</span>
          <p className="mt-3 text-sm text-paper/70 leading-relaxed">
            A focused precast mantel collection, shipped nationwide to
            fireplace dealers, contractors, designers, and trade accounts.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-paper/60">
            Catalog
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-paper/80">
            <li><Link href="/products?style=contemporary" className="hover:text-white">Contemporary</Link></li>
            <li><Link href="/products?style=traditional" className="hover:text-white">Traditional</Link></li>
            <li><Link href="/products" className="hover:text-white">The Hearthline Ten</Link></li>
            <li><Link href="/finishes" className="hover:text-white">Finishes & Colors</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-paper/60">
            Trade
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-paper/80">
            <li><Link href="/become-a-dealer" className="hover:text-white">Become a Dealer</Link></li>
            <li><Link href="/dealer/login" className="hover:text-white">Dealer Login</Link></li>
            <li><Link href="/shipping-freight" className="hover:text-white">Shipping & Freight</Link></li>
            <li><Link href="/brochure" className="hover:text-white">Trade Brochure</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-paper/60">
            Company
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-paper/80">
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-5 flex flex-col sm:flex-row gap-2 justify-between text-xs text-paper/50">
          <span>&copy; {new Date().getFullYear()} Hearthline Supply Co. All rights reserved.</span>
          <span>Distribution only &mdash; we do not offer installation services.</span>
        </Container>
      </div>
    </footer>
  );
}
