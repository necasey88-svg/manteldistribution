export type MantelMaterial = "precast";
export type MantelStyle = "contemporary" | "traditional";
export const FINISHES = ["Paint Grade", "Smooth", "Stone World"] as const;
export const COLORS = ["Chalk", "Pearl", "Sand", "Fog"] as const;
export const HEARTH_OPTIONS = ["No Hearth", "Ogee Edge Hearth", "Square Edge Hearth"] as const;
export type ProductFinish = (typeof FINISHES)[number];
export type ProductColor = (typeof COLORS)[number];
export type HearthOption = (typeof HEARTH_OPTIONS)[number];

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
  finishes: ProductFinish[];
  colors: ProductColor[];
  minOrderQty: number;
  sku: string;
  inStock: boolean;
  image: string;
  featured?: boolean;
}

const sharedOptions = { finishes: [...FINISHES], colors: [...COLORS] };

// Public Hearthline catalog only. Manufacturing identities live in a server-only map.
export const products: Product[] = [
  { slug: "meridian", name: "Meridian", material: "precast", style: "contemporary", collection: "Contour Collection", description: "A crisp geometric surround with a slim, architectural profile for gas, electric, and masonry fireboxes.", dealerStory: "The dependable modern floor model: visually clean, easy to specify, and broad enough for builders and design firms.", priceCents: 89500, msrpCents: 169500, leadTimeDays: 18, dimensions: '60–72" overall width', weightLbs: 285, ...sharedOptions, minOrderQty: 1, sku: "HS-PC-MER", inStock: true, image: "/products/meridian.jpg", featured: true },
  { slug: "ridgeline", name: "Ridgeline", material: "precast", style: "contemporary", collection: "Contour Collection", description: "Minimal planes and balanced proportions give this surround a quiet, gallery-like presence.", dealerStory: "A strong designer-facing option for warm-minimal and contemporary projects.", priceCents: 99500, msrpCents: 189500, leadTimeDays: 18, dimensions: '60–72" overall width', weightLbs: 305, ...sharedOptions, minOrderQty: 1, sku: "HS-PC-RID", inStock: true, image: "/products/ridgeline.jpg", featured: true },
  { slug: "mesa", name: "Mesa", material: "precast", style: "contemporary", collection: "Contour Collection", description: "A streamlined surround with subtle depth and a versatile neutral silhouette.", dealerStory: "The volume-friendly contemporary choice for production builders and multi-home programs.", priceCents: 82500, msrpCents: 159500, leadTimeDays: 16, dimensions: '58–70" overall width', weightLbs: 265, ...sharedOptions, minOrderQty: 1, sku: "HS-PC-MES", inStock: true, image: "/products/mesa.jpg" },
  { slug: "summit", name: "Summit", material: "precast", style: "contemporary", collection: "Contour Collection", description: "A substantial modern surround with strong horizontals and a refined, low-ornament profile.", dealerStory: "An upgraded modern option with enough presence for luxury great rooms and hospitality settings.", priceCents: 112500, msrpCents: 219500, leadTimeDays: 21, dimensions: '66–78" overall width', weightLbs: 340, ...sharedOptions, minOrderQty: 1, sku: "HS-PC-SUM", inStock: true, image: "/products/summit.jpg" },
  { slug: "hawthorne", name: "Hawthorne", material: "precast", style: "traditional", collection: "Homestead Collection", description: "Fluted pilasters, decorative corbels, and a deep shelf create a richly detailed traditional focal point.", dealerStory: "The statement piece of the assortment—ideal for premium showroom vignettes and custom-home work.", priceCents: 149500, msrpCents: 289500, leadTimeDays: 24, dimensions: '72–84" overall width', weightLbs: 410, ...sharedOptions, minOrderQty: 1, sku: "HS-PC-HAW", inStock: false, image: "/products/hawthorne.jpg", featured: true },
  { slug: "westbury", name: "Westbury", material: "precast", style: "traditional", collection: "Homestead Collection", description: "Tapered columns, a clean frieze, and a generous shelf bridge traditional and transitional interiors.", dealerStory: "A versatile classic that gives dealers a traditional look without excessive ornamentation.", priceCents: 109500, msrpCents: 209500, leadTimeDays: 21, dimensions: '66–78" overall width', weightLbs: 335, ...sharedOptions, minOrderQty: 1, sku: "HS-PC-WES", inStock: true, image: "/products/westbury.jpg" },
  { slug: "briarwood", name: "Briarwood", material: "precast", style: "traditional", collection: "Homestead Collection", description: "Elegant pilasters and restrained detailing make this a timeless, approachable surround.", dealerStory: "The safest traditional opening price point for independent hearth shops and remodeling contractors.", priceCents: 79500, msrpCents: 149500, leadTimeDays: 16, dimensions: '58–70" overall width', weightLbs: 275, ...sharedOptions, minOrderQty: 1, sku: "HS-PC-BRI", inStock: true, image: "/products/briarwood.jpg" },
  { slug: "fairmont", name: "Fairmont", material: "precast", style: "traditional", collection: "Homestead Collection", description: "Clean pilaster legs and a subtly detailed frieze create balanced, familiar proportions.", dealerStory: "A broad-appeal showroom staple suited to both formal and relaxed traditional rooms.", priceCents: 92500, msrpCents: 179500, leadTimeDays: 18, dimensions: '60–72" overall width', weightLbs: 300, ...sharedOptions, minOrderQty: 1, sku: "HS-PC-FAI", inStock: true, image: "/products/fairmont.jpg" },
  { slug: "winslow", name: "Winslow", material: "precast", style: "traditional", collection: "Homestead Collection", description: "Classical pilasters, cornice molding, and a generous shelf bring polished architectural character.", dealerStory: "A step-up traditional profile that supports healthy ticket size without moving into ornate territory.", priceCents: 119500, msrpCents: 229500, leadTimeDays: 21, dimensions: '66–78" overall width', weightLbs: 360, ...sharedOptions, minOrderQty: 1, sku: "HS-PC-WIN", inStock: false, image: "/products/winslow.jpg" },
  { slug: "grandview", name: "Grandview", material: "precast", style: "traditional", collection: "Homestead Collection", description: "Broad columns and a commanding shelf give this surround the scale required for estate-sized rooms.", dealerStory: "The grand-scale anchor for luxury residential, hospitality, and national furnishings conversations.", priceCents: 139500, msrpCents: 269500, leadTimeDays: 24, dimensions: '78–90" overall width', weightLbs: 435, ...sharedOptions, minOrderQty: 1, sku: "HS-PC-GRA", inStock: false, image: "/products/grandview.jpg" },
];

export function getProductBySlug(slug: string) { return products.find((p) => p.slug === slug); }
export function getProductBySku(sku: string) { return products.find((p) => p.sku === sku); }
export function getProductsByMaterial() { return products; }
