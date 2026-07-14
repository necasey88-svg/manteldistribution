export type MantelMaterial = "precast" | "wood";

export interface Product {
  slug: string;
  name: string;
  material: MantelMaterial;
  collection: string;
  description: string;
  priceCents: number; // dealer net price
  msrpCents: number;
  leadTimeDays: number;
  dimensions: string;
  weightLbs: number;
  finish: string[];
  minOrderQty: number;
  sku: string;
  inStock: boolean;
}

// Placeholder catalog data. Swap this module for a Supabase query
// (`select * from products`) once the database is connected — see
// supabase/schema.sql and src/lib/supabase/server.ts.
export const products: Product[] = [
  {
    slug: "somerset-precast-mantel",
    name: "Somerset Precast Mantel",
    material: "precast",
    collection: "Heritage Precast",
    description:
      "Cast stone surround with a hand-tooled limestone finish. Our most-specified precast profile for full-surround fireplace installs.",
    priceCents: 68000,
    msrpCents: 129000,
    leadTimeDays: 21,
    dimensions: '72"W x 52"H x 8"D',
    weightLbs: 310,
    finish: ["Natural Limestone", "Aged Ivory", "Charcoal Wash"],
    minOrderQty: 1,
    sku: "HL-PC-SOM-72",
    inStock: true,
  },
  {
    slug: "ashford-precast-mantel-shelf",
    name: "Ashford Precast Mantel Shelf",
    material: "precast",
    collection: "Heritage Precast",
    description:
      "Floating cast stone shelf profile designed for retrofit over existing masonry or drywall surrounds.",
    priceCents: 41000,
    msrpCents: 79000,
    leadTimeDays: 14,
    dimensions: '60"W x 6"H x 10"D',
    weightLbs: 145,
    finish: ["Natural Limestone", "Aged Ivory"],
    minOrderQty: 1,
    sku: "HL-PC-ASH-60",
    inStock: true,
  },
  {
    slug: "birchwood-oak-mantel",
    name: "Birchwood Solid Oak Mantel",
    material: "wood",
    collection: "Timberline Collection",
    description:
      "Kiln-dried solid oak beam mantel, hand-sanded with a live-edge front face. Ships knock-down for freight efficiency.",
    priceCents: 52000,
    msrpCents: 98000,
    leadTimeDays: 18,
    dimensions: '72"W x 8"H x 9"D',
    weightLbs: 95,
    finish: ["Natural Oak", "Espresso", "Weathered Gray"],
    minOrderQty: 1,
    sku: "HL-WD-BIR-72",
    inStock: true,
  },
  {
    slug: "cambridge-reclaimed-beam-mantel",
    name: "Cambridge Reclaimed Beam Mantel",
    material: "wood",
    collection: "Timberline Collection",
    description:
      "Reclaimed barnwood beam with authentic saw marks and patina. Each piece is unique; grain and tone will vary.",
    priceCents: 61000,
    msrpCents: 115000,
    leadTimeDays: 25,
    dimensions: '66"W x 7"H x 8"D',
    weightLbs: 110,
    finish: ["Barnwood Natural", "Ebony Stain"],
    minOrderQty: 1,
    sku: "HL-WD-CAM-66",
    inStock: true,
  },
  {
    slug: "dalton-precast-corbel-mantel",
    name: "Dalton Precast Corbel Mantel",
    material: "precast",
    collection: "Estate Precast",
    description:
      "Traditional corbel-supported precast mantel with deep relief detailing, built for large-format masonry surrounds.",
    priceCents: 94000,
    msrpCents: 169000,
    leadTimeDays: 28,
    dimensions: '84"W x 54"H x 10"D',
    weightLbs: 410,
    finish: ["Natural Limestone", "Charcoal Wash"],
    minOrderQty: 1,
    sku: "HL-PC-DAL-84",
    inStock: false,
  },
  {
    slug: "prescott-painted-wood-mantel",
    name: "Prescott Painted Wood Mantel",
    material: "wood",
    collection: "Timberline Collection",
    description:
      "Poplar-core mantel with a factory-sprayed painted finish, built for high-volume retail programs.",
    priceCents: 38000,
    msrpCents: 72000,
    leadTimeDays: 12,
    dimensions: '60"W x 6"H x 8"D',
    weightLbs: 70,
    finish: ["Alpine White", "Graphite", "Custom Match (RAL)"],
    minOrderQty: 4,
    sku: "HL-WD-PRE-60",
    inStock: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByMaterial(material?: MantelMaterial): Product[] {
  if (!material) return products;
  return products.filter((p) => p.material === material);
}
