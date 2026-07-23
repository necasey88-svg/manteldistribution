import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Box, Building2, Palette, Store, Truck } from "lucide-react";
import { Container } from "@/components/container";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/data/products";

export default function Home() {
  const featured = products.filter(p => p.featured);
  return <>
    <section className="hero-shell">
      <Container className="grid min-h-[720px] items-stretch lg:grid-cols-[1.05fr_.95fr]">
        <div className="flex flex-col justify-center py-20 lg:pr-16">
          <p className="eyebrow">Trade-only · Nationwide distribution</p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[.98] text-white sm:text-6xl lg:text-7xl">Ten mantels.<br/><em className="font-normal text-clay">One stronger floor.</em></h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-white/72">A deliberately edited collection of precast fireplace mantels for hearth shops, contractors, interior designers, and national home-furnishings programs.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link href="/become-a-dealer" className="button-primary">Open a trade account <ArrowRight size={16}/></Link><Link href="/products" className="button-ghost">Explore the line</Link></div>
          <div className="mt-12 grid grid-cols-3 gap-5 border-t border-white/15 pt-7 text-white"><div><strong className="stat">10</strong><span className="stat-label">launch SKUs</span></div><div><strong className="stat">48</strong><span className="stat-label">states served</span></div><div><strong className="stat">16–24</strong><span className="stat-label">day production</span></div></div>
        </div>
        <div className="relative min-h-[460px] overflow-hidden lg:min-h-full"><Image src="/products/barossa.jpg" alt="Barossa precast mantel" fill priority className="object-cover" sizes="(max-width:1024px) 100vw, 50vw"/><div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent"/><div className="absolute bottom-8 left-8 right-8 flex items-end justify-between text-white"><div><p className="eyebrow text-white/70">Showroom statement</p><p className="mt-1 font-serif text-3xl">The Barossa</p></div><Link href="/products/barossa" className="round-link" aria-label="View Barossa"><ArrowRight/></Link></div></div>
      </Container>
    </section>

    <section className="bg-cream py-20"><Container><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><p className="eyebrow text-ember">The edited advantage</p><h2 className="section-title">Enough range to sell.<br/>Few enough to master.</h2><p className="section-copy">The launch line balances four modern profiles with six traditional best sellers. Dealers can merchandise the category clearly, quote faster, and stock samples without carrying a hundred-SKU burden.</p><Link href="/products" className="text-link">See all ten and pricing <ArrowRight size={16}/></Link></div><div className="grid sm:grid-cols-2 gap-px overflow-hidden border border-line bg-line">{[{icon:Store,title:"Fireplace shops",body:"A complete mantel category in one compact display program."},{icon:Building2,title:"Contractors",body:"Repeatable specifications, predictable lead times, job-site delivery."},{icon:Palette,title:"Interior designers",body:"Ten distinct profiles with a controlled, versatile finish palette."},{icon:Box,title:"National accounts",body:"Program pricing, samples, consolidated orders, and freight planning."}].map(({icon:Icon,title,body})=><div key={title} className="bg-white p-8"><Icon className="text-ember"/><h3 className="mt-7 font-serif text-2xl">{title}</h3><p className="mt-2 text-sm leading-6 text-ink-soft">{body}</p></div>)}</div></div></Container></section>

    <section className="bg-white py-20"><Container><div className="mb-10 flex items-end justify-between gap-4"><div><p className="eyebrow text-ember">The opening assortment</p><h2 className="section-title mt-3">Three anchors for every showroom.</h2></div><Link href="/products" className="text-link hidden sm:flex">View all ten <ArrowRight size={16}/></Link></div><div className="grid gap-6 lg:grid-cols-3">{featured.map(p=><ProductCard key={p.slug} product={p}/>)}</div></Container></section>

    <section className="bg-ink py-20 text-white"><Container><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow text-clay">Freight without guesswork</p><h2 className="mt-4 font-serif text-4xl sm:text-5xl">From our floor to your dock.</h2><p className="mt-5 max-w-md leading-7 text-white/65">Every unit is protected, crated, and palletized for commercial LTL. We quote freight before release and support dealer-arranged pickup.</p><Link href="/shipping-freight" className="button-ghost mt-8">See shipping program <Truck size={16}/></Link></div><ol className="grid gap-px bg-white/15 sm:grid-cols-3">{[["01","Quote","Send the SKU, finish, quantity, and ZIP."],["02","Approve","Receive product, crate, and freight as separate lines."],["03","Deliver","Dock, liftgate, or job-site service—your choice."]].map(([n,t,b])=><li key={n} className="bg-ink p-7"><span className="text-xs text-clay">{n}</span><h3 className="mt-12 font-serif text-2xl">{t}</h3><p className="mt-2 text-sm leading-6 text-white/60">{b}</p></li>)}</ol></div></Container></section>

    <section className="bg-clay py-14"><Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"><div><p className="eyebrow text-ink/55">Ready for the line review?</p><h2 className="mt-2 font-serif text-3xl text-ink">Request dealer pricing, samples, and freight.</h2></div><Link href="/become-a-dealer" className="button-dark">Start an account <ArrowRight size={16}/></Link></Container></section>
  </>;
}
