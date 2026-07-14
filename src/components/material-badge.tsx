import { cn } from "@/lib/utils";
import type { MantelMaterial } from "@/lib/data/products";

export function MaterialBadge({ material }: { material: MantelMaterial }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        material === "precast"
          ? "bg-steel/10 text-steel-dark"
          : "bg-ember/10 text-ember-dark"
      )}
    >
      {material === "precast" ? "Precast" : "Wood"}
    </span>
  );
}
