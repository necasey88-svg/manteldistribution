import Link from "next/link";
import { Container } from "@/components/container";

const finishes = [
  { name: "Paint Grade", description: "A prepared surface ready for a field-applied coating. Best when the mantel must match cabinetry, trim, or a project-specific paint schedule." },
  { name: "Smooth", description: "A clean, refined surface with minimal texture. The strongest all-around choice for modern and transitional interiors." },
  { name: "Stone World", description: "A deeply textured surface that recreates the character and variation of quarried stone. Best for traditional, rustic, and statement installations." },
];
const colors = [
  { name: "Chalk", tone: "#eeeae0", note: "Clean warm white", className: "text-ink" },
  { name: "Pearl", tone: "#d9d0bd", note: "Soft ivory neutral", className: "text-ink" },
  { name: "Sand", tone: "#b6a17f", note: "Natural warm beige", className: "text-ink" },
  { name: "Fog", tone: "#8f8b83", note: "Balanced greige", className: "text-white" },
];

export default function FinishesPage(){return <><section className="page-hero"><Container><p className="eyebrow text-clay">Three surfaces · Four core colors</p><h1 className="mt-4 font-serif text-5xl text-white sm:text-6xl">A finish program that stays focused.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">Twelve combinations cover the most useful white, ivory, beige, and greige specifications without overwhelming the showroom.</p></Container></section><Container className="py-16"><p className="eyebrow text-ember">Surface</p><div className="mt-6 grid gap-px bg-line md:grid-cols-3">{finishes.map((f,i)=><article key={f.name} className="bg-white p-7"><span className="font-serif text-3xl text-clay">0{i+1}</span><h2 className="mt-10 font-serif text-3xl">{f.name}</h2><p className="mt-3 text-sm leading-6 text-ink-soft">{f.description}</p></article>)}</div><div className="mt-16"><p className="eyebrow text-ember">Color</p><h2 className="mt-3 font-serif text-4xl">The core neutral palette</h2><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{colors.map(c=><article key={c.name} className={`flex aspect-[4/3] flex-col justify-end p-6 ${c.className}`} style={{backgroundColor:c.tone}}><h3 className="font-serif text-3xl">{c.name}</h3><p className="mt-1 text-xs uppercase tracking-widest opacity-70">{c.note}</p></article>)}</div><p className="mt-5 max-w-2xl text-xs leading-5 text-ink-soft">Screen colors are directional only. Precast materials include natural variation, and Stone World texture changes how a color reads in light. Approve a physical sample before ordering.</p></div><div className="mt-14 flex flex-wrap gap-3"><Link href="/contact" className="button-dark">Request finish samples</Link><Link href="/products" className="button-outline">Choose a mantel</Link></div></Container></>}
