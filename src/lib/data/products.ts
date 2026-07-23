export type MantelMaterial = "precast";
export type MantelStyle = "contemporary" | "traditional";

export interface Product {
  slug: string;
  name: string;
  material: MantelMaterial;
  style: MantelStyle;
  collection: string;
  description: string;
  dealerStory: string;
  priceCents: number;
  msrpCents: number;
  leadTimeDays: number;
  dimensions: string;
  weightLbs: number;
  finish: string[];
  minOrderQty: number;
  sku: string;
  inStock: boolean;
  image: string;
  featured?: boolean;
}

// Recommended launch pricing. Confirm against landed COGS before accepting live orders.
export const products: Product[] = [
  { slug: "bolte", name: "Bolte", material: "precast", style: "contemporary", collection: "Modern Line", description: "A crisp geometric surround with a slim, architectural profile for gas, electric, and masonry fireboxes.", dealerStory: "The dependable modern floor model: visually clean, easy to specify, and broad enough for builders and design firms.", priceCents: 89500, msrpCents: 169500, leadTimeDays: 18, dimensions: '60–72" overall width', weightLbs: 285, finish: ["Limestone", "Warm White", "Graphite"], minOrderQty: 1, sku: "HS-PC-BOL", inStock: true, image: "/products/bolte.png", featured: true },
  { slug: "sausalito", name: "Sausalito", material: "precast", style: "contemporary", collection: "Modern Line", description: "Minimal planes and balanced proportions give this surround a quiet, gallery-like presence.", dealerStory: "A strong designer-facing option for warm-minimal and California contemporary projects.", priceCents: 99500, msrpCents: 189500, leadTimeDays: 18, dimensions: '60–72" overall width', weightLbs: 305, finish: ["Limestone", "Warm White", "Pewter"], minOrderQty: 1, sku: "HS-PC-SAU", inStock: true, image: "/products/sausalito.png", featured: true },
  { slug: "woomera", name: "Woomera", material: "precast", style: "contemporary", collection: "Modern Line", description: "A streamlined surround with subtle depth and a versatile neutral silhouette.", dealerStory: "The volume-friendly contemporary choice for production builders and multi-home programs.", priceCents: 82500, msrpCents: 159500, leadTimeDays: 16, dimensions: '58–70" overall width', weightLbs: 265, finish: ["Limestone", "Warm White", "Sandstone"], minOrderQty: 1, sku: "HS-PC-WOO", inStock: true, image: "/products/woomera.png" },
  { slug: "turin", name: "Turin", material: "precast", style: "contemporary", collection: "Modern Line", description: "A substantial modern surround with strong horizontals and a refined, low-ornament profile.", dealerStory: "An upgraded modern option with enough presence for luxury great rooms and hospitality settings.", priceCents: 112500, msrpCents: 219500, leadTimeDays: 21, dimensions: '66–78" overall width', weightLbs: 340, finish: ["Limestone", "Warm White", "Graphite"], minOrderQty: 1, sku: "HS-PC-TUR", inStock: true, image: "/products/turin.png" },
  { slug: "barossa", name: "Barossa", material: "precast", style: "traditional", collection: "Heritage Line", description: "Fluted pilasters, decorative corbels, and a deep shelf create a richly detailed traditional focal point.", dealerStory: "The statement piece of the assortment—ideal for premium showroom vignettes and custom-home work.", priceCents: 149500, msrpCents: 289500, leadTimeDays: 24, dimensions: '72–84" overall width', weightLbs: 410, finish: ["Limestone", "Aged Ivory", "Antique Buff"], minOrderQty: 1, sku: "HS-PC-BAR", inStock: false, image: "/products/barossa.png", featured: true },
  { slug: "tonso", name: "Tonso", material: "precast", style: "traditional", collection: "Heritage Line", description: "Tapered columns, a clean frieze, and a generous shelf bridge traditional and transitional interiors.", dealerStory: "A versatile classic that gives dealers a traditional look without excessive ornamentation.", priceCents: 109500, msrpCents: 209500, leadTimeDays: 21, dimensions: '66–78" overall width', weightLbs: 335, finish: ["Limestone", "Warm White", "Antique Buff"], minOrderQty: 1, sku: "HS-PC-TON", inStock: true, image: "/products/tonso.png" },
  { slug: "padthaway", name: "Padthaway", material: "precast", style: "traditional", collection: "Heritage Line", description: "Elegant pilasters and restrained detailing make this a timeless, approachable surround.", dealerStory: "The safest traditional opening price point for independent hearth shops and remodeling contractors.", priceCents: 79500, msrpCents: 149500, leadTimeDays: 16, dimensions: '58–70" overall width', weightLbs: 275, finish: ["Limestone", "Warm White", "Sandstone"], minOrderQty: 1, sku: "HS-PC-PAD", inStock: true, image: "/products/padthaway.png" },
  { slug: "bondi", name: "Bondi", material: "precast", style: "traditional", collection: "Heritage Line", description: "Clean pilaster legs and a subtly detailed frieze create balanced, familiar proportions.", dealerStory: "A broad-appeal showroom staple suited to both formal and relaxed traditional rooms.", priceCents: 92500, msrpCents: 179500, leadTimeDays: 18, dimensions: '60–72" overall width', weightLbs: 300, finish: ["Limestone", "Aged Ivory", "Sandstone"], minOrderQty: 1, sku: "HS-PC-BON", inStock: true, image: "/products/bondi.png" },
  { slug: "pitcairn", name: "Pitcairn", material: "precast", style: "traditional", collection: "Heritage Line", description: "Classical pilasters, cornice molding, and a generous shelf bring polished architectural character.", dealerStory: "A step-up traditional profile that supports healthy ticket size without moving into ornate territory.", priceCents: 119500, msrpCents: 229500, leadTimeDays: 21, dimensions: '66–78" overall width', weightLbs: 360, finish: ["Limestone", "Aged Ivory", "Antique Buff"], minOrderQty: 1, sku: "HS-PC-PIT", inStock: false, image: "/products/pitcairn.png" },
  { slug: "queensland", name: "Queensland", material: "precast", style: "traditional", collection: "Estate Line", description: "Broad columns and a commanding shelf give this surround the scale required for estate-sized rooms.", dealerStory: "The grand-scale anchor for luxury residential, hospitality, and national furnishings conversations.", priceCents: 139500, msrpCents: 269500, leadTimeDays: 24, dimensions: '78–90" overall width', weightLbs: 435, finish: ["Limestone", "Aged Ivory", "Antique Buff"], minOrderQty: 1, sku: "HS-PC-QUE", inStock: false, image: "/products/queensland.png" },
];

export function getProductBySlug(slug: string) { return products.find((p) => p.slug === slug); }
export function getProductBySku(sku: string) { return products.find((p) => p.sku === sku); }
export function getProductsByMaterial() { return products; }
